'use client'
import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (userType: 'admin' | 'client') => {
    if (userType === 'admin') {
      setEmail('johnpotvin@gmail.com')
      setPassword('devnow2025')
    } else {
      setEmail('johnpotvinmex@gmail.com')
      setPassword('devnow2025')
    }
  }

  return (
    <div className="glass-card p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-vibrant-yellow rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-charcoal" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to DevNOW</h2>
        <p className="text-gray-300">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label text-white">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input pl-10"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label text-white">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Quick Login Buttons for Development */}
      <div className="mt-8 pt-6 border-t border-gray-600">
        <p className="text-sm text-gray-400 text-center mb-4">Quick Login (Development)</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickLogin('admin')}
            className="btn-secondary text-sm py-2 px-4"
          >
            Admin Login
          </button>
          <button
            onClick={() => handleQuickLogin('client')}
            className="btn-secondary text-sm py-2 px-4"
          >
            Client Login
          </button>
        </div>
      </div>
    </div>
  )
}
