// frontend/src/lib/api.ts
// This file will contain all API calls once we have the actual backend endpoints

interface CheckoutRequest {
  email: string;
  tier?: string;
}

interface CheckoutResponse {
  sessionId: string;
}

interface TokenValidationRequest {
  token: string;
}

interface TokenValidationResponse {
  valid: boolean;
  email?: string;
  tier?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  }

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutResponse> {
    // In production, this would call the actual backend API
    // For now, we return a mock response
    console.log('Creating checkout session:', request);
    
    // Mock implementation - in real version, this would call the backend
    return {
      sessionId: 'cs_test_mock1234567890'
    };
  }

  async validateToken(request: TokenValidationRequest): Promise<TokenValidationResponse> {
    console.log('Validating token:', request);
    
    // Mock implementation
    return {
      valid: true,
      email: 'user@example.com',
      tier: 'onetime'
    };
  }

  async completeCheckout(sessionId: string): Promise<{success: boolean, token?: string}> {
    console.log('Completing checkout:', sessionId);
    
    // Mock implementation
    return {
      success: true,
      token: 'mock_token_abc123def456'
    };
  }
}

export const apiClient = new ApiClient();

// Export types for use in other files
export type {
  CheckoutRequest,
  CheckoutResponse,
  TokenValidationRequest,
  TokenValidationResponse
};