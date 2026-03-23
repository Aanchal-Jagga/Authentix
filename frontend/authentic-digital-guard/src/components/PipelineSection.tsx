import { motion } from 'framer-motion';
import { Upload, Brain, Combine, BarChart3, ArrowRight } from 'lucide-react';

const pipelineSteps = [
  { icon: Upload, label: 'Media Input' },
  { icon: Brain, label: 'AI Analysis' },
  { icon: Combine, label: 'Signal Fusion' },
  { icon: BarChart3, label: 'Authenticity Score' },
];

const PipelineSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-4">The Authentix Pipeline</h2>
          <p className="text-muted-foreground mb-16">From media input to authenticity verdict in milliseconds.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center"
            >
              <div className="glass-card p-6 flex flex-col items-center gap-3 w-36">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-display text-xs text-foreground tracking-wider">{step.label}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-primary/30 mx-2 hidden sm:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
