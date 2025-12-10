// frontend/src/app/api/checkout/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, tier = 'onetime', amount, profile } = await request.json()
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    if (!apiBase) {
      return new Response(JSON.stringify({ error: 'API base URL is not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    // Call the backend API to create a checkout session
    const backendResponse = await fetch(`${apiBase}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        tier,
        amount: amount ?? (tier === 'monthly' ? 999 : 299), // $9.99 or $2.99 in cents
        profile,
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      return new Response(
        JSON.stringify({ error: errorData.message || 'Failed to create checkout session' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const data = await backendResponse.json()
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('Checkout API error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
