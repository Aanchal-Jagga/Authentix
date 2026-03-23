import { motion } from 'framer-motion';
import { Chrome, MonitorSmartphone, Shield, ArrowDown } from 'lucide-react';

const ExtensionSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-4">Browser Extension</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real-time protection during video calls. Detects gaze correction, deepfake participants, and manipulated feeds.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 mb-12"
        >
          {[
            { label: 'Video Meeting', icon: MonitorSmartphone },
            { label: 'Authentix AI Analysis', icon: Shield },
            { label: 'Authenticity Result', icon: Chrome },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="glass-card px-8 py-4 flex items-center gap-3">
                <step.icon className="w-5 h-5 text-primary" />
                <span className="font-display text-sm text-foreground">{step.label}</span>
              </div>
              {i < 2 && <ArrowDown className="w-4 h-4 text-primary/40 my-2" />}
            </div>
          ))}
        </motion.div>

        {/* Browser icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 mb-8"
        >
          {['Chrome', 'Edge', 'Brave'].map((b) => (
            <div key={b} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Chrome className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{b}</span>
            </div>
          ))}
        </motion.div>

        <div className="text-center">
          <button className="glow-button text-sm">Add Extension to Browser</button>
        </div>
      </div>
    </section>
  );
};

export default ExtensionSection;
