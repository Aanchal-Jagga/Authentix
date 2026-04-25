import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Footer from '@/components/Footer';
import { Users, Building2, FileSearch, GraduationCap, Upload, Brain, Combine, BarChart3, ArrowRight, Github, Linkedin, User } from 'lucide-react';

const useCases = [
  { icon: Users, title: 'Online Interviews', desc: 'Ensure candidate authenticity during remote hiring sessions.' },
  { icon: Building2, title: 'Remote Hiring', desc: 'Verify identity and detect imposters in recruitment pipelines.' },
  { icon: FileSearch, title: 'Media Verification', desc: 'Authenticate images, videos, and audio at scale.' },
  { icon: GraduationCap, title: 'Education & Exams', desc: 'Prevent cheating and identity fraud in online exams.' },
];

const pipeline = [
  { icon: Upload, label: 'Input Media' },
  { icon: Brain, label: 'Model Analysis' },
  { icon: Combine, label: 'Signal Fusion' },
  { icon: BarChart3, label: 'Authenticity Result' },
];

const About = () => (
  <PageTransition>
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="section-padding text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-4xl sm:text-5xl font-bold gradient-text mb-6">About Authentix</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Authentix protects trust in digital communication by detecting AI-generated media and suspicious interview behaviour.
            In an era where seeing is no longer believing, we provide the technology to distinguish reality from fabrication.
          </p>
        </motion.div>
      </section>

      {/* Features Explanation */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">What We Detect</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-primary mb-2">Image Deepfake Detection</h3>
                <p>Our deep learning classifiers analyze pixel-level artifacts, compression patterns, and generative model fingerprints to determine if an image was created by AI.</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-primary mb-2">Gaze Correction Detection</h3>
                <p>We detect eye-contact correction tools and gaze manipulation by analyzing microsaccades, head-gaze alignment, and temporal consistency in video streams.</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-primary mb-2">Browser Extension Monitoring</h3>
                <p>The Authentix browser extension monitors video calls in real time, detecting deepfake participants, manipulated feeds, and suspicious behaviour patterns.</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-primary mb-2">Text Verification &amp; Fake News Detection</h3>
                <p>Our AI-powered text analysis engine fact-checks claims, detects misinformation, and identifies AI-generated text by cross-referencing trusted sources and analyzing linguistic patterns.</p>
              </div>
            </div>
          </motion.div>

          {/* Pipeline Diagram */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">How It Works</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
              {pipeline.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="glass-card p-5 flex flex-col items-center gap-3 w-36">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-display text-xs text-foreground tracking-wider">{step.label}</span>
                  </div>
                  {i < pipeline.length - 1 && <ArrowRight className="w-5 h-5 text-primary/30 mx-2 hidden sm:block" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-2xl font-bold gradient-text mb-10 text-center">
            Use Cases
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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

      {/* Developer Section */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold gradient-text mb-8">About the Developer</h2>
            <div className="glass-card p-8">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">AANCHAL JAGGA</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Passionate about AI safety and digital trust. Building Authentix to combat the rising tide of synthetic media and protect the integrity of digital communication.
              </p>
              <div className="flex justify-center gap-4">
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  </PageTransition>
);

export default About;
