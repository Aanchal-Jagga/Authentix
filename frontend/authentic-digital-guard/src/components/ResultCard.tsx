import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

type Verdict = 'REAL' | 'FAKE' | 'DEEPFAKE' | 'AI_GENERATED' | string;

interface ResultCardProps {
  verdict: Verdict;
  confidence: number; // 0–100
  details?: { label: string; value: string | number }[];
  explanation?: string;
}

const getVerdictConfig = (verdict: Verdict) => {
  const v = verdict.toUpperCase();
  if (v === 'REAL')
    return {
      color: 'text-green-400',
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
      label: 'AUTHENTIC',
      icon: <CheckCircle2 className="w-8 h-8" />,
      desc: 'This content appears to be genuine and unmanipulated.',
    };
  if (v === 'AI_GENERATED')
    return {
      color: 'text-orange-400',
      glow: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]',
      label: 'AI GENERATED',
      icon: <ShieldAlert className="w-8 h-8" />,
      desc: 'This content shows signs of AI generation.',
    };
  // FAKE / DEEPFAKE
  return {
    color: 'text-red-500',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    label: v === 'DEEPFAKE' ? 'DEEPFAKE DETECTED' : 'FAKE DETECTED',
    icon: <AlertTriangle className="w-8 h-8" />,
    desc: 'This content shows signs of manipulation or face-swapping.',
  };
};

export default function ResultCard({ verdict, confidence, details, explanation }: ResultCardProps) {
  const config = getVerdictConfig(verdict);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`glass-card p-8 ${config.glow}`}
    >
      {/* Verdict + Meter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
        <ConfidenceMeter value={confidence} label={verdict} />

        <div className="text-center sm:text-left">
          <div className={`flex items-center justify-center sm:justify-start gap-3 text-3xl font-display font-bold mb-3 ${config.color}`}>
            {config.icon}
            {config.label}
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">{config.desc}</p>
        </div>
      </div>

      {/* Detail grid */}
      {details && details.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {details.map((d) => (
            <div key={d.label} className="glass-card p-4">
              <p className="text-sm text-muted-foreground">{d.label}</p>
              <p className="text-xl font-bold font-display">{d.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 rounded-xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h4 className="text-xs font-display tracking-widest text-muted-foreground mb-2">EXPLANATION</h4>
          <p className="text-sm text-foreground/80 leading-relaxed">{explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
