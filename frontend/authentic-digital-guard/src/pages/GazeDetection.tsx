import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Chrome, Eye } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import UploadBox from '@/components/UploadBox';
import ScanAnimation from '@/components/ScanAnimation';
import Footer from '@/components/Footer';

type Result = { verdict: string; confidence: number; signals: string[] };

const GazeDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnalyze = () => {
    if (!file) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      const suspicious = Math.random() > 0.4;
      setResult({
        verdict: suspicious ? 'Suspicious' : 'Normal',
        confidence: suspicious ? 0.65 + Math.random() * 0.25 : 0.85 + Math.random() * 0.12,
        signals: suspicious
          ? ['Head-gaze mismatch', 'Low microsaccades', 'Gaze correction artifacts']
          : ['Natural gaze patterns', 'Consistent microsaccades', 'No correction detected'],
      });
    }, 3500);
  };

  const isSuspicious = result?.verdict === 'Suspicious';

  return (
    <PageTransition>
      <div className="min-h-screen pt-24">
        <section className="section-padding">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text">Gaze Detection</h1>
              </div>
              <p className="text-muted-foreground">Detect gaze manipulation and eye contact correction in videos.</p>
            </motion.div>

            <div className="glass-card p-6 sm:p-8">
              <UploadBox label="Upload Video" accept="video/*" onFile={(f) => { setFile(f); setResult(null); }} />

              {file && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-muted-foreground">
                  Selected: <span className="text-foreground">{file.name}</span>
                </motion.div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!file || scanning}
                className="glow-button w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {scanning ? 'Analyzing...' : 'Analyze Video'}
              </button>

              <AnimatePresence>{scanning && <ScanAnimation />}</AnimatePresence>

              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 glass-card p-6">
                    <div className="text-center mb-6">
                      <p className="text-xs font-display tracking-widest text-muted-foreground mb-2">GAZE ANALYSIS RESULT</p>
                      <div className={`text-4xl font-display font-bold ${isSuspicious ? 'text-destructive' : 'text-primary'}`}>
                        <span className="flex items-center justify-center gap-3">
                          {isSuspicious ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                          {result.verdict}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-2">Confidence: <span className="text-foreground font-semibold">{result.confidence.toFixed(2)}</span></p>
                    </div>
                    <div>
                      <p className="text-xs font-display tracking-widest text-muted-foreground mb-3">SIGNALS</p>
                      <ul className="space-y-2">
                        {result.signals.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <div className={`w-1.5 h-1.5 rounded-full ${isSuspicious ? 'bg-destructive' : 'bg-primary'}`} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Extension Section */}
        <section className="section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold gradient-text mb-4">Authentix Gaze Detector Extension</h2>
              <p className="text-muted-foreground mb-8">Monitor webcam behaviour during meetings in real time. Detect gaze correction and suspicious eye patterns automatically.</p>
              <div className="flex justify-center gap-6 mb-6">
                {['Chrome', 'Edge', 'Brave'].map((b) => (
                  <div key={b} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Chrome className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{b}</span>
                  </div>
                ))}
              </div>
              <button className="glow-button">Add Authentix Gaze Detector Extension</button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GazeDetection;
