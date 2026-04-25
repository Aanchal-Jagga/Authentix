import { motion } from 'framer-motion';
import { ImageIcon, Eye, MonitorSmartphone, Globe, FileText, ShieldCheck } from 'lucide-react';

const features = [
  { icon: ImageIcon, title: 'AI Image Detection', desc: 'Detect images created by generative AI systems with state-of-the-art classifiers.' },
  { icon: FileText, title: 'Text Verification', desc: 'Fact-check claims, detect misinformation, and identify AI-generated text using trusted sources.' },
  { icon: ShieldCheck, title: 'Fake News Detection', desc: 'Analyze news articles and social media posts for misleading claims and fabricated narratives.' },
  { icon: Eye, title: 'Eye Contact Manipulation', desc: 'Detect gaze correction tools used during interviews and video calls.' },
  { icon: MonitorSmartphone, title: 'Real-Time Interview Monitoring', desc: 'Analyze webcam behavior and detect suspicious patterns live.' },
  { icon: Globe, title: 'Browser Extension Protection', desc: 'Monitor online meetings in real time using the Authentix extension.' },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-4">Core Capabilities</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Multi-layered AI detection across every digital medium.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 group cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
