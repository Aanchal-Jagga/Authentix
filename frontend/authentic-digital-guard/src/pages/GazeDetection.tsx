import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Chrome, Eye } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import UploadBox from '@/components/UploadBox';
import ScanAnimation from '@/components/ScanAnimation';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import ErrorCard from '@/components/ErrorCard';
import Footer from '@/components/Footer';
import { detectGazeFrame, detectGazeVideo } from '@/services/api';
import SineWave from '@/components/SineWave';

const GazeDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const isVideo = file.type.startsWith('video/');
      const data = isVideo ? await detectGazeVideo(file) : await detectGazeFrame(file);

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const isSuspicious = result?.ai_gaze_detected;
  const score = result?.score != null ? result.score : result?.final_score != null ? result.final_score : 0;
  const scorePercent = score * 100;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 relative">

        {/* SINE WAVE BACKGROUND */}
        <div className="fixed inset-x-0 bottom-0 h-[250px] pointer-events-none z-0 opacity-70">
          <SineWave
            status={
              !result || scanning
                ? 'idle'
                : result.ai_gaze_detected
                  ? 'deepfake'
                  : 'real'
            }
            height={200}
          />
        </div>
        <section className="section-padding">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text">Gaze Detection</h1>
              </div>
              <p className="text-muted-foreground">Detect gaze manipulation and eye contact correction in images and videos.</p>
            </motion.div>

            <div className="glass-card p-6 sm:p-8">
              <UploadBox label="Upload Image or Video" accept="image/*,video/*" onFile={(f) => { setFile(f); setResult(null); setError(null); }} />

              <button
                onClick={handleAnalyze}
                disabled={!file || scanning}
                className="glow-button w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {scanning ? 'Analyzing...' : 'Analyze Gaze'}
              </button>

              <AnimatePresence>{scanning && <ScanAnimation />}</AnimatePresence>

              {/* ERROR */}
              <AnimatePresence>
                {error && !scanning && (
                  <div className="mt-8">
                    <ErrorCard message={error} />
                  </div>
                )}
              </AnimatePresence>

              {/* RESULT */}
              <AnimatePresence>
                {result && !scanning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className={`mt-8 glass-card p-6 ${isSuspicious ? 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'shadow-[0_0_30px_rgba(34,197,94,0.3)]'}`}
                  >
                    {/* Verdict + Meter */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-6">
                      <ConfidenceMeter
                        value={scorePercent}
                        label={isSuspicious ? 'AI Gaze Detected' : 'Natural Gaze'}
                      />
                      <div className="text-center sm:text-left">
                        <div className={`flex items-center justify-center sm:justify-start gap-3 text-3xl font-display font-bold mb-3 ${isSuspicious ? 'text-red-500' : 'text-green-400'}`}>
                          {isSuspicious ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                          {isSuspicious ? 'Suspicious' : 'Natural'}
                        </div>
                        <p className="text-muted-foreground text-sm max-w-xs">
                          {isSuspicious
                            ? 'This content shows signs of AI-manipulated eye gaze patterns.'
                            : 'The eye gaze patterns appear natural and unmanipulated.'}
                        </p>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-4">
                        <p className="text-sm text-muted-foreground">AI Gaze Detected</p>
                        <p className={`text-xl font-bold font-display ${isSuspicious ? 'text-red-500' : 'text-green-400'}`}>
                          {isSuspicious ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-sm text-muted-foreground">Gaze Score</p>
                        <p className="text-xl font-bold font-display">{scorePercent.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Signals */}
                    {result.signals && result.signals.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-display tracking-widest text-muted-foreground mb-3">SIGNALS</p>
                        <ul className="space-y-2">
                          {result.signals.map((s: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <div className={`w-1.5 h-1.5 rounded-full ${isSuspicious ? 'bg-destructive' : 'bg-primary'}`} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
