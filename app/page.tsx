'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { Rocket, Users, Brain, Zap } from 'lucide-react'
import Image from 'next/image'

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      setIsLoading(false)
      if (user && role) {
        // Redirect based on role
        switch (role) {
          case 'super_admin':
          case 'admin':
            router.push('/admin')
            break
          case 'client':
            router.push('/wizard')
            break
          default:
            router.push('/wizard')
        }
      }
    }
  }, [user, role, loading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center text-white">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-lg">Loading DevNOW Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-bright-blue to-purple-600">
      {/* Header */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-vibrant-yellow rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-charcoal" />
            </div>
            <span className="text-2xl font-bold text-white">DevNOW</span>
          </div>
          <div className="text-sm text-gray-300">
            Powered by SuccessNOW.ai
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                AI-Powered Client
                <span className="text-vibrant-yellow"> Onboarding</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your client intake process with intelligent wizards that capture requirements, 
                generate strategies, and produce development-ready briefs—all powered by Claude AI.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-vibrant-yellow" />
                <div>
                  <h3 className="font-semibold">Smart AI Agents</h3>
                  <p className="text-sm text-gray-400">Configurable per step</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-vibrant-yellow" />
                <div>
                  <h3 className="font-semibold">Project Management</h3>
                  <p className="text-sm text-gray-400">Save drafts & resume</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-vibrant-yellow" />
                <div>
                  <h3 className="font-semibold">Auto-Generated PRDs</h3>
                  <p className="text-sm text-gray-400">Development ready</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Rocket className="w-8 h-8 text-vibrant-yellow" />
                <div>
                  <h3 className="font-semibold">Admin Dashboard</h3>
                  <p className="text-sm text-gray-400">Full project oversight</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Bottom Section - Process Overview */}
        <div className="mt-20 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">The DevNOW Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-vibrant-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-charcoal">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Onboarding</h3>
              <p className="text-gray-300">10-step wizard captures all project requirements with AI assistance</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-vibrant-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-charcoal">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-300">Claude generates strategies, copy, and development specifications</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-vibrant-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-charcoal">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Development Ready</h3>
              <p className="text-gray-300">Complete PRD with assets, ready for immediate development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
