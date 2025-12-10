/**
 * Property-based tests for project analyzers
 * 
 * **Feature: claude-setup-v2, Property 4: Free tier installs exactly 4 MCPs**
 * **Feature: claude-setup-v2, Property 8: API response display completeness**
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { getFreeTierMCPs, isValidAnalysisResult, formatAnalysisResult } from '../analyzers.js';

describe('analyzers - property tests', () => {
  /**
   * **Feature: claude-setup-v2, Property 4: Free tier installs exactly 4 MCPs**
   * **Validates: Requirements 3.1**
   * 
   * For any free tier session, the offered MCPs SHALL be exactly:
   * context7, memory, puppeteer, and filesystem - no more, no less.
   */
  describe('Property 4: Free tier installs exactly 4 MCPs', () => {
    it('should always return exactly 4 MCPs for free tier', () => {
      fc.assert(
        fc.property(
          // Generate any number of calls (simulating multiple invocations)
          fc.integer({ min: 1, max: 100 }),
          (numCalls) => {
            for (let i = 0; i < numCalls; i++) {
              const result = getFreeTierMCPs();
              if (result.mcps.length !== 4) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always include context7, memory, puppeteer, and filesystem', () => {
      fc.assert(
        fc.property(
          fc.constant(null), // No input needed, just verify invariant
          () => {
            const result = getFreeTierMCPs();
            const names = result.mcps.map(m => m.name);
            
            return (
              names.includes('context7') &&
              names.includes('memory') &&
              names.includes('puppeteer') &&
              names.includes('filesystem') &&
              names.length === 4
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should mark all free tier MCPs as required', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const result = getFreeTierMCPs();
            return result.mcps.every(mcp => mcp.required === true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have no env vars or OAuth requirements for free tier MCPs', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const result = getFreeTierMCPs();
            return result.mcps.every(mcp => 
              mcp.requiresEnvVars.length === 0 && 
              mcp.requiresOAuth === false
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 4: API response display completeness**
   * **Validates: Requirements 3.2**
   * 
   * For any valid API analysis response, the displayed output SHALL contain
   * all recommended MCPs, skills, and the template name.
   */
  describe('Property 4: API response display completeness', () => {
    // Generator for valid MCP recommendations
    const mcpGen = fc.record({
      name: fc.string({ minLength: 1, maxLength: 30 }).filter(s => !s.includes('\n')),
      package: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('\n')),
      required: fc.boolean(),
      requiresEnvVars: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 3 }),
      requiresOAuth: fc.boolean()
    });

    // Generator for valid analysis results
    const analysisResultGen = fc.record({
      framework: fc.oneof(fc.constant('generic'), fc.constant('nextjs'), fc.constant('python-ml')),
      integrations: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('\n')), { maxLength: 5 }),
      useCases: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('\n')), { maxLength: 5 }),
      mcps: fc.array(mcpGen, { minLength: 1, maxLength: 10 }),
      skills: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('\n')), { maxLength: 5 }),
      template: fc.string({ minLength: 1, maxLength: 30 }).filter(s => !s.includes('\n'))
    });

    it('should include all MCP names in formatted output', () => {
      fc.assert(
        fc.property(
          analysisResultGen,
          (result) => {
            const formatted = formatAnalysisResult(result);
            
            // Every MCP name should appear in the output
            return result.mcps.every(mcp => formatted.includes(mcp.name));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include MCP count in formatted output', () => {
      fc.assert(
        fc.property(
          analysisResultGen,
          (result) => {
            const formatted = formatAnalysisResult(result);
            
            // Should show the count of MCPs
            return formatted.includes(`(${result.mcps.length})`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include skills when present', () => {
      fc.assert(
        fc.property(
          analysisResultGen.filter(r => r.skills.length > 0),
          (result) => {
            const formatted = formatAnalysisResult(result);
            
            // Skills section should appear and contain skill names
            return formatted.includes('Skills:') && 
                   result.skills.every(skill => formatted.includes(skill));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include integrations when present', () => {
      fc.assert(
        fc.property(
          analysisResultGen.filter(r => r.integrations.length > 0),
          (result) => {
            const formatted = formatAnalysisResult(result);
            
            // Integrations should appear
            return formatted.includes('Integrations:');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include framework when not generic', () => {
      fc.assert(
        fc.property(
          analysisResultGen.filter(r => r.framework !== 'generic'),
          (result) => {
            const formatted = formatAnalysisResult(result);
            
            // Framework should appear
            return formatted.includes('Framework:') && formatted.includes(result.framework);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
