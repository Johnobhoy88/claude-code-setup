'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,15,15,0.7)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
        <nav className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-16">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Highland AI
          </Link>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link href="#features" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[0.9375rem] font-medium transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[0.9375rem] font-medium transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/docs" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[0.9375rem] font-medium transition-colors">
                Docs
              </Link>
            </li>
          </ul>
          <Link href="/start" className="btn btn-primary">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[0.8125rem] font-medium text-[var(--text-secondary)] mb-8">
          <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"></span>
          Now available
        </span>

        <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.05] max-w-[800px] mb-6">
          Configure <span className="text-[var(--color-primary)]">Claude Code</span> in 5 minutes
        </h1>

        <p className="text-xl md:text-[1.25rem] text-[var(--text-secondary)] max-w-[520px] mb-12 leading-relaxed">
          Professional setup for your development environment. Stop wrestling with configuration. Start building.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <Link href="/start" className="btn btn-primary px-6 py-3 text-base">
            Get Started — $2.99
          </Link>
          <Link href="#features" className="btn btn-glass px-6 py-3 text-base">
            Learn more
          </Link>
        </div>

        <div className="flex items-center gap-3 text-[var(--text-tertiary)] text-sm">
          <div className="flex -space-x-2.5">
            {['JD', 'MK', 'AL', '+'].map((initials, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]"
              >
                {initials}
              </span>
            ))}
          </div>
          <span>Trusted by 500+ developers</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              A complete solution for Claude Code configuration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Instant Setup',
                description: 'One command generates your complete configuration. No manual editing required.',
              },
              {
                title: 'Smart Defaults',
                description: 'Optimized settings based on your project type, framework, and preferences.',
              },
              {
                title: 'All Frameworks',
                description: 'React, Vue, Node, Python, Go, Rust — we've got you covered.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 glass rounded-2xl transition-all duration-250 hover:bg-[var(--bg-glass-hover)] hover:border-[var(--border-glass-hover)] hover:-translate-y-0.5"
              >
                <h3 className="text-lg font-semibold mb-3 tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-[0.9375rem] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Choose the plan that works for you. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* One-time */}
            <div className="p-10 glass rounded-2xl transition-all duration-250 hover:bg-[var(--bg-glass-hover)] hover:border-[var(--border-glass-hover)] hover:-translate-y-0.5">
              <h3 className="text-xl font-semibold mb-2 tracking-[-0.01em]">One-time</h3>
              <p className="text-[var(--text-secondary)] text-[0.9375rem] mb-7">Perfect for a single project</p>
              <div className="flex items-baseline gap-1 mb-7">
                <span className="text-5xl font-bold tracking-[-0.03em]">$2.99</span>
                <span className="text-[var(--text-tertiary)] text-[0.9375rem]">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Complete Claude Code configuration', 'All framework presets included', '1 project setup', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)] text-[0.9375rem]">
                    <span className="text-[var(--success)] text-sm mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/start?tier=onetime" className="btn btn-glass w-full py-3.5">
                Get Started
              </Link>
            </div>

            {/* Monthly */}
            <div className="p-10 glass rounded-2xl border-[var(--border-primary)] bg-[rgba(212,165,116,0.03)] relative transition-all duration-250 hover:border-[var(--border-primary-hover)] hover:-translate-y-0.5">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-[var(--bg)] text-[0.6875rem] font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <h3 className="text-xl font-semibold mb-2 tracking-[-0.01em]">Monthly</h3>
              <p className="text-[var(--text-secondary)] text-[0.9375rem] mb-7">Unlimited projects, ongoing updates</p>
              <div className="flex items-baseline gap-1 mb-7">
                <span className="text-5xl font-bold tracking-[-0.03em]">$9.99</span>
                <span className="text-[var(--text-tertiary)] text-[0.9375rem]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in One-time', 'Unlimited project setups', 'Priority support', 'Early access to new features', 'Custom configuration templates'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)] text-[0.9375rem]">
                    <span className="text-[var(--success)] text-sm mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/start?tier=monthly" className="btn btn-primary w-full py-3.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-[600px] mx-auto">
          <div className="glass rounded-2xl p-16 text-center">
            <h2 className="text-3xl font-bold tracking-[-0.02em] mb-3">
              Ready to start?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Get your Claude Code configuration in minutes, not hours.
            </p>
            <Link href="/start" className="btn btn-primary px-8 py-3.5 text-base">
              Get Started — $2.99
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-glass)] py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[var(--text-tertiary)] text-sm">
            © 2024 Highland AI
          </span>
          <ul className="flex gap-6">
            {['Documentation', 'Support', 'Privacy'].map((item, i) => (
              <li key={i}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  )
}
