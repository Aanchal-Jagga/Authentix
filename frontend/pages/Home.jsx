import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-6xl font-bold"
      >
        Detect the Truth Behind
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Digital Media
        </span>
      </motion.h1>

      <p className="mt-6 text-gray-400 max-w-xl">
        Advanced AI system that detects deepfakes, AI generated media, and suspicious behavior in real time.
      </p>

      <div className="mt-8 flex gap-4">
        <Link to="/image" className="btn">Try Image Detection</Link>
        <Link to="/text" className="btn">Verify Text</Link>
      </div>

    </div>
  );
}