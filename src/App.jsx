import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PosterPreview from './components/PosterPreview';
import ActionButtons from './components/ActionButtons';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Animated mesh background */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-orb" />
      </div>

      {/* Dot grid overlay */}
      <div className="dot-grid" aria-hidden="true" />

      {/* Content layer */}
      <div className="relative z-10">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto">
          {/* Hero Section with Upload & Form */}
          <HeroSection />

          {/* Action Buttons - Generate */}
          <ActionButtons />

          {/* Poster Preview */}
          <div className="mt-8">
            <PosterPreview />
          </div>
        </main>

        {/* Footer */}
        <footer className="relative mt-20 pb-8">
          {/* Top divider */}
          <div className="divider-gradient mb-8" />

          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">B</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-sm gradient-text">BarokahGen</p>
                  <p className="text-[10px] text-gray-600">AI Ramadan Poster Generator</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>Made by Jayaguna for Ramadhan</span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span>Powered by Alibaba Cloud AI</span>
              </div>

              {/* Copyright */}
              <p className="text-[10px] text-gray-600">
                © 2026 BarokahGen. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-brand-500/90 backdrop-blur-sm text-white flex items-center justify-center shadow-glow-green hover:bg-brand-400 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

export default App;
