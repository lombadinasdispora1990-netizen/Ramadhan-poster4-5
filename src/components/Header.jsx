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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-50 w-full"
    >
      {/* Refined Glass background */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.04]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30 flex items-center justify-center shadow-lg">
            <span className="text-emerald-100 font-display font-bold text-lg">B</span>
          </div>

          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white">
              Barokah<span className="text-emerald-500">Gen</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase hidden sm:block">
              Premium Poster Atelier
            </p>
          </div>
        </div>

        {/* Center: Subtle Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Advanced AI Engine</span>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">{user.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
