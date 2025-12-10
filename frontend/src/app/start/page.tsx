// frontend/src/app/start/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Integration = 'github' | 'gitlab' | 'bitbucket' | 'slack' | 'notion' | 'aws' | 'gcp' | 'azure'
type Framework =
  | 'nextjs'
  | 'react'
  | 'node'
  | 'python'
  | 'fastapi'
  | 'django'
  | 'other'

export default function StartPage() {
  const router = useRouter()
  const [tier, setTier] = useState<'onetime' | 'monthly'>('onetime')
  const [email, setEmail] = useState('')
  const [project, setProject] = useState({
    repoUrl: '',
    os: 'mac',
    framework: 'nextjs' as Framework,
    packageManager: 'npm',
    buildCommand: '',
    testCommand: '',
    docker: false,
    description: '',
    integrations: new Set<Integration>(),
  })
  const [loading, setLoading] = useState(false)

  const toggleIntegration = (name: Integration) => {
    const next = new Set(project.integrations)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setProject({ ...project, integrations: next })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    const profile = {
      repoUrl: project.repoUrl,
      os: project.os,
      framework: project.framework,
      packageManager: project.packageManager,
      buildCommand: project.buildCommand,
      testCommand: project.testCommand,
      docker: project.docker,
      description: project.description,
      integrations: Array.from(project.integrations),
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tier,
          amount: tier === 'monthly' ? 999 : 299,
          profile,
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Get your Claude Code setup in 5 minutes</h1>
        <p className="text-lg text-gray-600 mb-8">
          Answer a few quick questions, pay $2.99 (or $9.99/mo for up to 15 setups), and get a tailored CLAUDE.md + MCP config.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as 'onetime' | 'monthly')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="onetime">$2.99 one-time (1 setup)</option>
                  <option value="monthly">$9.99/month (up to 15 setups)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OS</label>
                <select
                  value={project.os}
                  onChange={(e) => setProject({ ...project, os: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="mac">macOS</option>
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Framework</label>
                <select
                  value={project.framework}
                  onChange={(e) => setProject({ ...project, framework: e.target.value as Framework })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                  <option value="node">Node/Express</option>
                  <option value="python">Python</option>
                  <option value="fastapi">FastAPI</option>
                  <option value="django">Django</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package manager</label>
                <select
                  value={project.packageManager}
                  onChange={(e) => setProject({ ...project, packageManager: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="npm">npm</option>
                  <option value="yarn">yarn</option>
                  <option value="pnpm">pnpm</option>
                  <option value="bun">bun</option>
                  <option value="pip">pip</option>
                  <option value="poetry">poetry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repo URL (optional)</label>
                <input
                  type="url"
                  value={project.repoUrl}
                  onChange={(e) => setProject({ ...project, repoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://github.com/you/project"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Build command</label>
                <input
                  type="text"
                  value={project.buildCommand}
                  onChange={(e) => setProject({ ...project, buildCommand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="npm run build"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test command</label>
                <input
                  type="text"
                  value={project.testCommand}
                  onChange={(e) => setProject({ ...project, testCommand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="npm test"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Integrations</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['github', 'gitlab', 'bitbucket', 'slack', 'notion', 'aws', 'gcp', 'azure'] as Integration[]).map(
                  (name) => (
                    <label key={name} className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={project.integrations.has(name)}
                        onChange={() => toggleIntegration(name)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="capitalize">{name}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="docker"
                type="checkbox"
                checked={project.docker}
                onChange={(e) => setProject({ ...project, docker: e.target.checked })}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="docker" className="text-sm text-gray-700">
                Uses Docker
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project description</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="What does your project do? Any special requirements?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {loading ? 'Processing…' : tier === 'monthly' ? 'Continue – $9.99/mo' : 'Continue – $2.99'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
