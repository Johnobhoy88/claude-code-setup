// frontend/src/app/api/token/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'session_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL

    if (!apiBase) {
      return new Response(JSON.stringify({ error: 'API base URL is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Call the backend API to get token by session ID
    const backendResponse = await fetch(`${apiBase}/token?session_id=${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}))
      return new Response(
        JSON.stringify({ error: errorData.message || 'Failed to fetch token' }),
        { status: backendResponse.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await backendResponse.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Token API error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
