import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageWrapper } from '../components/LoadingSpinner'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // Simulated auth — replace with real API call when backend auth is ready
      await new Promise((r) => setTimeout(r, 1000))
      login({ email, name: email.split('@')[0] }, 'mock-token-' + Date.now())
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg" />
        <motion.div
          className="floating-orb w-72 h-72 bg-primary-200/30 -top-20 -left-20"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="floating-orb w-56 h-56 bg-accent-200/20 bottom-10 right-10"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative w-full max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-glass-lg">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-base font-display">A</span>
                </div>
                <span className="text-2xl font-bold font-display">
                  <span className="text-gray-900">Authen</span>
                  <span className="gradient-text">tix</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Welcome back</h1>
              <p className="text-sm text-gray-500">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all duration-300"
                />
              </div>

              {error && (
                <motion.p
                  className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full text-base !py-3 ${loading ? 'opacity-60 !transform-none' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </PageWrapper>
  )
}
