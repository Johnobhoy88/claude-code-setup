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
  const [copied, setCopied] = useState<'token' | 'command' | null>(null)

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

  const copyToClipboard = async (text: string, type: 'token' | 'command') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const fullCommand = token
    ? `npx @highland-ai/claude-setup --token ${token}`
    : 'npx @highland-ai/claude-setup --token YOUR_TOKEN_HERE'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-[520px] w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 glass rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-center mb-3">
          Payment successful
        </h1>
        <p className="text-[var(--text-secondary)] text-center text-lg mb-10">
          {email ? `Confirmation sent to ${email}` : 'Your setup is ready'}
        </p>

        {/* Token Section */}
        {loading ? (
          <div className="glass rounded-2xl p-8 mb-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-[var(--bg-glass-elevated)] rounded w-1/3"></div>
              <div className="h-12 bg-[var(--bg-glass-elevated)] rounded"></div>
            </div>
            <p className="text-[var(--text-tertiary)] text-sm mt-4 text-center">Loading your token...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-6 mb-6 border-[var(--warning)]/30 bg-[var(--warning)]/5">
            <p className="text-[var(--warning)] text-sm text-center mb-2">{error}</p>
            <p className="text-[var(--text-tertiary)] text-xs text-center">
              Your token has also been sent to your email.
            </p>
          </div>
        ) : token ? (
          <div className="glass rounded-2xl p-8 mb-6">
            <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
              Your setup token
            </label>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-[var(--bg)] px-4 py-3 rounded-xl text-sm font-mono text-[var(--success)] overflow-x-auto border border-[var(--border-glass)]">
                {token}
              </code>
              <button
                onClick={() => copyToClipboard(token, 'token')}
                className="btn btn-glass px-4 py-3"
              >
                {copied === 'token' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Command Section */}
        <div className="glass rounded-2xl p-8 mb-6">
          <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
            Run this command
          </label>
          <div className="relative">
            <code className="block bg-[var(--bg)] text-[var(--color-primary)] px-5 py-4 rounded-xl text-sm font-mono overflow-x-auto border border-[var(--border-glass)] pr-20">
              {fullCommand}
            </code>
            <button
              onClick={() => copyToClipboard(fullCommand, 'command')}
              className="absolute top-1/2 right-3 -translate-y-1/2 glass px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--bg-glass-hover)] transition-colors"
            >
              {copied === 'command' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-[var(--text-tertiary)] text-xs mt-3">
            Open your terminal in your project directory and run this command.
          </p>
        </div>

        {/* What's Next */}
        <div className="glass rounded-2xl p-8 mb-8">
          <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-5">
            What happens next
          </h3>
          <ol className="space-y-4">
            {[
              { step: '1', text: 'Open your terminal in your project directory' },
              { step: '2', text: 'Run the command above' },
              { step: '3', text: 'The CLI will generate your CLAUDE.md and .mcp.json files' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 glass rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-secondary)] shrink-0">
                  {item.step}
                </span>
                <span className="text-[var(--text-secondary)] text-[0.9375rem] pt-0.5">{item.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/" className="btn btn-primary w-full py-4 text-base">
            Back to homepage
          </Link>
          <Link href="/documentation" className="btn btn-glass w-full py-4 text-base">
            View documentation
          </Link>
        </div>

        {/* Help */}
        <p className="text-[var(--text-tertiary)] text-sm text-center mt-8">
          Need help? Contact us at{' '}
          <a href="mailto:support@highlandai.com" className="text-[var(--color-primary)] hover:underline">
            support@highlandai.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
