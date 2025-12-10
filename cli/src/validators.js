/**
 * Token validation module
 * Handles JWT format validation and API-based token verification
 */

import fetch from 'node-fetch';

function getApiBaseUrl() {
  const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error('API_BASE_URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.');
  }
  return url.replace(/\/+$/, '');
}

/**
 * Error codes for token validation
 */
export const TokenErrorCodes = {
  EXPIRED: 'E001',
  USED: 'E002',
  INVALID_FORMAT: 'E003',
  NETWORK_ERROR: 'E004',
  API_ERROR: 'E005'
};

/**
 * Validates JWT format locally (basic structure check)
 * @param {string} token - JWT token string
 * @returns {boolean} - Whether token has valid JWT structure
 */
export function isValidJWTFormat(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  // Check each part is valid base64url
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every(part => part.length > 0 && base64UrlRegex.test(part));
}

/**
 * Decodes JWT payload without verification (for local checks)
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded payload or null if invalid
 */
export function decodeJWTPayload(token) {
  if (!isValidJWTFormat(token)) {
    return null;
  }
  
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Checks if token is expired based on exp claim
 * @param {object} payload - Decoded JWT payload
 * @returns {boolean} - Whether token is expired
 */
export function isTokenExpired(payload) {
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }
  return payload.exp < Math.floor(Date.now() / 1000);
}

/**
 * Validates token against the backend API
 * @param {string} token - JWT token string
 * @returns {Promise<TokenValidationResult>}
 */
export async function validateToken(token) {
  // Local format check first
  if (!isValidJWTFormat(token)) {
    return {
      valid: false,
      error: {
        code: TokenErrorCodes.INVALID_FORMAT,
        message: 'Invalid token format. Please check your token and try again.'
      }
    };
  }
  
  // Check expiration locally
  const payload = decodeJWTPayload(token);
  if (isTokenExpired(payload)) {
    return {
      valid: false,
      error: {
        code: TokenErrorCodes.EXPIRED,
        message: 'Your token has expired. Please purchase a new one at highlandai.com'
      }
    };
  }
  
  // Validate with API
  try {
    const response = await fetch(`${getApiBaseUrl()}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      
      if (data.code === 'TOKEN_USED') {
        return {
          valid: false,
          error: {
            code: TokenErrorCodes.USED,
            message: 'This token has already been used. Each token is single-use.'
          }
        };
      }
      
      return {
        valid: false,
        error: {
          code: TokenErrorCodes.API_ERROR,
          message: data.message || 'Server error occurred. Please try again later.'
        }
      };
    }
    
    const data = await response.json();
    
    return {
      valid: true,
      tier: data.tier,
      email: data.email
    };
    
  } catch (err) {
    // Network error - retry logic could be added here
    return {
      valid: false,
      error: {
        code: TokenErrorCodes.NETWORK_ERROR,
        message: 'Unable to connect to Highland AI servers. Please check your internet connection.'
      }
    };
  }
}

/**
 * @typedef {Object} TokenValidationResult
 * @property {boolean} valid - Whether token is valid
 * @property {string} [tier] - User tier (onetime/monthly)
 * @property {string} [email] - User email
 * @property {TokenError} [error] - Error details if invalid
 */

/**
 * @typedef {Object} TokenError
 * @property {string} code - Error code
 * @property {string} message - Human-readable error message
 */
