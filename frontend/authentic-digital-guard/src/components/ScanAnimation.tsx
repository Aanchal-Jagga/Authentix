import { motion } from 'framer-motion';

const ScanAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center py-8"
  >
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-rotate-slow" />
      <div className="absolute inset-3 rounded-full border border-secondary/40 animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
      <div className="absolute inset-6 rounded-full border border-primary/20 animate-pulse-glow" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
    <p className="text-primary text-sm mt-4 font-display tracking-wider">ANALYZING...</p>
  </motion.div>
);

export default ScanAnimation;
