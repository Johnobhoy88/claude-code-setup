// frontend/src/app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          tier: 'onetime'
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl || data.url
      } else {
        const errorData = await response.json()
        console.error('Checkout error:', errorData)
        alert('There was an error processing your checkout. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600 mb-8">Professional Claude Code setup for your project</p>
          
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Professional Setup</h2>
                <p className="text-gray-600">AI-powered configuration for your project</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">$2.99</p>
                <p className="text-sm text-gray-600">one-time</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="you@example.com"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                We'll send your configuration token to this email after payment
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">What You'll Receive:</h3>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>AI-selected MCPs tailored to your project (from 70+ library)</li>
                <li>Custom CLAUDE.md generation for your specific tech stack</li>
                <li>Skills and hooks configured for your project type</li>
                <li>Detailed installation instructions with CLI command</li>
              </ul>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-lg text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Continue to Payment - $2.99'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Secure payment powered by Stripe • You'll be redirected to complete your purchase
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Money-back guarantee if you're not satisfied with the configuration
          </p>
        </div>
      </div>
    </div>
  )
}
