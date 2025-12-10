// frontend/src/app/pricing/page.tsx
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-black">Highland AI</Link>
            </div>
            <nav className="hidden md:block">
              <div className="flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Home</Link>
                <Link href="/#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Features</Link>
                <Link href="/pricing" className="text-black px-3 py-2 text-sm font-medium">Pricing</Link>
                <Link href="/documentation" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Docs</Link>
              </div>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Sign in</Link>
              <Link href="/auth/register" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your needs. All plans include professional Claude Code configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Tier</h2>
            <div className="text-4xl font-bold text-gray-900 mb-4">Free</div>
            <p className="text-gray-600 mb-6">Perfect for trying out our Claude Code setup</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                3 Essential MCPs
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Generic CLAUDE.md template
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Basic setup guide
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                AI-selected MCPs (70+ library)
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Custom CLAUDE.md generation
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Project-tailored configuration
              </li>
            </ul>

            <Link href="/auth/register" className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200">
              Get Started Free
            </Link>
          </div>

          {/* One-Time Payment Tier */}
          <div className="border-2 border-black rounded-xl p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
              MOST POPULAR
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Per Project</h2>
            <div className="text-4xl font-bold text-gray-900 mb-2">$2.99</div>
            <p className="text-gray-600 mb-6">One-time payment per project setup</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                AI-selected MCPs (70+ library)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Custom CLAUDE.md generation
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Tailored to your stack
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Skills and hooks configuration
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Unlimited projects per month
              </li>
            </ul>

            <Link href="/checkout" className="block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800">
              Get Started - $2.99
            </Link>
          </div>

          {/* Monthly Subscription Tier */}
          <div className="border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h2>
            <div className="text-4xl font-bold text-gray-900 mb-2">$9.99<span className="text-lg text-gray-600">/month</span></div>
            <p className="text-gray-600 mb-6">Perfect for teams and frequent users</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                All Per Project features
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Unlimited project setups per month
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Monthly configuration reports
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Early access to new features
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Advanced project analytics
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Dedicated support
              </li>
            </ul>

            <Link href="/auth/register" className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200">
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is Claude Code?</h3>
              <p className="text-gray-600">
                Claude Code is Anthropic's IDE that allows you to interact with Claude AI directly in your codebase. 
                It provides context-aware assistance and can access your files, run commands, and interact with external systems through MCPs (Model Context Protocol).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the setup process work?</h3>
              <p className="text-gray-600">
                After purchase, we'll send you a unique token. Run our CLI tool with this token in your project directory, 
                and it will automatically install the optimal MCPs and generate a custom CLAUDE.md file for your specific project.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What are MCPs and why do I need them?</h3>
              <p className="text-gray-600">
                MCPs (Model Context Protocols) allow Claude to interact with external systems like your filesystem, 
                browsers, databases, and more. Different projects require different MCPs. We analyze your project 
                and recommend the best MCPs for your specific tech stack.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with the configuration.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is this a one-time purchase or subscription?</h3>
              <p className="text-gray-600">
                We offer both: a one-time purchase for individual project setup ($2.99), 
                and a monthly subscription for unlimited setups ($9.99/month). Each one-time purchase is valid for a single project.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/#features" className="text-base text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="text-base text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/documentation" className="text-base text-gray-600 hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/changelog" className="text-base text-gray-600 hover:text-gray-900">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/blog" className="text-base text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/guides" className="text-base text-gray-600 hover:text-gray-900">Guides</Link></li>
                <li><Link href="/tutorials" className="text-base text-gray-600 hover:text-gray-900">Tutorials</Link></li>
                <li><Link href="/examples" className="text-base text-gray-600 hover:text-gray-900">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/about" className="text-base text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/careers" className="text-base text-gray-600 hover:text-gray-900">Careers</Link></li>
                <li><Link href="/contact" className="text-base text-gray-600 hover:text-gray-900">Contact</Link></li>
                <li><Link href="/partners" className="text-base text-gray-600 hover:text-gray-900">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/privacy" className="text-base text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-base text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link href="/security" className="text-base text-gray-600 hover:text-gray-900">Security</Link></li>
                <li><Link href="/compliance" className="text-base text-gray-600 hover:text-gray-900">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">&copy; 2025 Highland AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}