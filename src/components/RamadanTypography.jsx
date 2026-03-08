import { motion } from 'framer-motion';
import { IslamicRosette } from './IslamicOrnaments';

/**
 * RamadanTypography Component
 * Beautiful typography elements for Ramadan poster
 */

// Main Ramadan Mubarak Header with Arabic calligraphy
export const RamadanHeader = ({ 
  arabicText = "رمضان مبارك",
  englishText = "Ramadan Mubarak",
  size = "large"
}) => {
  const sizeClasses = {
    large: "text-4xl md:text-5xl",
    medium: "text-2xl md:text-3xl",
    small: "text-xl md:text-2xl"
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Arabic Calligraphy */}
      <div className="flex items-center gap-3">
        <h1 className={`arabic-calligraphy ${sizeClasses[size]} text-center`}>
          {arabicText}
        </h1>
      </div>

      {/* English Translation */}
      <p className="ramadan-header text-lg md:text-xl tracking-wider uppercase">
        {englishText}
      </p>
    </motion.div>
  );
};

// Greeting Text with elegant styling
export const GreetingText = ({ 
  text, 
  userName,
  showQuotes = true 
}) => {
  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="greeting-text text-center px-4">
        {showQuotes && <span className="text-3xl text-gold-400 mr-2">"</span>}
        
        <span className="leading-relaxed">
          {text}
        </span>
        
        {showQuotes && <span className="text-3xl text-gold-400 ml-2">"</span>}

        {userName && (
          <p className="mt-4 text-base md:text-lg text-gray-300 font-normal">
            Dari: <span className="text-white font-semibold">{userName}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Decorative divider with Islamic pattern
export const DecorativeDivider = ({ style = "default" }) => {
  const styles = {
    default: (
      <div className="islamic-divider">
        <span>⟡</span>
        <span>✦</span>
        <span>⟡</span>
      </div>
    ),
    simple: (
      <div className="flex items-center justify-center gap-3 my-4">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-gold-400" />
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      </div>
    ),
    ornate: (
      <div className="flex items-center justify-center gap-4 my-4">
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-gold-400" />
        <IslamicRosette className="w-6 h-6" />
        <div className="w-16 h-[2px] bg-gradient-to-l from-transparent via-gold-400 to-gold-400" />
      </div>
    )
  };

  return styles[style] || styles.default;
};

// Footer with user name and hashtags
export const PosterFooter = ({ 
  userName, 
  hashtags = ["#RamadanMubarak", "#BarokahGen"],
  customFooter
}) => {
  return (
    <motion.div
      className="pt-4 border-t border-white/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {customFooter ? (
        <p className="text-sm md:text-base text-gray-300 text-center">
          {customFooter}
        </p>
      ) : (
        <>
          <p className="text-sm md:text-base text-gray-300 text-center">
            {userName ? `Dari: ${userName}` : 'Selamat Menunaikan Ibadah Puasa'}
          </p>
          
          <div className="flex justify-center gap-3 mt-2">
            {hashtags.map((tag, index) => (
              <p key={index} className="text-xs text-gray-400">
                {tag}
              </p>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

// Subtitle/Badge for special occasions
export const RamadanBadge = ({ 
  text, 
  variant = "sahur"
}) => {
  const variants = {
    sahur: "from-blue-500 to-cyan-400",
    buka: "from-orange-500 to-yellow-400",
    lebaran: "from-green-500 to-emerald-400",
    generic: "from-purple-500 to-pink-400"
  };

  return (
    <motion.div
      className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${variants[variant]} shadow-lg`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-white font-semibold text-sm md:text-base">
        {text}
      </p>
    </motion.div>
  );
};

// Composite typography component for full poster
export const RamadanPosterTypography = ({
  greetingText,
  userName,
  headerType = "ramadan"
}) => {
  return (
    <>
      {/* Top Header */}
      <RamadanHeader 
        arabicText="رمضان مبارك"
        englishText="Ramadan Mubarak"
        size="large"
      />

      {/* Divider */}
      <DecorativeDivider style="ornate" />

      {/* Main Greeting */}
      {greetingText && (
        <GreetingText 
          text={greetingText}
          userName={userName}
          showQuotes={true}
        />
      )}

      {/* Footer */}
      <PosterFooter 
        userName={userName}
        hashtags={["#RamadanMubarak", "#BarokahGen", "#IslamicArt"]}
      />
    </>
  );
};

export default {
  RamadanHeader,
  GreetingText,
  DecorativeDivider,
  PosterFooter,
  RamadanBadge,
  RamadanPosterTypography
};
