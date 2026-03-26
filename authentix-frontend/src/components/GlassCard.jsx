import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`glass rounded-2xl p-6 ${hover ? 'hover:shadow-glass-lg hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
