// frontend/src/app/about/page.tsx
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Highland AI</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At Highland AI, our mission is to simplify AI development workflows by providing professional-grade 
              configuration tools that save developers countless hours of setup and configuration time.
            </p>
            <p className="text-gray-600">
              We believe that developers shouldn't have to spend hours figuring out the best MCPs, CLAUDE.md 
              instructions, and configuration for their AI tools. Instead, they should be able to focus on solving 
              real problems for their users.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-600 mb-4">
              Highland AI is a team of experienced software engineers and AI practitioners who have spent years 
              working with various AI development tools. We've felt the pain of spending hours configuring 
              these tools, and we built this solution to solve that problem for ourselves and others.
            </p>
            <p className="text-gray-600">
              Our expertise spans machine learning, software architecture, and developer tooling. We combine 
              technical knowledge with practical experience to create tools that truly help developers.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600">Our systems analyze your project to recommend optimal configurations.</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Expert-Level</h3>
                <p className="text-gray-600">Configuration based on industry best practices and expert knowledge.</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Project-Tailored</h3>
                <p className="text-gray-600">Configuration specifically for your project's technology stack.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Claude Code Setup?</h2>
            <p className="text-gray-600 mb-4">
              Setting up Claude Code properly can be extremely time-consuming. You need to figure out which MCPs 
              to install, how to configure them, what CLAUDE.md instructions to provide, and how to structure 
              your project for optimal AI interaction.
            </p>
            <p className="text-gray-600">
              Our service eliminates this guesswork. We've spent hundreds of hours analyzing different project 
              types, identifying the best configurations, and creating templates that work for real-world scenarios.
            </p>
          </section>
          
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Ready to get started with professional Claude Code setup?{' '}
              <Link href="/checkout" className="text-black font-medium hover:underline">
                Get your setup today
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}