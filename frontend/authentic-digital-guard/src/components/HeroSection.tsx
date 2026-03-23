// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import HeroScene from './HeroScene';
// import { Shield, ScanEye } from 'lucide-react';

// const HeroSection = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
//       <HeroScene />

//       {/* Gradient overlays */}
//       <div className="absolute inset-0 z-[1] pointer-events-none">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
//         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />
//       </div>

//       <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//           className="flex items-center justify-center gap-2 mb-6"
//         >
//           <Shield className="w-5 h-5 text-primary" />
//           <span className="text-xs font-display tracking-[0.2em] text-primary uppercase">
//             AI-Powered Authenticity
//           </span>
//         </motion.div>

//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.5 }}
//           className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
//         >
//           <span className="text-foreground">Detect the Truth Behind</span>
//           <br />
//           <span className="gradient-text">Digital Media</span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.7 }}
//           className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
//         >
//           Advanced AI system that detects deepfakes, voice clones, and suspicious interview behavior in real time.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.9 }}
//           className="flex flex-col sm:flex-row gap-4 justify-center"
//         >
//           <a href="#features" className="glow-button flex items-center justify-center gap-2">
//             <ScanEye className="w-4 h-4" />
//             Explore Features
//           </a>
//           <Link to="/image-detection" className="glow-button-outline flex items-center justify-center gap-2">
//             Try Image Detection
//           </Link>
//         </motion.div>

//         {/* Scanning visual */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, delay: 1.2 }}
//           className="mt-16 mx-auto w-48 h-48 sm:w-64 sm:h-64 relative"
//         >
//           <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-glow" />
//           <div className="absolute inset-4 rounded-full border border-primary/30" />
//           <div className="absolute inset-8 rounded-full border border-primary/10" />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <ScanEye className="w-12 h-12 text-primary animate-pulse-glow" />
//           </div>
//           {/* Scan line */}
//           <div className="absolute inset-0 overflow-hidden rounded-full">
//             <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
//           </div>
//         </motion.div>
//       </div>

//       {/* Scroll indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 2 }}
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
//       >
//         <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
//           <motion.div
//             animate={{ y: [0, 12, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//             className="w-1 h-1 rounded-full bg-primary"
//           />
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default HeroSection;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroScene from './HeroScene';
import { Shield, ScanEye } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-20 md:pt-30">
      <HeroScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center justify-center">

        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-xs font-display tracking-[0.2em] text-primary uppercase">
            AI-Powered Authenticity
          </span>
        </motion.div>

        {/* MAIN HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6 hero-glow"
        >
          <span className="text-white block">
            Detect the Truth Behind
          </span>

          <span className="gradient-text block drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]">
            Digital Media
          </span>
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Advanced AI system that detects deepfakes, voice clones, and suspicious interview behavior in real time.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#features"
            className="glow-button flex items-center justify-center gap-2"
          >
            <ScanEye className="w-4 h-4" />
            Explore Features
          </a>

          <Link
            to="/image-detection"
            className="glow-button-outline flex items-center justify-center gap-2"
          >
            Try Image Detection
          </Link>
        </motion.div>

        {/* SCAN CIRCLE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 mx-auto w-48 h-48 sm:w-64 sm:h-64 relative"
        >
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-glow" />
          <div className="absolute inset-4 rounded-full border border-primary/40" />
          <div className="absolute inset-8 rounded-full border border-primary/20" />

          <div className="absolute inset-0 flex items-center justify-center">
            <ScanEye className="w-12 h-12 text-primary animate-pulse-glow" />
          </div>

          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
          </div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;