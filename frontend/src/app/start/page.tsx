'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

type Framework = 'nextjs' | 'react' | 'vue' | 'angular' | 'node' | 'python' | 'go' | 'rust' | 'other'

function StartContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTier = searchParams.get('tier') === 'monthly' ? 'monthly' : 'onetime'

  const [tier, setTier] = useState<'onetime' | 'monthly'>(initialTier)
  const [email, setEmail] = useState('')
  const [os, setOs] = useState('')
  const [framework, setFramework] = useState<Framework | ''>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tier,
          amount: tier === 'monthly' ? 999 : 299,
          profile: { os, framework },
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Checkout failed')
      }

      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        router.push('/pricing')
      }
    } catch (err: any) {
      console.error('Checkout error', err)
      alert(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[rgba(15,15,15,0.7)] backdrop-blur-xl border-b border-[var(--border-glass)] px-6 py-5 flex items-center gap-4">
        <Link href="/" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] text-sm flex items-center gap-1.5 transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Highland AI
        </Link>
      </header>

      {/* Main */}
      <main className="max-w-[1000px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
        {/* Form */}
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] mb-2">Get started</h1>
          <p className="text-[var(--text-secondary)] mb-10">Set up Claude Code for your project in minutes.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium mb-2.5">Choose your plan</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="tier"
                    value="onetime"
                    checked={tier === 'onetime'}
                    onChange={() => setTier('onetime')}
                    className="sr-only peer"
                  />
                  <div className="p-4 glass rounded-xl peer-checked:border-[var(--border-primary)] peer-checked:bg-[rgba(212,165,116,0.05)] transition-all hover:bg-[var(--bg-glass-elevated)]">
                    <div className="font-semibold mb-1">One-time</div>
                    <div className="text-sm text-[var(--text-secondary)]">$2.99 • 1 project</div>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="tier"
                    value="monthly"
                    checked={tier === 'monthly'}
                    onChange={() => setTier('monthly')}
                    className="sr-only peer"
                  />
                  <div className="p-4 glass rounded-xl peer-checked:border-[var(--border-primary)] peer-checked:bg-[rgba(212,165,116,0.05)] transition-all hover:bg-[var(--bg-glass-elevated)]">
                    <div className="font-semibold mb-1">Monthly</div>
                    <div className="text-sm text-[var(--text-secondary)]">$9.99/mo • Unlimited</div>
                  </div>
                </label>
              </div>
            </div>

            {/* OS */}
            <div>
              <label className="block text-sm font-medium mb-2.5">Operating system</label>
              <select
                value={os}
                onChange={(e) => setOs(e.target.value)}
                className="form-input"
              >
                <option value="">Select your OS</option>
                <option value="macos">macOS</option>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
              </select>
            </div>

            {/* Framework */}
            <div>
              <label className="block text-sm font-medium mb-2.5">Primary framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as Framework)}
                className="form-input"
              >
                <option value="">Select framework</option>
                <option value="nextjs">Next.js</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="node">Node.js</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Continue to payment'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-12 self-start space-y-5">
          {/* Order Summary */}
          <div className="glass rounded-2xl p-7">
            <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-5">
              Order summary
            </h3>
            <div className="space-y-3 pb-4 border-b border-[var(--border-glass)]">
              <div className="flex justify-between text-[0.9375rem]">
                <span className="text-[var(--text-secondary)]">Plan</span>
                <span className="font-medium">{tier === 'monthly' ? 'Monthly' : 'One-time'}</span>
              </div>
              <div className="flex justify-between text-[0.9375rem]">
                <span className="text-[var(--text-secondary)]">Projects</span>
                <span className="font-medium">{tier === 'monthly' ? 'Unlimited' : '1 project'}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-[var(--color-primary)]">
                {tier === 'monthly' ? '$9.99/mo' : '$2.99'}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="glass rounded-xl p-6">
            <h4 className="text-[0.6875rem] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-4">
              Included
            </h4>
            <ul className="space-y-2.5">
              {['Complete Claude Code configuration', 'Framework-specific presets', 'Custom prompts and rules', 'MCP server templates', 'Email support'].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[var(--text-secondary)] text-sm">
                  <span className="text-[var(--success)] text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantee */}
          <div className="glass rounded-xl p-5">
            <p className="text-[0.8125rem] text-[var(--text-secondary)] leading-relaxed">
              Secure checkout powered by Stripe. Your payment information is never stored on our servers.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default function StartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <StartContent />
    </Suspense>
  )
}
