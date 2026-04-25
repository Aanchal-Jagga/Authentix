import { motion } from 'framer-motion';
import { Cpu, Brain, Eye, FileSearch, Combine } from 'lucide-react';

const techs = [
  { icon: Eye, label: 'Computer Vision' },
  { icon: Brain, label: 'Deep Learning' },
  { icon: Cpu, label: 'Behavioral Analysis' },
  { icon: FileSearch, label: 'Text Analysis' },
  { icon: Combine, label: 'Multi-Signal Fusion AI' },
];

const TechSection = () => {
  return (
    <section id="tech" className="section-padding relative">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-4">Technology Stack</h2>
          <p className="text-muted-foreground mb-16">Cutting-edge AI technologies working in harmony.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {techs.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 w-40 flex flex-col items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110">
                <t.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="font-display text-xs text-foreground tracking-wider">{t.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
