import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
]

const featureLinks = [
  { label: 'Image Verification', path: '/image-verification', icon: '🖼️', desc: 'Detect deepfakes & AI images' },
  { label: 'Gaze Detection', path: '/gaze-detection', icon: '👁️', desc: 'Analyze eye gaze manipulation' },
  { label: 'Text Verification', path: '/text-verification', icon: '📝', desc: 'Fact-check misinformation' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setFeaturesOpen(false)
  }, [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-accent transition-shadow duration-300">
            <span className="text-white font-bold text-sm font-display">A</span>
          </div>
          <span className="text-xl font-bold font-display tracking-tight">
            <span className="text-gray-900">Authen</span>
            <span className="gradient-text">tix</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-primary-700 bg-primary-50/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Features Dropdown */}
          <div className="relative" onMouseEnter={() => setFeaturesOpen(true)} onMouseLeave={() => setFeaturesOpen(false)}>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                ['/image-verification', '/gaze-detection', '/text-verification'].includes(location.pathname)
                  ? 'text-primary-700 bg-primary-50/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Features
              <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${featuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {featuresOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 glass-strong rounded-2xl p-2 shadow-glass-lg"
                >
                  {featureLinks.map((feat) => (
                    <Link
                      key={feat.path}
                      to={feat.path}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        location.pathname === feat.path
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-white/60 text-gray-700'
                      }`}
                    >
                      <span className="text-xl mt-0.5">{feat.icon}</span>
                      <div>
                        <div className="font-semibold text-sm">{feat.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{feat.desc}</div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button onClick={logout} className="btn-secondary text-sm !px-5 !py-2">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors px-3 py-2">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary text-sm !px-5 !py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/50 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
            <span className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden shadow-glass-lg"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Features</div>
              {featureLinks.map((feat) => (
                <Link
                  key={feat.path}
                  to={feat.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === feat.path ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-white/60'
                  }`}
                >
                  <span>{feat.icon}</span>
                  {feat.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200/50 mt-2 flex gap-2">
                {user ? (
                  <button onClick={logout} className="btn-secondary text-sm flex-1 !py-2.5">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-sm flex-1 !py-2.5 text-center">Log in</Link>
                    <Link to="/signup" className="btn-primary text-sm flex-1 !py-2.5 text-center">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
