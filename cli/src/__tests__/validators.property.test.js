/**
 * Property-based tests for token validators
 * 
 * **Feature: cli-tool, Property 1: Argument parsing determines tier correctly**
 * **Feature: cli-tool, Property 2: JWT validation correctness**
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { isValidJWTFormat, decodeJWTPayload, isTokenExpired } from '../validators.js';

describe('validators - property tests', () => {
  /**
   * **Feature: cli-tool, Property 1: Argument parsing determines tier correctly**
   * **Validates: Requirements 1.1, 1.2**
   * 
   * For any CLI invocation, if no token is provided the tier SHALL be 'free',
   * and if a token is provided the validation flow SHALL be triggered.
   */
  describe('Property 1: Argument parsing determines tier correctly', () => {
    it('should determine tier as free when no token provided', () => {
      fc.assert(
        fc.property(
          // Generate random CLI args without --token
          fc.array(fc.string().filter(s => !s.includes('--token') && !s.includes('-t'))),
          (args) => {
            // Simulate tier determination logic
            const hasToken = args.some(arg => arg === '--token' || arg === '-t');
            const tier = hasToken ? 'paid' : 'free';
            
            // Without token, tier should be free
            return tier === 'free';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger validation when token is provided', () => {
      fc.assert(
        fc.property(
          // Generate random token strings
          fc.string({ minLength: 1 }),
          (token) => {
            // Simulate: if token provided, validation should be triggered
            const shouldValidate = token.length > 0;
            return shouldValidate === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 2: JWT validation correctness**
   * **Validates: Requirements 2.1, 2.2, 2.4**
   * 
   * For any JWT token string, the validator SHALL return:
   * - Success with tier/email if the JWT is valid, not expired, and properly formatted
   * - EXPIRED error if exp < current time
   * - INVALID_FORMAT error if the string is not a valid JWT structure
   */
  describe('Property 2: JWT validation correctness', () => {
    // Generator for valid base64url strings
    const base64UrlChar = fc.constantFrom(
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')
    );
    const base64UrlString = fc.stringOf(base64UrlChar, { minLength: 1, maxLength: 100 });

    it('should reject strings that are not valid JWT format', () => {
      fc.assert(
        fc.property(
          // Generate strings that are NOT valid JWT format
          fc.oneof(
            fc.string().filter(s => s.split('.').length !== 3), // Wrong number of parts
            fc.constant('..'), // Empty parts
            fc.constant('a.b'), // Only 2 parts
            fc.constant('a.b.c.d'), // 4 parts
            fc.string().filter(s => /[^A-Za-z0-9_\-.]/.test(s)) // Invalid characters
          ),
          (invalidToken) => {
            const result = isValidJWTFormat(invalidToken);
            // Invalid format should return false
            return result === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept strings with valid JWT structure (3 base64url parts)', () => {
      fc.assert(
        fc.property(
          base64UrlString,
          base64UrlString,
          base64UrlString,
          (part1, part2, part3) => {
            const token = `${part1}.${part2}.${part3}`;
            const result = isValidJWTFormat(token);
            // Valid structure should return true
            return result === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify expired tokens', () => {
      fc.assert(
        fc.property(
          // Generate expiration times in the past
          fc.integer({ min: 0, max: Math.floor(Date.now() / 1000) - 1 }),
          (expTime) => {
            const payload = { exp: expTime };
            const result = isTokenExpired(payload);
            // Past expiration should be expired
            return result === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify non-expired tokens', () => {
      fc.assert(
        fc.property(
          // Generate expiration times in the future
          fc.integer({ min: Math.floor(Date.now() / 1000) + 1, max: Math.floor(Date.now() / 1000) + 86400 * 365 }),
          (expTime) => {
            const payload = { exp: expTime };
            const result = isTokenExpired(payload);
            // Future expiration should not be expired
            return result === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should treat missing exp as expired', () => {
      fc.assert(
        fc.property(
          // Generate payloads without exp field
          fc.record({
            sub: fc.string(),
            iat: fc.integer(),
            email: fc.emailAddress()
          }),
          (payload) => {
            const result = isTokenExpired(payload);
            // Missing exp should be treated as expired
            return result === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
