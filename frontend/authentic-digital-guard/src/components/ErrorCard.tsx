import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message: string;
}

export default function ErrorCard({ title = 'Analysis Failed', message }: ErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 text-center"
      style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
    >
      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-display font-bold text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
