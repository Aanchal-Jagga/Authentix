import { motion } from 'framer-motion';
import { Users, Building2, Newspaper, GraduationCap, ShieldCheck, FileSearch } from 'lucide-react';

const cases = [
  { icon: Users, title: 'Online Interviews', desc: 'Ensure candidate authenticity during remote hiring.' },
  { icon: Building2, title: 'Remote Hiring', desc: 'Verify identity and detect imposters in recruitment.' },
  { icon: FileSearch, title: 'Media Verification', desc: 'Authenticate images, videos, and audio at scale.' },
  { icon: GraduationCap, title: 'Online Education', desc: 'Prevent cheating and identity fraud in exams.' },
  { icon: ShieldCheck, title: 'Corporate Security', desc: 'Protect meetings from deepfake infiltration.' },
  { icon: Newspaper, title: 'Journalism', desc: 'Verify source materials and combat misinformation.' },
];

const UseCasesSection = () => {
  return (
    <section id="usecases" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-4">Use Cases</h2>
          <p className="text-muted-foreground">Where Authentix makes an impact.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex-shrink-0 flex items-center justify-center">
                <c.icon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">{c.title}</h3>
                <p className="text-muted-foreground text-sm">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
