import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { PageWrapper } from '../components/LoadingSpinner'
import GlassCard from '../components/GlassCard'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.12 },
}

const features = [
  {
    icon: '🖼️',
    title: 'Image Verification',
    desc: 'Detect deepfakes and AI-generated images with advanced neural network analysis.',
    path: '/image-verification',
    gradient: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    icon: '👁️',
    title: 'Gaze Detection',
    desc: 'Analyze eye gaze patterns to identify AI-manipulated video call participants.',
    path: '/gaze-detection',
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    icon: '📝',
    title: 'Text Verification',
    desc: 'Fact-check text content and detect misinformation with AI-powered analysis.',
    path: '/text-verification',
    gradient: 'from-violet-500/10 to-purple-500/10',
  },
]

const steps = [
  { num: '01', title: 'Upload', desc: 'Upload an image, video, or enter text you want to verify.', icon: '📤' },
  { num: '02', title: 'Analyze', desc: 'Our AI engine processes and analyzes the content in real-time.', icon: '🧠' },
  { num: '03', title: 'Results', desc: 'Get detailed results with confidence scores and explanations.', icon: '📊' },
]

const stats = [
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '< 3s', label: 'Avg. Response' },
  { value: '50K+', label: 'Scans Completed' },
  { value: '24/7', label: 'Availability' },
]

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Typewriter effect
  const words = ['Real', 'Authentic', 'Trustworthy', 'Verified']
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const speed = isDeleting ? 50 : 100
    const pause = !isDeleting && text === currentWord ? 2000 : isDeleting && text === '' ? 500 : speed

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentWord) {
        setIsDeleting(true)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      } else if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1))
      } else {
        setText(currentWord.substring(0, text.length + 1))
      }
    }, pause)

    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex])

  return (
    <PageWrapper>
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden pt-20">
        {/* Animated mesh background */}
        <div className="absolute inset-0 mesh-gradient-bg" />


        {/* Floating orbs with parallax */}
        <motion.div
          className="floating-orb w-[500px] h-[500px] bg-primary-300/20 -top-40 -left-40"
          animate={{ y: [-30, 30, -30], x: [-15, 15, -15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="floating-orb w-[400px] h-[400px] bg-accent-300/15 -bottom-20 -right-20"
          animate={{ y: [30, -30, 30], x: [15, -15, 15] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="floating-orb w-72 h-72 bg-violet-300/15 top-1/4 right-1/4"
          animate={{ y: [-20, 20, -20], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-40 right-[15%] w-16 h-16 border border-primary-200/30 rounded-2xl hidden lg:block"
          animate={{ rotate: 360, y: [-15, 15, -15] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[8%] w-10 h-10 bg-accent-200/20 rounded-full hidden lg:block"
          animate={{ scale: [1, 1.4, 1], y: [-25, 5, -25] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[60%] right-[8%] w-6 h-6 border border-violet-300/25 rounded-full hidden lg:block"
          animate={{ y: [-25, 15, -25] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[20%] left-[20%] w-3 h-3 bg-primary-400/30 rounded-full hidden lg:block"
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero content with parallax */}
        <motion.div
          className="relative max-w-7xl mx-auto px-6 py-8 w-full z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs font-semibold text-primary-700 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                  AI-Powered Authenticity Platform
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.08] tracking-tight mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                Verify What's{' '}
                <span className="inline-block min-w-[280px] sm:min-w-[360px]">
                  <span className="gradient-text-hero">{text}</span>
                  <span className="inline-block w-[3px] h-[0.75em] bg-primary-500 ml-0.5 align-baseline animate-pulse rounded-full" />
                </span>
                <br />
                in the Digital Age
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed mb-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                Authentix uses cutting-edge AI to detect deepfakes, verify images,
                analyze eye gaze manipulation, and combat misinformation — all in real time.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to="/image-verification" className="btn-primary text-base gap-2 group">
                  Try Now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/about" className="btn-secondary text-base">
                  Learn More
                </Link>
              </motion.div>
            </div>

            {/* Right: Floating hero visual (fixed layout) */}
            <motion.div
              className="hidden lg:flex justify-center"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="w-full max-w-sm relative"
                animate={{ y: [-12, 12, -12] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Glow behind card */}
                <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary-300/25 to-accent-300/25 blur-3xl animate-pulse-soft" />

                {/* Main card */}
                <div className="relative glass-strong rounded-3xl p-8 shadow-glass-lg">
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 mb-4">
                      <span className="text-3xl">🛡️</span>
                    </div>
                    <div className="text-base font-bold font-display text-gray-800">AI Shield Active</div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                      <span className="text-xs text-accent-600 font-medium">Scanning in real-time</span>
                    </div>
                  </div>

                  {/* Animated bars */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Image Analysis</span>
                        <span className="text-primary-600 font-semibold">98%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                          initial={{ width: 0 }}
                          animate={{ width: '98%' }}
                          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Gaze Detection</span>
                        <span className="text-accent-600 font-semibold">94%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400"
                          initial={{ width: 0 }}
                          animate={{ width: '94%' }}
                          transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Text Verification</span>
                        <span className="text-violet-600 font-semibold">96%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                          initial={{ width: 0 }}
                          animate={{ width: '96%' }}
                          transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status indicators */}
                  <div className="flex gap-2 mt-5">
                    <div className="flex-1 p-2.5 rounded-xl bg-white/50 text-center">
                      <div className="text-lg font-bold font-display text-gray-800">3</div>
                      <div className="text-[10px] text-gray-500">Modules</div>
                    </div>
                    <div className="flex-1 p-2.5 rounded-xl bg-white/50 text-center">
                      <div className="text-lg font-bold font-display text-accent-600">Live</div>
                      <div className="text-[10px] text-gray-500">Status</div>
                    </div>
                    <div className="flex-1 p-2.5 rounded-xl bg-white/50 text-center">
                      <div className="text-lg font-bold font-display text-gray-800">&lt;3s</div>
                      <div className="text-[10px] text-gray-500">Speed</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-300/50 flex justify-center pt-2">
            <motion.div
              className="w-1 h-2.5 rounded-full bg-gray-400/60"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <motion.div key={stat.label} {...fadeUp}>
                <GlassCard className="text-center !p-6" hover={false}>
                  <div className="text-3xl sm:text-4xl font-bold font-display gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-4">
              CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
              Powerful AI Verification Tools
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Three specialized modules working together to protect you from digital deception.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid md:grid-cols-3 gap-6">
            {features.map((feat) => (
              <motion.div key={feat.title} {...fadeUp}>
                <Link to={feat.path}>
                  <GlassCard className="group relative overflow-hidden h-full !p-8">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center text-2xl mb-5 shadow-glass-sm group-hover:scale-110 transition-transform duration-300">
                        {feat.icon}
                      </div>
                      <h3 className="text-xl font-bold font-display text-gray-900 mb-2">{feat.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{feat.desc}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all duration-300">
                        Try it now
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative py-24 mesh-gradient-bg">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-700 text-xs font-semibold mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Get verified results in seconds with our streamlined process.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} {...fadeUp} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary-200 to-transparent" />
                )}
                <GlassCard className="text-center relative !p-8" hover={false}>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-xs font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold font-display text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp}>
            <GlassCard className="!p-12 sm:!p-16 text-center relative overflow-hidden" hover={false}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-accent-50/50" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
                  Ready to Verify?
                </h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Start detecting deepfakes, misinformation, and AI manipulation today. It's fast, accurate, and free.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/image-verification" className="btn-primary text-base">
                    Start Verifying
                  </Link>
                  <Link to="/signup" className="btn-secondary text-base">
                    Create Account
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
