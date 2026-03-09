import { motion } from 'framer-motion';
import { Sparkles, LogOut, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../utils/supabase';

const Header = ({ onLogin }) => {
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

        {/* Right: User Menu or Login Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          {isAuthenticated ? (
            <>
              {/* User info */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-brand-400" />
                <span className="text-xs text-gray-300">{user.email}</span>
              </div>
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            /* Login button */
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
    </motion.header>
  );
};

export default Header;
