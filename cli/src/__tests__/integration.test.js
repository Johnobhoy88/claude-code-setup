/**
 * Integration tests for CLI tool
 * Tests end-to-end flows with mocked API responses
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getFreeTierMCPs, isValidAnalysisResult } from '../analyzers.js';
import { isValidJWTFormat } from '../validators.js';
import { generateMCPConfig, modifyMCPList } from '../installers.js';
import { renderTemplate, getTemplate, mergeClaudeMd } from '../generators.js';
import { formatError, formatDuration, isCompleteSummary } from '../utils.js';

describe('Integration Tests', () => {
  describe('Free tier flow', () => {
    it('should complete free tier setup flow', () => {
      // 1. Get free tier MCPs (now 4: context7, memory, puppeteer, filesystem)
      const recommendations = getFreeTierMCPs();
      assert.strictEqual(recommendations.mcps.length, 4);
      assert.strictEqual(recommendations.framework, 'generic');
      
      // 2. Validate recommendations
      assert.ok(isValidAnalysisResult(recommendations));
      
      // 3. Verify correct MCPs
      const mcpNames = recommendations.mcps.map(m => m.name);
      assert.ok(mcpNames.includes('context7'));
      assert.ok(mcpNames.includes('memory'));
      assert.ok(mcpNames.includes('puppeteer'));
      assert.ok(mcpNames.includes('filesystem'));
      
      // 4. Generate configs for each MCP
      const configs = recommendations.mcps.map(mcp => ({
        name: mcp.name,
        config: generateMCPConfig(mcp)
      }));
      
      assert.strictEqual(configs.length, 4);
      configs.forEach(c => {
        assert.strictEqual(c.config.command, 'npx');
        assert.ok(Array.isArray(c.config.args));
      });
      
      // 5. Generate CLAUDE.md
      const template = getTemplate('generic');
      const rendered = renderTemplate(template, {
        mcps: recommendations.mcps.map(m => m.name),
        skills: []
      });
      
      assert.ok(rendered.includes('context7'));
      assert.ok(rendered.includes('memory'));
      assert.ok(rendered.includes('puppeteer'));
      assert.ok(rendered.includes('filesystem'));
      
      // 6. Create summary
      const summary = {
        tier: 'free',
        installedMCPs: configs.map(c => ({ mcp: c.name, success: true, error: null })),
        claudeMdGenerated: true,
        claudeMdAction: 'created',
        duration: 5000,
        errors: []
      };
      
      assert.ok(isCompleteSummary(summary));
    });
  });

  describe('Paid tier flow with valid token', () => {
    it('should validate token format correctly', () => {
      // Valid JWT format
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjo5OTk5OTk5OTk5fQ.signature';
      assert.ok(isValidJWTFormat(validToken));
      
      // Invalid formats
      assert.ok(!isValidJWTFormat('invalid'));
      assert.ok(!isValidJWTFormat('a.b'));
      assert.ok(!isValidJWTFormat(null));
    });

    it('should process API response and generate config', () => {
      // Simulated API response
      const apiResponse = {
        framework: 'nextjs',
        integrations: ['github', 'notion'],
        useCases: ['web-dev'],
        mcps: [
          { name: 'filesystem', package: '@mcp/filesystem', required: true, requiresEnvVars: [], requiresOAuth: false },
          { name: 'github', package: '@mcp/github', required: false, requiresEnvVars: ['GITHUB_TOKEN'], requiresOAuth: false },
          { name: 'notion', package: '@mcp/notion', required: false, requiresEnvVars: ['NOTION_TOKEN'], requiresOAuth: false }
        ],
        skills: ['web-dev-expert'],
        template: 'nextjs'
      };
      
      assert.ok(isValidAnalysisResult(apiResponse));
      
      // Generate configs
      const configs = apiResponse.mcps.map(mcp => {
        const envVars = {};
        if (mcp.name === 'github') envVars.GITHUB_TOKEN = 'test-token';
        if (mcp.name === 'notion') envVars.NOTION_TOKEN = 'test-token';
        return {
          name: mcp.name,
          config: generateMCPConfig(mcp, envVars)
        };
      });
      
      // Verify github config has env vars
      const githubConfig = configs.find(c => c.name === 'github');
      assert.ok(githubConfig.config.env);
      assert.strictEqual(githubConfig.config.env.GITHUB_TOKEN, 'test-token');
      
      // Generate CLAUDE.md with nextjs template
      const template = getTemplate('nextjs');
      assert.ok(template.includes('Next.js'));
    });
  });

  describe('MCP modification flow', () => {
    it('should handle add and remove operations', () => {
      const initialMCPs = [
        { name: 'filesystem', package: '@mcp/filesystem', required: true, requiresEnvVars: [], requiresOAuth: false },
        { name: 'memory', package: '@mcp/memory', required: true, requiresEnvVars: [], requiresOAuth: false },
        { name: 'github', package: '@mcp/github', required: false, requiresEnvVars: [], requiresOAuth: false }
      ];
      
      // User removes github, adds notion
      const modified = modifyMCPList(initialMCPs, {
        add: ['notion'],
        remove: ['github']
      });
      
      assert.ok(modified.some(m => m.name === 'filesystem')); // required, kept
      assert.ok(modified.some(m => m.name === 'memory')); // required, kept
      assert.ok(!modified.some(m => m.name === 'github')); // removed
      assert.ok(modified.some(m => m.name === 'notion')); // added
    });

    it('should not remove required MCPs', () => {
      const initialMCPs = [
        { name: 'filesystem', package: '@mcp/filesystem', required: true, requiresEnvVars: [], requiresOAuth: false },
        { name: 'memory', package: '@mcp/memory', required: true, requiresEnvVars: [], requiresOAuth: false }
      ];
      
      // Try to remove required MCPs
      const modified = modifyMCPList(initialMCPs, {
        remove: ['filesystem', 'memory']
      });
      
      // Required MCPs should still be present
      assert.strictEqual(modified.length, 2);
      assert.ok(modified.some(m => m.name === 'filesystem'));
      assert.ok(modified.some(m => m.name === 'memory'));
    });
  });

  describe('CLAUDE.md merge flow', () => {
    it('should merge existing and new content', () => {
      const existing = `# CLAUDE.md

## Custom Notes

My custom project notes.

## Installed MCPs

- old-mcp
`;
      
      const generated = `# CLAUDE.md

## Project Overview

Auto-generated overview.

## Installed MCPs

- new-mcp
`;
      
      const merged = mergeClaudeMd(existing, generated);
      
      // Should have all sections
      assert.ok(merged.includes('Custom Notes'));
      assert.ok(merged.includes('My custom project notes'));
      assert.ok(merged.includes('Project Overview'));
      assert.ok(merged.includes('old-mcp'));
      assert.ok(merged.includes('new-mcp'));
    });
  });

  describe('Error handling flow', () => {
    it('should format various error types correctly', () => {
      // Known error code
      const knownError = { code: 'E001', message: 'Token expired' };
      const formatted1 = formatError(knownError);
      assert.ok(formatted1.includes('[E001]'));
      assert.ok(formatted1.includes('Token expired'));
      
      // Unknown error code
      const unknownError = { code: 'UNKNOWN', message: 'Something went wrong' };
      const formatted2 = formatError(unknownError);
      assert.ok(formatted2.includes('[UNKNOWN]'));
      
      // Error without code
      const noCodeError = { message: 'Generic error' };
      const formatted3 = formatError(noCodeError);
      assert.ok(formatted3.includes('[ERROR]'));
      assert.ok(formatted3.includes('Generic error'));
    });

    it('should format durations correctly', () => {
      assert.strictEqual(formatDuration(500), '500ms');
      assert.strictEqual(formatDuration(5000), '5s');
      assert.strictEqual(formatDuration(65000), '1m 5s');
    });
  });

  describe('Summary validation', () => {
    it('should validate complete summaries', () => {
      const validSummary = {
        tier: 'free',
        installedMCPs: [
          { mcp: 'filesystem', success: true, error: null },
          { mcp: 'memory', success: true, error: null }
        ],
        claudeMdGenerated: true,
        claudeMdAction: 'created',
        duration: 3000,
        errors: []
      };
      
      assert.ok(isCompleteSummary(validSummary));
    });

    it('should reject incomplete summaries', () => {
      const missingTier = {
        installedMCPs: [],
        claudeMdGenerated: true,
        duration: 1000
      };
      assert.ok(!isCompleteSummary(missingTier));
      
      const missingMCPs = {
        tier: 'free',
        claudeMdGenerated: true,
        duration: 1000
      };
      assert.ok(!isCompleteSummary(missingMCPs));
    });

    it('should handle partial success scenarios', () => {
      const partialSuccess = {
        tier: 'onetime',
        installedMCPs: [
          { mcp: 'filesystem', success: true, error: null },
          { mcp: 'github', success: false, error: 'Missing GITHUB_TOKEN' }
        ],
        claudeMdGenerated: true,
        claudeMdAction: 'created',
        duration: 5000,
        errors: ['Missing GITHUB_TOKEN']
      };
      
      assert.ok(isCompleteSummary(partialSuccess));
      
      const successful = partialSuccess.installedMCPs.filter(m => m.success);
      const failed = partialSuccess.installedMCPs.filter(m => !m.success);
      
      assert.strictEqual(successful.length, 1);
      assert.strictEqual(failed.length, 1);
    });
  });
});
