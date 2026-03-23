import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-6">About Authentix</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Authentix is designed to protect trust in digital communication by detecting manipulated media and suspicious AI behavior. In an era where seeing is no longer believing, we provide the technology to distinguish reality from fabrication.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to ensure that every video call, every piece of media, and every digital interaction can be trusted. We believe in a future where technology empowers truth — not deception.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
