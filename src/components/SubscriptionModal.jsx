import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Zap, Shield, Crown, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';
import { createMayarPayment } from '../utils/api';

const SubscriptionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isPremium, credits } = useAppStore();
  const { user } = useAuth();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-subscription-modal', handleOpen);
    return () => window.removeEventListener('open-subscription-modal', handleOpen);
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const result = await createMayarPayment(user.id, user.email);
      if (result.success && result.url) {
        window.open(result.url, '_blank');
      } else {
        throw new Error(result.error || 'Gagal membuat link pembayaran');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header/Banner */}
          <div className="relative h-40 bg-gradient-to-br from-emerald-600 to-emerald-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] opacity-10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-64 h-64 border border-white/10 rounded-full"
            />
            <Crown className="w-16 h-16 text-white/20 absolute" />
            <div className="relative text-center">
              <div className="badge-gold mx-auto mb-3">Premium Access</div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">Barokah<span className="text-emerald-400">Gen</span> Pro</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">40 Credits / Month</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Generasi poster lebih banyak tanpa menunggu reset harian.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Exclusive AI Modes</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Buka akses ke mode premium: CR7, K-Pop, Palestine, dan gaya eksklusif lainnya.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Standard Support</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Prioritas pengolahan server untuk hasil lebih cepat.</p>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Monthly Plan</p>
                  <h3 className="text-3xl font-display font-bold text-white">Rp 100.000<span className="text-sm text-slate-500 font-normal">/bulan</span></h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Best Value</p>
                  <p className="text-xs text-slate-400">Cancel anytime</p>
                </div>
              </div>

              <button
                disabled={loading || isPremium}
                onClick={handleSubscribe}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest transition-all ${
                  isPremium 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/10'
                }`}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"
                  />
                ) : isPremium ? (
                  <>
                    <Check className="w-4 h-4" />
                    Already Premium
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-medium">
              Powered by Mayar.id Secure Payment
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;
