import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chrome, ImageIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import UploadBox from '@/components/UploadBox';
import ScanAnimation from '@/components/ScanAnimation';
import Footer from '@/components/Footer';
import { detectImage } from '@/services/api';

type Result = {
  verdict: 'DEEPFAKE' | 'AI_GENERATED' | 'REAL';
  confidence: number;
  faces_detected: number;
};

const ImageDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setScanning(true);
      setResult(null);

      const res = await detectImage(file);

      setResult({
        verdict:
          res.label === "DEEPFAKE"
            ? "DEEPFAKE"
            : res.label === "AI_GENERATED"
            ? "AI_GENERATED"
            : "REAL",
        confidence: Math.round(res.confidence * 100),
        faces_detected: res.faces_detected || 0,
      });

    } catch (err) {
      console.error(err);
      alert("Backend error");
    } finally {
      setScanning(false);
    }
  };

  // 🎯 FIXED NEEDLE POSITION (NOT BASED ON SCORE)
  const getNeedleRotation = () => {
    if (!result) return 0;

    if (result.verdict === "DEEPFAKE") return -70;   // left (red)
    if (result.verdict === "AI_GENERATED") return 0; // middle (orange)
    return 70; // right (green)
  };

  const getColor = () => {
    if (!result) return '';
    if (result.verdict === 'DEEPFAKE') return 'text-red-500';
    if (result.verdict === 'AI_GENERATED') return 'text-orange-400';
    return 'text-green-400';
  };

  const getLabel = () => {
    if (!result) return '';
    if (result.verdict === 'DEEPFAKE') return 'DEEPFAKE DETECTED';
    if (result.verdict === 'AI_GENERATED') return 'AI GENERATED';
    return 'REAL IMAGE';
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24">

        <section className="section-padding">
          <div className="max-w-3xl mx-auto">

            {/* HEADER */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ImageIcon className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold gradient-text">
                  Image Detection
                </h1>
              </div>
              <p className="text-muted-foreground">
                Detect if an image is real, AI-generated, or deepfake.
              </p>
            </div>

            {/* UPLOAD */}
            <div className="glass-card p-8">

              <UploadBox
                label="Upload Image"
                accept="image/*"
                onFile={(f) => {
                  setFile(f);
                  setResult(null);
                }}
              />

              {file && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!file || scanning}
                className="glow-button w-full mt-6"
              >
                {scanning ? "Analyzing..." : "Analyze Image"}
              </button>

              {scanning && <ScanAnimation />}

              {/* RESULT */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 glass-card p-8 text-center"
                  >

                    {/* LABEL */}
                    <div className={`text-3xl font-bold mb-4 ${getColor()}`}>
                      {getLabel()}
                    </div>

                    {/* 🚀 PREMIUM SPEEDTEST-STYLE METER */}
                    <div className="relative w-72 h-40 mx-auto mb-8 flex items-end justify-center">

                      {/* Glow */}
                      <div className="absolute w-full h-full blur-3xl opacity-25 rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-green-400" />

                      {/* SVG Gauge */}
                      <svg viewBox="0 0 200 120" className="w-full h-full">

                        {/* Background arc */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="12"
                          strokeLinecap="round"
                        />

                        {/* Colored arc */}
                        <defs>
                          <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#fb923c" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>

                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="url(#meterGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                        />

                        {/* Needle */}
                        <g
                          transform={`rotate(${getNeedleRotation()} 100 100)`}
                          className="transition-all duration-500"
                        >
                          <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="35"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <circle cx="100" cy="100" r="6" fill="white" />
                        </g>

                      </svg>

                    </div>

                    {/* CONFIDENCE */}
                    <div className="text-5xl font-bold mb-2">
                      {result.confidence}%
                    </div>

                    <p className="text-muted-foreground mb-6">
                      Confidence Score
                    </p>

                    {/* EXTRA INFO */}
                    <div className="grid grid-cols-2 gap-4">

                      <div className="glass-card p-4">
                        <p className="text-sm text-muted-foreground">
                          Faces Detected
                        </p>
                        <p className="text-xl font-bold">
                          {result.faces_detected}
                        </p>
                      </div>

                      <div className="glass-card p-4">
                        <p className="text-sm text-muted-foreground">
                          Verdict
                        </p>
                        <p className={`text-xl font-bold ${getColor()}`}>
                          {result.verdict}
                        </p>
                      </div>

                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </section>

        {/* 🔥 FIXED EXTENSION SECTION */}
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