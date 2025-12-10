// frontend/src/app/success/page.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      setError('No session ID provided')
      return
    }

    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/token?session_id=${sessionId}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch token')
        }

        setToken(data.token)
        setEmail(data.email)
      } catch (err: any) {
        console.error('Error fetching token:', err)
        setError(err.message || 'Failed to load your token. Please check your email.')
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [sessionId])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const fullCommand = token
    ? `npx @highland-ai/claude-setup --token ${token}`
    : 'npx @highland-ai/claude-setup --token YOUR_TOKEN_HERE'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase{email ? ` (${email})` : ''}. Your Claude Code setup is ready.
          </p>

          {loading ? (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Loading your token...</p>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 text-sm">
                {error}
              </p>
              <p className="text-yellow-700 text-xs mt-2">
                Your token has also been sent to your email.
              </p>
            </div>
          ) : token ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <label className="block text-sm font-medium text-green-800 mb-2 text-left">
                Your Setup Token:
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white border border-green-300 px-3 py-2 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                  {token}
                </code>
                <button
                  onClick={() => copyToClipboard(token)}
                  className="shrink-0 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ) : null}

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-800 mb-3 text-left">Quick Setup:</h3>
            <div className="relative">
              <code className="block bg-gray-900 text-green-400 px-4 py-3 rounded-lg text-sm font-mono text-left overflow-x-auto">
                {fullCommand}
              </code>
              <button
                onClick={() => copyToClipboard(fullCommand)}
                className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2 text-left">
              Run this command in your project directory to configure Claude Code.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-gray-800 mb-2">What happens next:</h3>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
              <li>Open your terminal in your project directory</li>
              <li>Run the command above</li>
              <li>The CLI will analyze your project and generate:</li>
            </ol>
            <ul className="text-sm text-gray-600 list-disc pl-8 mt-1 space-y-1">
              <li><code className="bg-gray-200 px-1 rounded">CLAUDE.md</code> - Custom instructions for Claude</li>
              <li><code className="bg-gray-200 px-1 rounded">.mcp.json</code> - MCP server configuration</li>
              <li>Recommended extensions and settings</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              Back to Homepage
            </Link>

            <Link
              href="/documentation"
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              View Documentation
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600">
            Visit our <Link href="/support" className="text-black underline">support page</Link> or contact us at support@highlandai.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
