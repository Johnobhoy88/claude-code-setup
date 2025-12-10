// frontend/src/app/documentation/page.tsx
import Link from 'next/link'

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
          <p className="text-gray-600 mb-8">Comprehensive guide for setting up Claude Code with Highland AI</p>
          
          <nav className="mb-8">
            <ul className="space-y-2">
              <li><Link href="#overview" className="text-blue-600 hover:underline">Overview</Link></li>
              <li><Link href="#getting-started" className="text-blue-600 hover:underline">Getting Started</Link></li>
              <li><Link href="#cli-tool" className="text-blue-600 hover:underline">CLI Tool Usage</Link></li>
              <li><Link href="#mcp-configuration" className="text-blue-600 hover:underline">MCP Configuration</Link></li>
              <li><Link href="#claude-md" className="text-blue-600 hover:underline">CLAUDE.md Templates</Link></li>
              <li><Link href="#troubleshooting" className="text-blue-600 hover:underline">Troubleshooting</Link></li>
            </ul>
          </nav>
          
          <section id="overview" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="mb-4">
              Highland AI's Claude Code Setup Tool helps developers configure Claude Code with professional-level setup in 5 minutes. 
              Instead of spending hours figuring out MCPs, CLAUDE.md instructions, and configuration, our tool provides expert-level 
              recommendations tailored to your specific project.
            </p>
            <p>
              Our AI analyzes your project description and recommends the optimal MCPs, creates custom CLAUDE.md instructions, 
              and sets up skills, hooks, and plugins specific to your tech stack.
            </p>
          </section>
          
          <section id="getting-started" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Purchase a Professional Setup:</strong> Go to our pricing page and purchase a configuration for $2.99.
                Describe your project, tech stack, and requirements during checkout.
              </li>
              <li>
                <strong>Receive Your Token:</strong> After successful payment, we'll email you a unique installation token.
              </li>
              <li>
                <strong>Run the Installation Command:</strong> Open your terminal and run the provided npx command with your token.
              </li>
              <li>
                <strong>Enjoy Professional Configuration:</strong> Claude Code will be configured with optimal MCPs and custom CLAUDE.md.
              </li>
            </ol>
          </section>
          
          <section id="cli-tool" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">CLI Tool Usage</h2>
            <p className="mb-4">
              The Highland AI CLI tool is a zero-installation command that configures Claude Code for your project:
            </p>
            <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
              <code>npx @highland-ai/claude-setup --token YOUR_TOKEN_HERE</code>
            </pre>
            <p>
              The tool will guide you through a quick setup process and install all recommended MCPs and create a custom CLAUDE.md file 
              in your project directory.
            </p>
          </section>
          
          <section id="mcp-configuration" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">MCP Configuration</h2>
            <p className="mb-4">
              Model Context Protocol (MCP) servers enhance Claude Code's capabilities. Our tool recommends the best MCPs for your project:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>context7:</strong> Up-to-date library documentation lookup</li>
              <li><strong>memory:</strong> Persistent memory across sessions</li>
              <li><strong>filesystem:</strong> File system access for project files</li>
              <li><strong>chrome-devtools:</strong> Browser automation and debugging</li>
              <li><strong>github:</strong> GitHub repository management</li>
              <li>And many others tailored to your specific project</li>
            </ul>
          </section>
          
          <section id="claude-md" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">CLAUDE.md Templates</h2>
            <p className="mb-4">
              The CLAUDE.md file contains custom instructions for Claude, telling it about your project, tech stack, and preferences. 
              Our AI generates CLAUDE.md files that include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Project overview and purpose</li>
              <li>Tech stack and architecture details</li>
              <li>Installed MCPs and their usage</li>
              <li>Coding conventions and best practices</li>
              <li>Common commands and workflows</li>
              <li>Important notes and considerations</li>
            </ul>
          </section>
          
          <section id="troubleshooting" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Installation fails</h3>
                <p className="text-gray-600">
                  Ensure you have Node.js 18+ installed and that your terminal has network access to download MCP packages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">MCPs don't start</h3>
                <p className="text-gray-600">
                  Check that you have sufficient system resources and that your firewall allows the necessary connections.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">CLAUDE.md not applied</h3>
                <p className="text-gray-600">
                  Restart Claude Code or reload the workspace to apply the new CLAUDE.md instructions.
                </p>
              </div>
            </div>
          </section>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need further assistance? Contact our support team at <a href="mailto:support@highlandai.com" className="text-blue-600 hover:underline">support@highlandai.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}