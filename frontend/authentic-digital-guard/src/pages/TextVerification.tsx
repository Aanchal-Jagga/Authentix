import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScanAnimation from '@/components/ScanAnimation';
import ErrorCard from '@/components/ErrorCard';
import Footer from '@/components/Footer';
import { verifyText } from '@/services/api';
import SineWave from '@/components/SineWave';

const TextVerification = () => {
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const data = await verifyText(text.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const getVerdictStyle = (verdict: string) => {
    const v = (verdict || '').toLowerCase();
    if (v.includes('true') || v.includes('real') || v.includes('accurate') || v.includes('verified'))
      return { color: 'text-green-400', icon: <CheckCircle2 className="w-8 h-8" />, glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' };
    if (v.includes('false') || v.includes('fake') || v.includes('misleading') || v.includes('misinformation'))
      return { color: 'text-red-500', icon: <AlertTriangle className="w-8 h-8" />, glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' };
    return { color: 'text-orange-400', icon: <AlertTriangle className="w-8 h-8" />, glow: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]' };
  };

  const verdictText = result?.verdict || result?.label || result?.result || 'Unknown';
  const style = getVerdictStyle(verdictText);
  const explanation = result?.explanation || result?.summary || (typeof result?.details === 'string' ? result.details : null);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 relative">

        {/* SINE WAVE BACKGROUND */}
        <div className="fixed inset-x-0 bottom-0 h-[250px] pointer-events-none z-0 opacity-70">
          <SineWave
            status={
              !result || scanning
                ? 'idle'
                : (verdictText.toLowerCase().includes('true') || verdictText.toLowerCase().includes('real') || verdictText.toLowerCase().includes('verified') || verdictText.toLowerCase().includes('accurate'))
                  ? 'real'
                  : 'deepfake'
            }
            height={200}
          />
        </div>
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
                className="w-full p-4 rounded-lg bg-muted text-foreground outline-none resize-none"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">{text.length} characters</span>
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || scanning}
                  className="glow-button disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {scanning ? 'Analyzing...' : 'Analyze Text'}
                </button>
              </div>

              <AnimatePresence>
                {scanning && <ScanAnimation />}
              </AnimatePresence>

              {/* ERROR */}
              <AnimatePresence>
                {error && !scanning && (
                  <div className="mt-8">
                    <ErrorCard title="Verification Failed" message={error} />
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
                    className={`mt-8 glass-card p-6 ${style.glow}`}
                  >
                    {/* Verdict */}
                    <div className="text-center mb-6">
                      <p className="text-xs font-display tracking-widest text-muted-foreground mb-2">
                        ANALYSIS RESULT
                      </p>
                      <div className={`text-4xl font-display font-bold ${style.color}`}>
                        <span className="flex items-center justify-center gap-3">
                          {style.icon}
                          {verdictText}
                        </span>
                      </div>
                      {result.confidence != null && (
                        <p className="text-muted-foreground mt-2">
                          Confidence: <span className="text-foreground font-semibold">{typeof result.confidence === 'number' && result.confidence <= 1 ? `${(result.confidence * 100).toFixed(0)}%` : `${result.confidence}%`}</span>
                        </p>
                      )}
                    </div>

                    {/* Explanation */}
                    {explanation && (
                      <div
                        className="rounded-xl p-5 mb-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <h4 className="text-xs font-display tracking-widest text-muted-foreground mb-2">EXPLANATION</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">{explanation}</p>
                      </div>
                    )}

                    {/* Sources */}
                    {result.sources && result.sources.length > 0 && (
                      <div
                        className="rounded-xl p-5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <h4 className="text-xs font-display tracking-widest text-muted-foreground mb-3">SOURCES</h4>
                        <div className="space-y-2">
                          {result.sources.map((source: any, i: number) => (
                            <a
                              key={i}
                              href={source.url || source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              {source.title || source.url || source}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw fallback */}
                    {!result.verdict && !result.label && !result.result && (
                      <div
                        className="rounded-xl p-5 mt-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <h4 className="text-xs font-display tracking-widest text-muted-foreground mb-2">FULL RESPONSE</h4>
                        <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}
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