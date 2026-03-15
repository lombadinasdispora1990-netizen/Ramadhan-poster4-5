import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PosterPreview from './components/PosterPreview';
import ActionButtons from './components/ActionButtons';
import HistoryGallery from './components/history/HistoryGallery';
import AuthModal from './components/auth/AuthModal';
import AnimatedBackground from './components/AnimatedBackground';
import { AuthProvider } from './context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowUp, LogIn, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import WhatsAppButton from './components/WhatsAppButton';
import useAppStore from './store/useAppStore';
import { syncProfile } from './utils/supabase';
import SubscriptionModal from './components/SubscriptionModal';
import AiAgentChat from './components/AiAgentChat';


// Main App Content (with Auth)
function AppContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { setCredits, setIsPremium, setSubscriptionEndDate } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync profile data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await syncProfile(user.id);
          if (data && !error) {
            setCredits(data.credits);
            setIsPremium(data.is_premium);
            setSubscriptionEndDate(data.subscription_end_date);
          }
        } catch (err) {
          console.error('Error syncing profile:', err);
        }
      };
      
      fetchProfile();
    }
  }, [user, isAuthenticated, setCredits, setIsPremium, setSubscriptionEndDate]);

  return (
    <>
      {/* Animated Background Canvas */}
      <AnimatedBackground />
      
      {/* Mesh gradient background */}
      <div className="mesh-bg">
        <div className="mesh-orb" />
      </div>
      <div className="dot-grid" />

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
                <p className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Archive</p>
                <h2 className="text-3xl font-display font-medium text-white mb-3 tracking-tight">
                  Generation <span className="italic font-serif text-emerald-500">History</span>
                </h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto">
                  Your AI-generated Ramadan posters, saved and accessible anytime.
                </p>
              </div>
              <HistoryGallery user={user} />
            </div>
          </section>

        </div>
      ) : (
        // Landing page for non-authenticated users
        <LandingPage onGetStarted={() => setShowAuthModal(true)} />
      )}

      {/* Shared Footer */}
      <footer className="relative mt-24 pb-10 z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mb-10" />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-emerald-100 font-display font-bold text-sm">B</span>
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-white">Barokah<span className="text-emerald-500">Gen</span></p>
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">Premium AI Poster Atelier</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold text-center md:text-left">
              <span>Made by Jayaguna</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-slate-800" />
              <span>Powered by Alibaba Cloud AI & Mayar.id</span>
            </div>

            <p className="text-[10px] text-slate-700 font-medium">
              © 2026 BarokahGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xl hover:bg-emerald-800/80 transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
      {/* WhatsApp sticky button */}
      <WhatsAppButton />

      {/* Subscription Modal */}
      <SubscriptionModal />

      {/* AI Agent Chat (only when authenticated) */}
      {isAuthenticated && <AiAgentChat />}
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
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-10"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30 flex items-center justify-center shadow-2xl mb-8">
            <span className="text-emerald-100 font-display font-bold text-4xl">B</span>
          </div>
          <p className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-5">Premium AI Design Studio</p>
          <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-5 tracking-tight">
            Barokah<span className="italic font-serif text-emerald-500">Gen</span>
          </h1>
          <p className="text-lg text-slate-400 mb-2 font-light">
            The Ultimate Ramadan Poster Atelier
          </p>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            Create stunning Islamic greeting posters in seconds. Choose from 18+ bespoke artistic styles,
            transform your photos with traditional attire, and share the blessings.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onClick={onGetStarted}
          className="btn-primary px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3 mx-auto shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Begin Creating
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          <div className="glass-card p-8 text-center">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">AI-Powered</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Advanced latent diffusion generates creative greetings and transforms your photos beautifully.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">18+ Styles</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              From realistic to anime, cyberpunk to oil painting — choose your signature aesthetic.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="text-3xl mb-4">💾</div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Auto-Save</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All your creations are automatically archived and accessible from any device.
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
