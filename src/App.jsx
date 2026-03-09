import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PosterPreview from './components/PosterPreview';
import ActionButtons from './components/ActionButtons';
import HistoryGallery from './components/history/HistoryGallery';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowUp, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Main App Content (with Auth)
function AppContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header onLogin={() => setShowAuthModal(true)} />

      {/* Show main content only if authenticated */}
      {isAuthenticated ? (
        <div className="relative z-10">
          {/* Hero Section with Upload & Form */}
          <HeroSection />

          {/* Action Buttons - Generate */}
          <ActionButtons />

          {/* Poster Preview */}
          <div className="mt-8">
            <PosterPreview />
          </div>

          {/* History Section */}
          <section className="mt-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold text-white mb-3">
                  Your Generation History
                </h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                  All your AI-generated Ramadan posters are saved here. Download or delete them anytime.
                </p>
                {/* Animated underline */}
                <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-brand-400 to-gold-400 rounded-full" />
              </div>
              <HistoryGallery user={user} />
            </div>
          </section>

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
                  <span>Powered by Alibaba Cloud AI + Supabase</span>
                </div>

                {/* Copyright */}
                <p className="text-[10px] text-gray-600">
                  © 2026 BarokahGen. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        // Landing page for non-authenticated users
        <LandingPage onGetStarted={() => setShowAuthModal(true)} />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

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
    </>
  );
}

// Landing Page Component
const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow-green mb-6">
            <span className="text-white font-display font-bold text-5xl">B</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            Barokah<span className="gradient-text">Gen</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            The Ultimate AI Ramadan Poster Generator
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Create beautiful Islamic greeting posters in seconds. Choose from 18+ artistic styles, 
            transform your photos with traditional attire, and share the blessings this Ramadan.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={onGetStarted}
          className="btn-primary px-8 py-4 text-lg font-semibold flex items-center gap-3 mx-auto shadow-glow-green"
        >
          <LogIn className="w-5 h-5" />
          Get Started - It's Free!
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="glass-card p-6">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-lg font-display font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-400">
              Advanced AI generates creative greetings and transforms your photos beautifully.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-display font-semibold text-white mb-2">18+ Styles</h3>
            <p className="text-sm text-gray-400">
              From realistic to anime, cyberpunk to oil painting - choose your favorite style.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="text-4xl mb-3">💾</div>
            <h3 className="text-lg font-display font-semibold text-white mb-2">Auto-Save</h3>
            <p className="text-sm text-gray-400">
              All your creations are automatically saved and accessible anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main App with Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
