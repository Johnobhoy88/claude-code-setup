// frontend/src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [tokens, setTokens] = useState<Array<{
    id: number
    token: string
    used: boolean
    createdAt: string
    project: string
  }>>([])
  const [projects, setProjects] = useState<Array<{
    id: number
    name: string
    framework: string
    created: string
    status: string
  }>>([])

  // Mock data - in real implementation this would come from your API
  useEffect(() => {
    // This is where we'd fetch user data from your API
    setUser({
      email: 'user@example.com',
      tier: 'free',
      createdAt: new Date().toISOString(),
      usage: {
        tokensUsed: 2,
        tokensRemaining: 3, // free tier limit
        projectsConfigured: 1
      }
    })
    
    setTokens([
      { id: 1, token: 'token_abc123def456', used: true, createdAt: '2025-01-15', project: 'My Next.js App' },
      { id: 2, token: 'token_def456ghi789', used: false, createdAt: '2025-01-16', project: 'Python ML Project' }
    ])
    
    setProjects([
      { id: 1, name: 'My Next.js App', framework: 'Next.js 14', created: '2025-01-15', status: 'completed' },
      { id: 2, name: 'Python ML Project', framework: 'Python + FastAPI', created: '2025-01-16', status: 'pending' }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-black">Highland AI</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="border-black text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/projects" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Projects
                </Link>
                <Link href="/tokens" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Tokens
                </Link>
                <Link href="/billing" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Billing
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hi, {user?.email?.split('@')[0] || 'User'}</span>
                  <button className="bg-gray-200 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Tokens Remaining</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {user?.usage?.tokensRemaining || 0}/{user?.tier === 'monthly' ? '∞' : user?.tier === 'onetime' ? '1' : '5'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Projects Configured</h3>
                <p className="text-2xl font-semibold text-gray-900">{user?.usage?.projectsConfigured || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Subscription</h3>
                <p className="text-2xl font-semibold text-gray-900 capitalize">{user?.tier || 'free'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {(user?.tier === 'free' && user?.usage?.tokensRemaining > 0) || user?.tier === 'onetime' || user?.tier === 'monthly' ? (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Configure Claude Code for a New Project</h2>
                <p className="text-gray-600 mb-4">Set up professional Claude configuration in 5 minutes</p>
              </div>
              <Link 
                href="/projects/new" 
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 whitespace-nowrap"
              >
                New Setup
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Free tier limit reached</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You've reached your free tier limit of 5 configurations. 
                    <Link href="/pricing" className="font-medium underline hover:text-yellow-900"> Upgrade to continue</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tokens */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tokens</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                {tokens.map((token: any) => (
                  <li key={token.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 truncate">{token.project}</div>
                      <div className="text-sm text-gray-500">{token.createdAt}</div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <code className="text-xs font-mono bg-gray-100 p-1 rounded truncate max-w-xs">{token.token.substring(0, 15)}...</code>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        token.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {token.used ? 'Used' : 'Unused'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href="/tokens" className="text-sm font-medium text-black hover:text-gray-800">
                  View all tokens
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Projects</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                {projects.map((project: any) => (
                  <li key={project.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.framework}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{project.created}</div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : project.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                      <Link 
                        href={`/projects/${project.id}`} 
                        className="text-sm font-medium text-black hover:text-gray-800"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href="/projects" className="text-sm font-medium text-black hover:text-gray-800">
                  View all projects
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Resources */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Helpful Resources</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/documentation" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
                <p className="text-sm text-gray-600">Learn how to use Claude Code effectively</p>
              </Link>
              <Link href="/tutorials" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Tutorials</h4>
                <p className="text-sm text-gray-600">Step-by-step guides for common use cases</p>
              </Link>
              <Link href="/support" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Support</h4>
                <p className="text-sm text-gray-600">Get help when you need it</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}