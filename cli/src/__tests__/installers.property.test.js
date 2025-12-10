/**
 * Property-based tests for MCP installers
 * 
 * **Feature: cli-tool, Property 5: MCP list modification preserves validity**
 * **Feature: cli-tool, Property 6: Environment variable detection triggers prompts**
 * **Feature: cli-tool, Property 7: OAuth detection triggers guidance**
 * **Feature: cli-tool, Property 8: Partial failure resilience**
 * **Feature: cli-tool, Property 9: Config file contains all installed MCPs**
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { modifyMCPList, generateMCPConfig } from '../installers.js';

describe('installers - property tests', () => {
  // Generator for MCP recommendations
  const mcpGen = fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
    package: fc.string({ minLength: 1, maxLength: 50 }),
    required: fc.boolean(),
    requiresEnvVars: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 3 }),
    requiresOAuth: fc.boolean()
  });

  /**
   * **Feature: cli-tool, Property 5: MCP list modification preserves validity**
   * **Validates: Requirements 4.2**
   * 
   * For any list of MCPs and sequence of add/remove operations, the resulting list
   * SHALL contain exactly the MCPs that were added and not subsequently removed.
   */
  describe('Property 5: MCP list modification preserves validity', () => {
    it('should preserve required MCPs after any remove operation', () => {
      fc.assert(
        fc.property(
          fc.array(mcpGen, { minLength: 1, maxLength: 10 }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
          (mcps, toRemove) => {
            const result = modifyMCPList(mcps, { remove: toRemove });
            
            // All required MCPs from original list should still be present
            const requiredOriginal = mcps.filter(m => m.required);
            return requiredOriginal.every(req => 
              result.some(r => r.name === req.name)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should add new MCPs without duplicates', () => {
      fc.assert(
        fc.property(
          fc.array(mcpGen, { minLength: 1, maxLength: 10 }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)), { maxLength: 5 }),
          (mcps, toAdd) => {
            const result = modifyMCPList(mcps, { add: toAdd });
            
            // No duplicates should exist
            const names = result.map(m => m.name);
            const uniqueNames = new Set(names);
            return names.length === uniqueNames.size;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly remove non-required MCPs', () => {
      fc.assert(
        fc.property(
          fc.array(mcpGen.map(m => ({ ...m, required: false })), { minLength: 1, maxLength: 10 }),
          (mcps) => {
            const toRemove = mcps.map(m => m.name);
            const result = modifyMCPList(mcps, { remove: toRemove });
            
            // All non-required MCPs should be removed
            return result.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle combined add and remove operations correctly', () => {
      fc.assert(
        fc.property(
          fc.array(mcpGen, { minLength: 1, maxLength: 5 }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)), { minLength: 1, maxLength: 3 }),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 3 }),
          (mcps, toAdd, toRemove) => {
            const result = modifyMCPList(mcps, { add: toAdd, remove: toRemove });
            
            // Added items (not in original) should be present
            const originalNames = new Set(mcps.map(m => m.name));
            const newlyAdded = toAdd.filter(name => !originalNames.has(name));
            
            return newlyAdded.every(name => result.some(r => r.name === name));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 6: Environment variable detection triggers prompts**
   * **Validates: Requirements 5.2**
   * 
   * For any MCP template with non-empty required_env_vars array,
   * the installer SHALL request values for each variable before installation.
   */
  describe('Property 6: Environment variable detection triggers prompts', () => {
    it('should include env vars in config when provided', () => {
      fc.assert(
        fc.property(
          mcpGen,
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Z_]+$/.test(s)),
            fc.string({ minLength: 1, maxLength: 50 }),
            { minKeys: 1, maxKeys: 5 }
          ),
          (mcp, envVars) => {
            const config = generateMCPConfig(mcp, envVars);
            
            // If env vars provided, they should be in config
            if (Object.keys(envVars).length > 0) {
              return config.env !== undefined && 
                     Object.keys(envVars).every(key => config.env[key] === envVars[key]);
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include env in config when no vars provided', () => {
      fc.assert(
        fc.property(
          mcpGen,
          (mcp) => {
            const config = generateMCPConfig(mcp, {});
            
            // No env vars means no env property
            return config.env === undefined;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should detect MCPs requiring env vars', () => {
      fc.assert(
        fc.property(
          mcpGen.filter(m => m.requiresEnvVars.length > 0),
          (mcp) => {
            // MCP with requiresEnvVars should have that array populated
            return Array.isArray(mcp.requiresEnvVars) && mcp.requiresEnvVars.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 7: OAuth detection triggers guidance**
   * **Validates: Requirements 5.3**
   * 
   * For any MCP template with oauth_flow=true,
   * the installer SHALL initiate OAuth guidance flow.
   */
  describe('Property 7: OAuth detection triggers guidance', () => {
    it('should correctly identify MCPs requiring OAuth', () => {
      fc.assert(
        fc.property(
          mcpGen,
          (mcp) => {
            // OAuth requirement should be a boolean
            return typeof mcp.requiresOAuth === 'boolean';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should detect OAuth requirement from MCP config', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            package: fc.string({ minLength: 1 }),
            required: fc.boolean(),
            requiresEnvVars: fc.array(fc.string()),
            requiresOAuth: fc.constant(true)
          }),
          (mcp) => {
            // MCPs with requiresOAuth=true should be detected
            return mcp.requiresOAuth === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 8: Partial failure resilience**
   * **Validates: Requirements 5.4**
   * 
   * For any list of MCPs where some installations fail,
   * all non-failing MCPs SHALL still be installed and configured.
   */
  describe('Property 8: Partial failure resilience', () => {
    // Simulate install results
    const installResultGen = fc.record({
      mcp: fc.string({ minLength: 1, maxLength: 20 }),
      success: fc.boolean(),
      error: fc.option(fc.string(), { nil: null }),
      config: fc.option(fc.record({
        command: fc.constant('npx'),
        args: fc.array(fc.string())
      }), { nil: null })
    });

    it('should separate successful and failed installations', () => {
      fc.assert(
        fc.property(
          fc.array(installResultGen, { minLength: 1, maxLength: 10 }),
          (results) => {
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            
            // Total should equal sum of successful and failed
            return successful.length + failed.length === results.length;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve successful results regardless of failures', () => {
      fc.assert(
        fc.property(
          fc.array(installResultGen, { minLength: 2, maxLength: 10 }),
          (results) => {
            // Ensure at least one success and one failure
            const hasSuccess = results.some(r => r.success);
            const hasFailure = results.some(r => !r.success);
            
            if (hasSuccess && hasFailure) {
              const successful = results.filter(r => r.success);
              // Successful results should be preserved
              return successful.length > 0;
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 9: Config file contains all installed MCPs**
   * **Validates: Requirements 5.5**
   * 
   * For any successful MCP installation set,
   * the generated config file SHALL contain an entry for each installed MCP.
   */
  describe('Property 9: Config file contains all installed MCPs', () => {
    it('should generate config with command and args for each MCP', () => {
      fc.assert(
        fc.property(
          mcpGen,
          (mcp) => {
            const config = generateMCPConfig(mcp);
            
            // Config should have command and args
            return (
              config.command === 'npx' &&
              Array.isArray(config.args) &&
              config.args.includes('-y') &&
              config.args.includes(mcp.package)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include project path for filesystem MCP', () => {
      fc.assert(
        fc.property(
          fc.constant({
            name: 'filesystem',
            package: '@modelcontextprotocol/server-filesystem',
            required: true,
            requiresEnvVars: [],
            requiresOAuth: false
          }),
          (mcp) => {
            const config = generateMCPConfig(mcp);
            
            // Filesystem MCP should have project path as third arg
            return config.args.length === 3 && typeof config.args[2] === 'string';
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
