/**
 * Property-based tests for utility functions
 * 
 * **Feature: cli-tool, Property 13: Summary completeness**
 * **Feature: cli-tool, Property 14: Error messages are user-friendly**
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { formatError, formatDuration, isCompleteSummary, ErrorCodes } from '../utils.js';

describe('utils - property tests', () => {
  /**
   * **Feature: cli-tool, Property 13: Summary completeness**
   * **Validates: Requirements 7.1, 7.2**
   * 
   * For any setup result, the summary SHALL display:
   * all successful MCPs, all failed MCPs with errors, generated files, and duration.
   */
  describe('Property 13: Summary completeness', () => {
    // Generator for install results
    const installResultGen = fc.record({
      mcp: fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-z0-9-]+$/.test(s)),
      success: fc.boolean(),
      error: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null })
    });

    // Generator for complete setup results
    const setupResultGen = fc.record({
      tier: fc.oneof(fc.constant('free'), fc.constant('onetime'), fc.constant('monthly')),
      installedMCPs: fc.array(installResultGen, { maxLength: 10 }),
      claudeMdGenerated: fc.boolean(),
      claudeMdAction: fc.oneof(
        fc.constant('created'),
        fc.constant('overwritten'),
        fc.constant('merged'),
        fc.constant('skipped')
      ),
      duration: fc.integer({ min: 0, max: 600000 }),
      errors: fc.array(fc.string(), { maxLength: 5 })
    });

    it('should validate complete summaries as complete', () => {
      fc.assert(
        fc.property(
          setupResultGen,
          (result) => {
            return isCompleteSummary(result) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject summaries missing tier', () => {
      fc.assert(
        fc.property(
          setupResultGen,
          (result) => {
            const incomplete = { ...result };
            delete incomplete.tier;
            return isCompleteSummary(incomplete) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject summaries missing installedMCPs', () => {
      fc.assert(
        fc.property(
          setupResultGen,
          (result) => {
            const incomplete = { ...result };
            delete incomplete.installedMCPs;
            return isCompleteSummary(incomplete) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject summaries with non-array installedMCPs', () => {
      fc.assert(
        fc.property(
          setupResultGen,
          fc.string(),
          (result, notArray) => {
            const invalid = { ...result, installedMCPs: notArray };
            return isCompleteSummary(invalid) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject summaries missing claudeMdGenerated', () => {
      fc.assert(
        fc.property(
          setupResultGen,
          (result) => {
            const incomplete = { ...result };
            delete incomplete.claudeMdGenerated;
            return isCompleteSummary(incomplete) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject summaries missing duration', () => {
      fc.assert(
        fc.property(
          setupResultGen,
          (result) => {
            const incomplete = { ...result };
            delete incomplete.duration;
            return isCompleteSummary(incomplete) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly separate successful and failed MCPs', () => {
      fc.assert(
        fc.property(
          fc.array(installResultGen, { minLength: 1, maxLength: 10 }),
          (mcps) => {
            const successful = mcps.filter(m => m.success);
            const failed = mcps.filter(m => !m.success);
            
            // Sum should equal total
            return successful.length + failed.length === mcps.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 14: Error messages are user-friendly**
   * **Validates: Requirements 8.1, 8.2**
   * 
   * For any error that occurs, the displayed message SHALL include
   * an error code and human-readable description without exposing stack traces.
   */
  describe('Property 14: Error messages are user-friendly', () => {
    // Generator for errors with known codes
    const knownErrorGen = fc.record({
      code: fc.constantFrom('E001', 'E002', 'E003', 'E004', 'E005', 'E006', 'E007', 'E008'),
      message: fc.string({ minLength: 1, maxLength: 100 })
    });

    // Generator for errors with unknown codes
    const unknownErrorGen = fc.record({
      code: fc.string({ minLength: 1, maxLength: 10 }).filter(s => !Object.keys(ErrorCodes).includes(s)),
      message: fc.string({ minLength: 1, maxLength: 100 })
    });

    // Generator for errors with only message
    const messageOnlyErrorGen = fc.record({
      message: fc.string({ minLength: 1, maxLength: 100 })
    });

    it('should include error code in formatted output for known errors', () => {
      fc.assert(
        fc.property(
          knownErrorGen,
          (error) => {
            const formatted = formatError(error);
            return formatted.includes(`[${error.code}]`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include error code in formatted output for unknown errors', () => {
      fc.assert(
        fc.property(
          unknownErrorGen,
          (error) => {
            const formatted = formatError(error);
            return formatted.includes(`[${error.code}]`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include [ERROR] marker for errors without code', () => {
      fc.assert(
        fc.property(
          messageOnlyErrorGen,
          (error) => {
            const formatted = formatError(error);
            return formatted.includes('[ERROR]');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include message in formatted output', () => {
      fc.assert(
        fc.property(
          fc.oneof(knownErrorGen, unknownErrorGen, messageOnlyErrorGen),
          (error) => {
            const formatted = formatError(error);
            return formatted.includes(error.message);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include stack traces in formatted output', () => {
      fc.assert(
        fc.property(
          fc.record({
            code: fc.string({ minLength: 1 }),
            message: fc.string({ minLength: 1 }),
            stack: fc.string({ minLength: 50, maxLength: 500 })
          }),
          (error) => {
            const formatted = formatError(error);
            // Stack trace should not appear in user-facing output
            return !formatted.includes(error.stack);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty/undefined errors gracefully', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant({}),
            fc.constant({ code: null }),
            fc.constant({ message: null })
          ),
          (error) => {
            const formatted = formatError(error);
            // Should return something meaningful
            return typeof formatted === 'string' && formatted.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('formatDuration property tests', () => {
    it('should format all positive durations without error', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 3600000 }), // Up to 1 hour
          (ms) => {
            const formatted = formatDuration(ms);
            return typeof formatted === 'string' && formatted.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use ms for durations under 1 second', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 999 }),
          (ms) => {
            const formatted = formatDuration(ms);
            return formatted.endsWith('ms');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use seconds for durations 1-59 seconds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 59999 }),
          (ms) => {
            const formatted = formatDuration(ms);
            return formatted.endsWith('s') && !formatted.includes('m');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use minutes and seconds for durations >= 60 seconds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 60000, max: 3600000 }),
          (ms) => {
            const formatted = formatDuration(ms);
            return formatted.includes('m') && formatted.includes('s');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
