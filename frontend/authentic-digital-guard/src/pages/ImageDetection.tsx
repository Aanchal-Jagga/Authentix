import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chrome, ImageIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import UploadBox from '@/components/UploadBox';
import ScanAnimation from '@/components/ScanAnimation';
import ResultCard from '@/components/ResultCard';
import ErrorCard from '@/components/ErrorCard';
import Footer from '@/components/Footer';
import { analyzeImage } from '@/services/api';
import SineWave from '@/components/SineWave';

const ImageDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setScanning(true);
      setResult(null);
      setError(null);

      const res = await analyzeImage(file);

      if (res.error) {
        setError(res.error);
      } else {
        setResult({
          verdict: res.label || 'UNKNOWN',
          confidence: res.confidence != null ? Math.round(res.confidence * 100) : 0,
          faces_detected: res.faces_detected || 0,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 relative">

        {/* SINE WAVE BACKGROUND */}
        <div className="fixed inset-x-0 bottom-0 h-[250px] pointer-events-none z-0 opacity-70">
          <SineWave
            status={
              !result || scanning
                ? 'idle'
                : result.verdict === 'REAL'
                  ? 'real'
                  : result.verdict === 'DEEPFAKE'
                    ? 'deepfake'
                    : 'ai'
            }
            height={200}
          />
        </div>

        <section className="section-padding">
          <div className="max-w-3xl mx-auto">

            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <ImageIcon className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold gradient-text">
                  Image Detection
                </h1>
              </div>
              <p className="text-muted-foreground">
                Detect if an image is real, AI-generated, or deepfake.
              </p>
            </motion.div>

            {/* UPLOAD */}
            <div className="glass-card p-8">

              <UploadBox
                label="Upload Image"
                accept="image/*"
                onFile={(f) => {
                  setFile(f);
                  setResult(null);
                  setError(null);
                }}
              />

              <button
                onClick={handleAnalyze}
                disabled={!file || scanning}
                className="glow-button w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {scanning ? 'Analyzing...' : 'Analyze Image'}
              </button>

              <AnimatePresence>
                {scanning && <ScanAnimation />}
              </AnimatePresence>

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
                  <div className="mt-10">
                    <ResultCard
                      verdict={result.verdict}
                      confidence={result.confidence}
                      details={[
                        { label: 'Faces Detected', value: result.faces_detected },
                        { label: 'Confidence Score', value: `${result.confidence}%` },
                      ]}
                    />
                  </div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </section>

        {/* EXTENSION SECTION */}
        <section className="section-padding text-center">

          <h2 className="text-3xl font-bold gradient-text mb-6">
            Install Extension
          </h2>

          <div className="flex justify-center gap-10 mb-8">
            {['Chrome', 'Edge', 'Brave'].map((b) => (
              <div key={b} className="flex flex-col items-center gap-2">
                <Chrome className="w-10 h-10 text-primary" />
                <span className="text-sm text-muted-foreground">{b}</span>
              </div>
            ))}
          </div>

          <button className="glow-button px-10 py-4 text-lg">
            Add Extension
          </button>

        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ImageDetection;