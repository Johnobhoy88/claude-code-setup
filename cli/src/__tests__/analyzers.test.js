/**
 * Unit tests for project analyzers
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getFreeTierMCPs, isValidAnalysisResult, formatAnalysisResult } from '../analyzers.js';

describe('analyzers', () => {
  describe('getFreeTierMCPs', () => {
    it('should return exactly 4 MCPs', () => {
      const result = getFreeTierMCPs();
      assert.strictEqual(result.mcps.length, 4, `Expected 4 MCPs but got ${result.mcps.length}: ${result.mcps.map(m => m.name).join(', ')}`);
    });

    it('should include context7, memory, puppeteer, and filesystem', () => {
      const result = getFreeTierMCPs();
      const names = result.mcps.map(m => m.name);
      
      assert.ok(names.includes('context7'), `should include context7, got: ${names.join(', ')}`);
      assert.ok(names.includes('memory'), `should include memory, got: ${names.join(', ')}`);
      assert.ok(names.includes('puppeteer'), `should include puppeteer, got: ${names.join(', ')}`);
      assert.ok(names.includes('filesystem'), `should include filesystem, got: ${names.join(', ')}`);
    });

    it('should mark all MCPs as required', () => {
      const result = getFreeTierMCPs();
      assert.ok(result.mcps.every(m => m.required === true));
    });

    it('should have generic framework', () => {
      const result = getFreeTierMCPs();
      assert.strictEqual(result.framework, 'generic');
    });

    it('should have default template', () => {
      const result = getFreeTierMCPs();
      assert.strictEqual(result.template, 'default');
    });
  });

  describe('isValidAnalysisResult', () => {
    it('should return true for valid result', () => {
      const valid = {
        mcps: [
          { name: 'test', package: '@test/mcp' }
        ]
      };
      assert.strictEqual(isValidAnalysisResult(valid), true);
    });

    it('should return false for null', () => {
      assert.strictEqual(isValidAnalysisResult(null), false);
    });

    it('should return false for missing mcps', () => {
      assert.strictEqual(isValidAnalysisResult({}), false);
    });

    it('should return false for non-array mcps', () => {
      assert.strictEqual(isValidAnalysisResult({ mcps: 'not-array' }), false);
    });

    it('should return false for MCP missing name', () => {
      const invalid = {
        mcps: [{ package: '@test/mcp' }]
      };
      assert.strictEqual(isValidAnalysisResult(invalid), false);
    });

    it('should return false for MCP missing package', () => {
      const invalid = {
        mcps: [{ name: 'test' }]
      };
      assert.strictEqual(isValidAnalysisResult(invalid), false);
    });
  });

  describe('formatAnalysisResult', () => {
    it('should include framework when not generic', () => {
      const result = {
        framework: 'nextjs',
        integrations: [],
        useCases: [],
        mcps: [],
        skills: [],
        template: 'default'
      };
      const formatted = formatAnalysisResult(result);
      assert.ok(formatted.includes('Framework: nextjs'));
    });

    it('should not include framework when generic', () => {
      const result = {
        framework: 'generic',
        integrations: [],
        useCases: [],
        mcps: [],
        skills: [],
        template: 'default'
      };
      const formatted = formatAnalysisResult(result);
      assert.ok(!formatted.includes('Framework:'));
    });

    it('should include integrations when present', () => {
      const result = {
        framework: 'generic',
        integrations: ['github', 'notion'],
        useCases: [],
        mcps: [],
        skills: [],
        template: 'default'
      };
      const formatted = formatAnalysisResult(result);
      assert.ok(formatted.includes('Integrations: github, notion'));
    });

    it('should include MCP count', () => {
      const result = {
        framework: 'generic',
        integrations: [],
        useCases: [],
        mcps: [
          { name: 'test1', package: '@test/1', required: true, requiresEnvVars: [], requiresOAuth: false },
          { name: 'test2', package: '@test/2', required: false, requiresEnvVars: [], requiresOAuth: false }
        ],
        skills: [],
        template: 'default'
      };
      const formatted = formatAnalysisResult(result);
      assert.ok(formatted.includes('Recommended MCPs (2)'));
    });
  });
});
