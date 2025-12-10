/**
 * Unit tests for token validators
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidJWTFormat, decodeJWTPayload, isTokenExpired } from '../validators.js';

describe('validators', () => {
  describe('isValidJWTFormat', () => {
    it('should return true for valid JWT format', () => {
      // Valid JWT structure (3 base64url parts)
      const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      assert.strictEqual(isValidJWTFormat(validJWT), true);
    });

    it('should return false for null/undefined', () => {
      assert.strictEqual(isValidJWTFormat(null), false);
      assert.strictEqual(isValidJWTFormat(undefined), false);
    });

    it('should return false for non-string', () => {
      assert.strictEqual(isValidJWTFormat(123), false);
      assert.strictEqual(isValidJWTFormat({}), false);
    });

    it('should return false for string with wrong number of parts', () => {
      assert.strictEqual(isValidJWTFormat('part1.part2'), false);
      assert.strictEqual(isValidJWTFormat('part1.part2.part3.part4'), false);
    });

    it('should return false for empty parts', () => {
      assert.strictEqual(isValidJWTFormat('..'), false);
      assert.strictEqual(isValidJWTFormat('.part2.part3'), false);
    });

    it('should return false for invalid base64url characters', () => {
      assert.strictEqual(isValidJWTFormat('abc!.def@.ghi#'), false);
    });
  });

  describe('decodeJWTPayload', () => {
    it('should decode valid JWT payload', () => {
      // JWT with payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const payload = decodeJWTPayload(jwt);
      
      assert.strictEqual(payload.sub, '1234567890');
      assert.strictEqual(payload.name, 'John Doe');
      assert.strictEqual(payload.iat, 1516239022);
    });

    it('should return null for invalid JWT', () => {
      assert.strictEqual(decodeJWTPayload('invalid'), null);
      assert.strictEqual(decodeJWTPayload(null), null);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
      assert.strictEqual(isTokenExpired(expiredPayload), true);
    });

    it('should return false for valid token', () => {
      const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour from now
      assert.strictEqual(isTokenExpired(validPayload), false);
    });

    it('should return true for missing exp', () => {
      assert.strictEqual(isTokenExpired({}), true);
      assert.strictEqual(isTokenExpired(null), true);
    });
  });
});
