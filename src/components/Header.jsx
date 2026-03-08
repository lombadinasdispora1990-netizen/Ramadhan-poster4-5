import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-surface-500/80 backdrop-blur-xl border-b border-white/[0.06]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          {/* Animated logo */}
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow-green relative">
              <span className="text-white font-display font-bold text-lg">B</span>
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-xl border-2 border-brand-400/40 animate-ping" style={{ animationDuration: '3s' }} />
          </motion.div>

          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold gradient-text tracking-tight">
              BarokahGen
            </h1>
            <p className="text-[11px] text-gray-500 font-medium tracking-wider uppercase hidden sm:block">
              AI Poster Generator
            </p>
          </div>
        </div>

        {/* Center: Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hidden md:flex items-center gap-2 badge-brand"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered</span>
        </motion.div>

        {/* Right: Powered by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="hidden sm:flex items-center gap-2 text-xs text-gray-500"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          <span>Powered by Alibaba Cloud</span>
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
    </motion.header>
  );
};

export default Header;
