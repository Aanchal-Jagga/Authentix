import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper, LoadingSpinner } from '../components/LoadingSpinner'
import GlassCard from '../components/GlassCard'
import { verifyText } from '../services/api'

export default function TextVerification() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleVerify = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await verifyText(text.trim())
      setResult(data)
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getVerdictStyle = (verdict) => {
    const v = (verdict || '').toLowerCase()
    if (v.includes('true') || v.includes('real') || v.includes('accurate') || v.includes('verified'))
      return { icon: '✅', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
    if (v.includes('false') || v.includes('fake') || v.includes('misleading') || v.includes('misinformation'))
      return { icon: '⚠️', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    return { icon: '❓', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  }

  return (
    <PageWrapper>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg" />
        <motion.div
          className="floating-orb w-64 h-64 bg-violet-200/30 -bottom-10 right-10"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold mb-4">
              📝 Text Verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-3">
              Fact-Check Any Claim
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Paste any news headline, claim, or statement — our AI will analyze it for accuracy and potential misinformation.
            </p>
          </motion.div>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="!p-8" hover={false}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a news headline, claim, or any text you want to verify..."
                className="w-full h-40 bg-white/50 border border-gray-200/60 rounded-xl p-4 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all duration-300 resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400">{text.length} characters</span>
                <button
                  onClick={handleVerify}
                  disabled={!text.trim() || loading}
                  className={`btn-primary text-base gap-2 ${!text.trim() || loading ? 'opacity-50 cursor-not-allowed !transform-none' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Text
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <GlassCard className="flex items-center justify-center !py-16" hover={false}>
                  <LoadingSpinner size="lg" text="Fact-checking your claim..." />
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <GlassCard className="!border-red-200 !bg-red-50/50 text-center !py-10" hover={false}>
                  <div className="text-3xl mb-3">❌</div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Verification Failed</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-6"
              >
                {/* Verdict */}
                <GlassCard className="!p-8" hover={false}>
                  <div className="text-center mb-6">
                    {(() => {
                      const verdict = result.verdict || result.label || result.result || 'Unknown'
                      const style = getVerdictStyle(verdict)
                      return (
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${style.bg} ${style.text} border ${style.border}`}>
                          <span className="text-2xl">{style.icon}</span>
                          <span className="text-xl font-bold font-display">{verdict}</span>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Explanation */}
                  {(result.explanation || result.summary || result.details) && (
                    <div className="bg-white/50 rounded-xl p-5 mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Explanation</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.explanation || result.summary || (typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2))}
                      </p>
                    </div>
                  )}

                  {/* Sources */}
                  {result.sources && result.sources.length > 0 && (
                    <div className="bg-white/50 rounded-xl p-5 mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Sources</h3>
                      <div className="space-y-2">
                        {result.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.url || source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {source.title || source.url || source}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw info fallback */}
                  {!result.verdict && !result.label && !result.result && (
                    <div className="bg-white/50 rounded-xl p-5 mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Full Response</h3>
                      <pre className="text-xs text-gray-600 overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  )
}
