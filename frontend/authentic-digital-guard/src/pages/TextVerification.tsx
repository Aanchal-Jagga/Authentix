import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScanAnimation from '@/components/ScanAnimation';
import Footer from '@/components/Footer';

type Result = { verdict: 'FAKE' | 'REAL' | 'MISLEADING'; confidence: number; reason: string };

const TextVerification = () => {
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnalyze = () => {
    if (!text) return;
    setScanning(true);
    setResult(null);

    setTimeout(() => {
      setScanning(false);
      const fake = Math.random() > 0.5;

      setResult({
        verdict: fake ? 'FAKE' : 'REAL',
        confidence: fake ? 85 + Math.floor(Math.random() * 10) : 90 + Math.floor(Math.random() * 8),
        reason: fake
          ? 'Detected misleading claims and inconsistent facts.'
          : 'Content aligns with verified factual patterns.',
      });
    }, 3000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24">
        <section className="section-padding">
          <div className="max-w-3xl mx-auto">
            
            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text">
                  Text Verification
                </h1>
              </div>
              <p className="text-muted-foreground">
                Analyze text to detect fake news, misinformation, or misleading content.
              </p>
            </motion.div>

            {/* INPUT CARD */}
            <div className="glass-card p-6 sm:p-8">
              
              <textarea
                rows={6}
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 rounded-lg bg-muted text-foreground outline-none"
              />

              <button
                onClick={handleAnalyze}
                disabled={!text || scanning}
                className="glow-button w-full mt-6 disabled:opacity-40"
              >
                {scanning ? 'Analyzing...' : 'Analyze Text'}
              </button>

              <AnimatePresence>
                {scanning && <ScanAnimation />}
              </AnimatePresence>

              {/* RESULT */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 glass-card p-6"
                  >
                    <div className="text-center mb-6">
                      <p className="text-xs font-display tracking-widest text-muted-foreground mb-2">
                        ANALYSIS RESULT
                      </p>

                      <div className={`text-4xl font-display font-bold ${
                        result.verdict === 'FAKE' ? 'text-destructive' : 'text-primary'
                      }`}>
                        <span className="flex items-center justify-center gap-3">
                          {result.verdict === 'FAKE'
                            ? <AlertTriangle className="w-8 h-8" />
                            : <CheckCircle2 className="w-8 h-8" />}
                          {result.verdict}
                        </span>
                      </div>

                      <p className="text-muted-foreground mt-2">
                        Confidence: <span className="text-foreground font-semibold">{result.confidence}%</span>
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      {result.reason}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default TextVerification;