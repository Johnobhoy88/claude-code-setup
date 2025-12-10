/**
 * Unit tests for MCP installers
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateMCPConfig, modifyMCPList, getMCPConfigPath } from '../installers.js';

describe('installers', () => {
  describe('generateMCPConfig', () => {
    it('should generate basic config for simple MCP', () => {
      const mcp = {
        name: 'memory',
        package: '@modelcontextprotocol/server-memory',
        required: true,
        requiresEnvVars: [],
        requiresOAuth: false
      };
      
      const config = generateMCPConfig(mcp);
      
      assert.strictEqual(config.command, 'npx');
      assert.deepStrictEqual(config.args, ['-y', '@modelcontextprotocol/server-memory']);
      assert.strictEqual(config.env, undefined);
    });

    it('should add project path for filesystem MCP', () => {
      const mcp = {
        name: 'filesystem',
        package: '@modelcontextprotocol/server-filesystem',
        required: true,
        requiresEnvVars: [],
        requiresOAuth: false
      };
      
      const config = generateMCPConfig(mcp);
      
      assert.strictEqual(config.args.length, 3);
      // Path is normalized to forward slashes for cross-platform JSON compatibility
      const expectedPath = process.cwd().replace(/\\/g, '/');
      assert.strictEqual(config.args[2], expectedPath);
    });

    it('should include environment variables when provided', () => {
      const mcp = {
        name: 'github',
        package: '@modelcontextprotocol/server-github',
        required: false,
        requiresEnvVars: ['GITHUB_TOKEN'],
        requiresOAuth: false
      };
      
      const envVars = { GITHUB_TOKEN: 'test-token' };
      const config = generateMCPConfig(mcp, envVars);
      
      assert.deepStrictEqual(config.env, { GITHUB_TOKEN: 'test-token' });
    });
  });

  describe('modifyMCPList', () => {
    const baseMCPs = [
      { name: 'filesystem', package: '@mcp/filesystem', required: true, requiresEnvVars: [], requiresOAuth: false },
      { name: 'memory', package: '@mcp/memory', required: true, requiresEnvVars: [], requiresOAuth: false },
      { name: 'github', package: '@mcp/github', required: false, requiresEnvVars: [], requiresOAuth: false }
    ];

    it('should add new MCPs', () => {
      const result = modifyMCPList(baseMCPs, { add: ['notion'] });
      
      assert.strictEqual(result.length, 4);
      assert.ok(result.some(m => m.name === 'notion'));
    });

    it('should remove non-required MCPs', () => {
      const result = modifyMCPList(baseMCPs, { remove: ['github'] });
      
      assert.strictEqual(result.length, 2);
      assert.ok(!result.some(m => m.name === 'github'));
    });

    it('should not remove required MCPs', () => {
      const result = modifyMCPList(baseMCPs, { remove: ['filesystem'] });
      
      assert.ok(result.some(m => m.name === 'filesystem'));
    });

    it('should not add duplicates', () => {
      const result = modifyMCPList(baseMCPs, { add: ['github'] });
      
      const githubCount = result.filter(m => m.name === 'github').length;
      assert.strictEqual(githubCount, 1);
    });

    it('should handle add and remove together', () => {
      const result = modifyMCPList(baseMCPs, { add: ['notion'], remove: ['github'] });
      
      assert.ok(result.some(m => m.name === 'notion'));
      assert.ok(!result.some(m => m.name === 'github'));
    });

    it('should preserve required MCPs after all operations', () => {
      const result = modifyMCPList(baseMCPs, { 
        add: ['notion'], 
        remove: ['filesystem', 'memory', 'github'] 
      });
      
      assert.ok(result.some(m => m.name === 'filesystem'));
      assert.ok(result.some(m => m.name === 'memory'));
    });
  });

  describe('getMCPConfigPath', () => {
    it('should return a string path', () => {
      const path = getMCPConfigPath();
      assert.strictEqual(typeof path, 'string');
    });

    it('should include claude in the path', () => {
      const path = getMCPConfigPath().toLowerCase();
      assert.ok(path.includes('claude'));
    });

    it('should end with json extension', () => {
      const path = getMCPConfigPath();
      assert.ok(path.endsWith('.json'));
    });
  });
});
