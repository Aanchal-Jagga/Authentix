import { motion } from 'framer-motion';

const getColor = (value: number) => {
  if (value >= 80) return { stroke: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', label: 'High Confidence' };
  if (value >= 50) return { stroke: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)', label: 'Medium Confidence' };
  return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Low Confidence' };
};

interface ConfidenceMeterProps {
  value?: number;
  label?: string;
  size?: number;
}

export default function ConfidenceMeter({ value = 0, label = '', size = 180 }: ConfidenceMeterProps) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const color = getColor(value);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 180 180" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Animated progress */}
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold font-display"
            style={{ color: color.stroke }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {Math.round(value)}%
          </motion.span>
          <span className="text-xs text-muted-foreground mt-1">{color.label}</span>
        </div>
      </div>
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: color.bg, color: color.stroke }}
          >
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
}
