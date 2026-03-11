import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '081910088494';
  const message = encodeURIComponent('Halo BarokahGen, saya ingin request mode baru: ');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3"
      >
        {/* Tooltip */}
        <span className="absolute left-14 px-3 py-1.5 bg-brand-500 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-brand-400/20">
          Request Mode Baru ✨
        </span>

        {/* Button */}
        <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110">
          <MessageCircle className="w-6 h-6 fill-white" />
          
          {/* Pulsing effect */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
        </div>
      </a>
    </motion.div>
  );
};

export default WhatsAppButton;
