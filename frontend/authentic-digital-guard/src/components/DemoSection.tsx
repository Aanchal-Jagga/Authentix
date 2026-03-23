import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Video, Mic2, Camera, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

const tabs = [
  { id: 'image', label: 'Upload Image', icon: ImageIcon },
  { id: 'video', label: 'Upload Video', icon: Video },
  { id: 'audio', label: 'Upload Audio', icon: Mic2 },
  { id: 'camera', label: 'Live Camera', icon: Camera },
];

type Result = {
  verdict: 'FAKE' | 'AUTHENTIC';
  confidence: number;
  signals: string[];
};

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnalyze = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      const isFake = Math.random() > 0.4;
      setResult({
        verdict: isFake ? 'FAKE' : 'AUTHENTIC',
        confidence: isFake ? 87 + Math.floor(Math.random() * 10) : 92 + Math.floor(Math.random() * 7),
        signals: isFake
          ? ['Facial manipulation detected', 'Eye contact correction identified', 'Temporal inconsistency']
          : ['No manipulation detected', 'Natural eye movement', 'Consistent temporal flow'],
      });
    }, 3000);
  };

  return (
    <section id="demo" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-4">Interactive Detection Demo</h2>
          <p className="text-muted-foreground">Experience Authentix's detection capabilities firsthand.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 sm:p-8"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setResult(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Upload area */}
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-6 hover:border-primary/30 transition-colors">
            <div className="text-muted-foreground text-sm">
              Drop your {activeTab} file here or click to browse
            </div>
            <div className="text-muted-foreground/50 text-xs mt-2">Simulated demo — no actual file processing</div>
          </div>

          <button onClick={handleAnalyze} disabled={scanning} className="glow-button w-full flex items-center justify-center gap-2">
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {scanning ? 'Analyzing...' : 'Analyze Media'}
          </button>

          {/* Scanning animation */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex flex-col items-center"
              >
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-rotate-slow" />
                  <div className="absolute inset-3 rounded-full border border-secondary/40 animate-rotate-slow" style={{ animationDirection: 'reverse' }} />
                  <div className="absolute inset-6 rounded-full border border-primary/20 animate-pulse-glow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-primary text-sm mt-4 font-display tracking-wider">NEURAL NETWORK ACTIVE</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 glass-card p-6"
              >
                <div className="text-center mb-6">
                  <p className="text-xs font-display tracking-widest text-muted-foreground mb-2">AUTHENTICITY RESULT</p>
                  <div className={`text-4xl font-display font-bold ${
                    result.verdict === 'FAKE' ? 'text-destructive' : 'text-primary'
                  }`}>
                    {result.verdict === 'FAKE' ? (
                      <span className="flex items-center justify-center gap-3">
                        <AlertTriangle className="w-8 h-8" /> FAKE
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-8 h-8" /> AUTHENTIC
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">Confidence: <span className="text-foreground font-semibold">{result.confidence}%</span></p>
                </div>

                <div>
                  <p className="text-xs font-display tracking-widest text-muted-foreground mb-3">SIGNALS DETECTED</p>
                  <ul className="space-y-2">
                    {result.signals.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${result.verdict === 'FAKE' ? 'bg-destructive' : 'bg-primary'}`} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
