import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper, LoadingSpinner } from '../components/LoadingSpinner'
import GlassCard from '../components/GlassCard'
import FileUpload from '../components/FileUpload'
import ConfidenceMeter from '../components/ConfidenceMeter'
import { detectGazeFrame, detectGazeVideo } from '../services/api'

export default function GazeDetection() {
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
      const isVideo = file.type.startsWith('video/')
      const data = isVideo ? await detectGazeVideo(file) : await detectGazeFrame(file)
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

  const getDetectionInfo = (detected) => {
    if (detected) {
      return {
        icon: '⚠️',
        title: 'AI Gaze Detected',
        desc: 'This content shows signs of AI-manipulated eye gaze patterns.',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      }
    }
    return {
      icon: '✅',
      title: 'Natural Gaze',
      desc: 'The eye gaze patterns appear natural and unmanipulated.',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    }
  }

  return (
    <PageWrapper>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg" />
        <motion.div
          className="floating-orb w-64 h-64 bg-emerald-200/30 top-10 -left-10"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold mb-4">
              👁️ Gaze Detection
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-3">
              Eye Gaze Manipulation Detection
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Upload a face image or video to detect whether AI has been used to alter eye gaze patterns.
            </p>
          </motion.div>

          {/* Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="!p-8" hover={false}>
              <FileUpload
                onFileSelect={setFile}
                accept="image/*,video/*"
                label="Upload a face image or video"
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
                      Detect Gaze
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                  <LoadingSpinner size="lg" text="Analyzing gaze patterns..." />
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
                <GlassCard className="text-center !py-10" hover={false}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    <ConfidenceMeter
                      value={result.score != null ? result.score * 100 : (result.final_score != null ? result.final_score * 100 : 0)}
                      label={result.ai_gaze_detected ? 'AI Gaze Detected' : 'Natural Gaze'}
                    />
                    <div className="text-left">
                      {(() => {
                        const info = getDetectionInfo(result.ai_gaze_detected)
                        return (
                          <>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${info.bg} ${info.text} font-semibold mb-3`}>
                              <span className="text-lg">{info.icon}</span>
                              {info.title}
                            </div>
                            <p className="text-gray-600 text-sm max-w-xs">{info.desc}</p>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </GlassCard>

                <div className="grid sm:grid-cols-2 gap-4">
                  <GlassCard className="!p-5" hover={false}>
                    <div className="text-sm font-semibold text-gray-500 mb-1">AI Gaze Detected</div>
                    <div className={`text-2xl font-bold font-display ${result.ai_gaze_detected ? 'text-red-600' : 'text-emerald-600'}`}>
                      {result.ai_gaze_detected ? 'Yes' : 'No'}
                    </div>
                  </GlassCard>
                  <GlassCard className="!p-5" hover={false}>
                    <div className="text-sm font-semibold text-gray-500 mb-1">Gaze Score</div>
                    <div className="text-2xl font-bold font-display gradient-text">
                      {result.score != null ? (result.score * 100).toFixed(1) : result.final_score != null ? (result.final_score * 100).toFixed(1) : '0.0'}%
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
