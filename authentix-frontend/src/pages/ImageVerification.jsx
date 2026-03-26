import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper, LoadingSpinner } from '../components/LoadingSpinner'
import GlassCard from '../components/GlassCard'
import FileUpload from '../components/FileUpload'
import ConfidenceMeter from '../components/ConfidenceMeter'
import { analyzeImage } from '../services/api'

export default function ImageVerification() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeImage(file)
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getLabelInfo = (label) => {
    switch (label?.toUpperCase()) {
      case 'REAL':
        return { color: '#0ca678', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✅', desc: 'This image appears to be authentic.' }
      case 'FAKE':
        return { color: '#e03131', bg: 'bg-red-50', text: 'text-red-700', icon: '⚠️', desc: 'This image shows signs of manipulation or AI generation.' }
      default:
        return { color: '#f59f00', bg: 'bg-amber-50', text: 'text-amber-700', icon: '❓', desc: 'Unable to determine authenticity conclusively.' }
    }
  }

  return (
    <PageWrapper>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg" />
        <motion.div
          className="floating-orb w-64 h-64 bg-blue-200/30 -top-10 right-20"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-4">
              🖼️ Image Verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-3">
              Detect Deepfakes & AI Images
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Upload any image and our AI will analyze it for signs of manipulation, face-swapping, or AI generation.
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="!p-8" hover={false}>
              <FileUpload
                onFileSelect={setFile}
                accept="image/*"
                label="Upload an image to verify"
              />

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className={`btn-primary text-base gap-2 ${!file || loading ? 'opacity-50 cursor-not-allowed !transform-none' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Image
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                  <LoadingSpinner size="lg" text="Our AI is analyzing your image..." />
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
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Analysis Failed</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-6"
              >
                {/* Main Result */}
                <GlassCard className="text-center !py-10" hover={false}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    <ConfidenceMeter
                      value={result.confidence ? result.confidence * 100 : 0}
                      label={result.label}
                    />
                    <div className="text-left">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${getLabelInfo(result.label).bg} ${getLabelInfo(result.label).text} font-semibold mb-3`}>
                        <span className="text-lg">{getLabelInfo(result.label).icon}</span>
                        {result.label}
                      </div>
                      <p className="text-gray-600 text-sm max-w-xs">
                        {getLabelInfo(result.label).desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <GlassCard className="!p-5" hover={false}>
                    <div className="text-sm font-semibold text-gray-500 mb-1">Faces Detected</div>
                    <div className="text-2xl font-bold font-display text-gray-900">
                      {result.faces_detected || 0}
                    </div>
                  </GlassCard>
                  <GlassCard className="!p-5" hover={false}>
                    <div className="text-sm font-semibold text-gray-500 mb-1">Confidence Score</div>
                    <div className="text-2xl font-bold font-display gradient-text">
                      {result.confidence ? (result.confidence * 100).toFixed(1) : 0}%
                    </div>
                  </GlassCard>
                </div>


              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  )
}
