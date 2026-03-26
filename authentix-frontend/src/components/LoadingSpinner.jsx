import { motion } from 'framer-motion'

export function LoadingSpinner({ size = 'md', text = 'Analyzing...' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full border-2 border-primary-100`}
          style={{ borderTopColor: '#4263eb' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={`absolute inset-1 rounded-full border-2 border-accent-100`}
          style={{ borderBottomColor: '#20c997' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && (
        <motion.p
          className="text-sm text-gray-500 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return (
    <motion.div
      className={`bg-gray-200/60 rounded-xl ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

export function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  )
}
