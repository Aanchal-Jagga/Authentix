import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageWrapper } from '../components/LoadingSpinner'
import GlassCard from '../components/GlassCard'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, ease: 'easeOut' },
}

const challenges = [
  { icon: '🎭', title: 'Deepfakes', desc: 'AI-generated face-swaps and synthetic media are becoming indistinguishable from reality.' },
  { icon: '📰', title: 'Misinformation', desc: 'False claims spread 6x faster than truth on social media, eroding public trust.' },
  { icon: '👁️', title: 'Gaze Manipulation', desc: 'AI tools can alter eye contact in video calls, enabling new forms of impersonation.' },
  { icon: '🖼️', title: 'AI-Generated Images', desc: 'Text-to-image models produce photorealistic fakes that fool the human eye.' },
]

const values = [
  { icon: '🎯', title: 'Accuracy First', desc: 'State-of-the-art models trained on millions of samples for reliable detection.' },
  { icon: '⚡', title: 'Real-Time Speed', desc: 'Results in seconds, not minutes. Built for real-world workflows.' },
  { icon: '🔓', title: 'Open & Transparent', desc: 'We explain our verdicts so users can understand and trust the results.' },
  { icon: '🌍', title: 'Accessible to All', desc: 'Free tier available. Democratizing truth verification for everyone.' },
]

export default function About() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg" />
        <motion.div
          className="floating-orb w-72 h-72 bg-primary-200/30 -top-20 -right-20"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            OUR MISSION
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Building Trust in a{' '}
            <span className="gradient-text">Post-Truth</span> World
          </motion.h1>
          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Authentix is an AI-powered platform that helps individuals, journalists,
            and organizations verify the authenticity of digital content — from images
            and videos to text and live calls.
          </motion.p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold mb-4">
              THE PROBLEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
              Digital Deception Is Everywhere
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              As AI becomes more powerful, so do the tools for digital manipulation.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {challenges.map((item) => (
              <motion.div key={item.title} {...fadeUp}>
                <GlassCard className="h-full !p-7">
                  <span className="text-3xl mb-4 block">{item.icon}</span>
                  <h3 className="text-base font-bold font-display text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 mesh-gradient-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-700 text-xs font-semibold mb-4">
                OUR SOLUTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-6">
                AI That Fights for Truth
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Authentix combines multiple AI models — computer vision, natural language processing,
                and behavioral analysis — into a single platform that anyone can use.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Whether you're a journalist verifying a source image, a company screening video call
                participants, or a citizen checking a viral claim — Authentix gives you the tools
                to know what's real.
              </p>
              <Link to="/image-verification" className="btn-primary">
                Try It Yourself →
              </Link>
            </motion.div>

            <motion.div {...fadeUp}>
              <GlassCard className="!p-8 relative overflow-hidden" hover={false}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-full blur-2xl" />
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-xl">🖼️</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">Image Analysis</div>
                      <div className="text-xs text-gray-500">Deepfake detection with 99.2% accuracy</div>
                    </div>
                    <div className="ml-auto px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-semibold">Active</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50">
                    <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center text-xl">👁️</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">Gaze Analysis</div>
                      <div className="text-xs text-gray-500">Real-time eye gaze manipulation detection</div>
                    </div>
                    <div className="ml-auto px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-semibold">Active</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-xl">📝</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">Text Verification</div>
                      <div className="text-xs text-gray-500">AI-powered fact-checking engine</div>
                    </div>
                    <div className="ml-auto px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-semibold">Active</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold mb-4">
              OUR VALUES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900">
              What Drives Us
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <motion.div key={val.title} {...fadeUp}>
                <GlassCard className="text-center h-full !p-7">
                  <span className="text-3xl mb-4 block">{val.icon}</span>
                  <h3 className="text-base font-bold font-display text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 mesh-gradient-bg">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
              Join the Fight Against Misinformation
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Create a free account and start verifying content today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="btn-primary text-base">Get Started Free</Link>
              <Link to="/image-verification" className="btn-secondary text-base">Try a Demo</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}
