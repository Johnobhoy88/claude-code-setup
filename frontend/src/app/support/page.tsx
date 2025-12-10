// frontend/src/app/support/page.tsx
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600 mb-8">How can we help you with your Claude Code setup?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/documentation" className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h2>
              <p className="text-gray-600">Comprehensive guides for using our Claude Code setup tool and understanding the configuration.</p>
            </Link>
            <a href="mailto:support@highlandai.com" className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h2>
              <p className="text-gray-600">Send us a detailed message about your issue and we'll respond within 24 hours.</p>
            </a>
          </div>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the Claude Code setup process work?</h3>
                <p className="text-gray-600">
                  After purchasing a setup, we'll send you a unique token. Run the provided command in your terminal, 
                  and our tool will install recommended MCPs and generate custom CLAUDE.md instructions for your project. 
                  The entire process takes just 5 minutes.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Which MCPs do you recommend?</h3>
                <p className="text-gray-600">
                  Our AI analyzes your project to recommend the best MCPs for your specific tech stack. 
                  This includes filesystem access, persistent memory, browser automation, GitHub integration, 
                  and dozens of other tools tailored to your project's needs.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-gray-600">
                  Yes! We offer a money-back guarantee if you're not satisfied with the configuration. 
                  Simply contact us within 30 days of purchase with your concerns.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I need changes to my configuration?</h3>
                <p className="text-gray-600">
                  Each configuration is tied to a single purchase, but if you have a different project, 
                  you can purchase another setup. We're also planning monthly subscription options that 
                  will include multiple configurations and updates.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Support</h3>
                <p className="text-gray-600 mb-2">For issues with the CLI tool, MCP installations, or configuration.</p>
                <a href="mailto:tech-support@highlandai.com" className="text-blue-600 hover:underline">tech-support@highlandai.com</a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales & Billing</h3>
                <p className="text-gray-600 mb-2">For questions about billing, refunds, or subscription plans.</p>
                <a href="mailto:billing@highlandai.com" className="text-blue-600 hover:underline">billing@highlandai.com</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}