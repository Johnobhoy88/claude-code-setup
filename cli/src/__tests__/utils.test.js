/**
 * Unit tests for utility functions
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatError, formatDuration, isCompleteSummary } from '../utils.js';

describe('utils', () => {
  describe('formatError', () => {
    it('should format error with known code', () => {
      const error = { code: 'E001', message: 'Token expired' };
      const formatted = formatError(error);
      
      assert.ok(formatted.includes('[E001]'));
      assert.ok(formatted.includes('Token expired'));
    });

    it('should format error with unknown code', () => {
      const error = { code: 'UNKNOWN', message: 'Something went wrong' };
      const formatted = formatError(error);
      
      assert.ok(formatted.includes('[UNKNOWN]'));
      assert.ok(formatted.includes('Something went wrong'));
    });

    it('should format error with only message', () => {
      const error = { message: 'Generic error' };
      const formatted = formatError(error);
      
      assert.ok(formatted.includes('[ERROR]'));
      assert.ok(formatted.includes('Generic error'));
    });

    it('should handle error without message', () => {
      const error = {};
      const formatted = formatError(error);
      
      assert.ok(formatted.includes('[ERROR]'));
      assert.ok(formatted.includes('unexpected'));
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      assert.strictEqual(formatDuration(500), '500ms');
    });

    it('should format seconds', () => {
      assert.strictEqual(formatDuration(5000), '5s');
    });

    it('should format minutes and seconds', () => {
      assert.strictEqual(formatDuration(90000), '1m 30s');
    });

    it('should handle zero', () => {
      assert.strictEqual(formatDuration(0), '0ms');
    });

    it('should handle exactly one minute', () => {
      assert.strictEqual(formatDuration(60000), '1m 0s');
    });
  });

  describe('isCompleteSummary', () => {
    it('should return true for complete summary', () => {
      const summary = {
        tier: 'free',
        installedMCPs: [],
        claudeMdGenerated: true,
        claudeMdAction: 'created',
        duration: 1000,
        errors: []
      };
      
      assert.strictEqual(isCompleteSummary(summary), true);
    });

    it('should return false for missing tier', () => {
      const summary = {
        installedMCPs: [],
        claudeMdGenerated: true,
        duration: 1000
      };
      
      assert.strictEqual(isCompleteSummary(summary), false);
    });

    it('should return false for missing installedMCPs', () => {
      const summary = {
        tier: 'free',
        claudeMdGenerated: true,
        duration: 1000
      };
      
      assert.strictEqual(isCompleteSummary(summary), false);
    });

    it('should return false for non-array installedMCPs', () => {
      const summary = {
        tier: 'free',
        installedMCPs: 'not-array',
        claudeMdGenerated: true,
        duration: 1000
      };
      
      assert.strictEqual(isCompleteSummary(summary), false);
    });

    it('should return false for missing claudeMdGenerated', () => {
      const summary = {
        tier: 'free',
        installedMCPs: [],
        duration: 1000
      };
      
      assert.strictEqual(isCompleteSummary(summary), false);
    });

    it('should return false for missing duration', () => {
      const summary = {
        tier: 'free',
        installedMCPs: [],
        claudeMdGenerated: true
      };
      
      assert.strictEqual(isCompleteSummary(summary), false);
    });
  });
});
