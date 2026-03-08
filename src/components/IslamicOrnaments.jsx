import { motion } from 'framer-motion';

/**
 * IslamicOrnaments Component
 * Decorative SVG elements for Ramadan poster design
 */

// Crescent Moon and Star SVG
export const CrescentStar = ({ className = "w-8 h-8", color = "#FFD700" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Crescent Moon */}
    <path
      d="M50 10C60 10 69 15 75 23C70 20 64 18 58 18C42 18 30 32 30 50C30 68 42 82 58 82C64 82 70 80 75 77C69 85 60 90 50 90C28 90 10 72 10 50C10 28 28 10 50 10Z"
      fill={color}
      opacity="0.9"
    />
    {/* Star */}
    <path
      d="M70 30L72 36L78 36L73 40L75 46L70 42L65 46L67 40L62 36L68 36L70 30Z"
      fill={color}
      opacity="0.8"
    />
  </svg>
);

// Islamic Geometric Pattern - Rosette
export const IslamicRosette = ({ className = "w-16 h-16", color = "#FFD700" }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Eight-pointed star pattern */}
    <g opacity="0.8">
      {[...Array(8)].map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="20"
          rx="8"
          ry="25"
          fill={color}
          transform={`rotate(${i * 45} 50 50)`}
          opacity="0.7"
        />
      ))}
    </g>
    {/* Center circle */}
    <circle cx="50" cy="50" r="12" fill={color} opacity="0.9" />
    {/* Inner details */}
    <circle cx="50" cy="50" r="6" fill="#1a1a2e" opacity="0.5" />
  </svg>
);

// Hanging Lantern SVG
export const Lantern = ({ className = "w-12 h-16", animated = true }) => (
  <motion.svg
    className={className}
    viewBox="0 0 60 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={animated ? { rotate: [-5, 5, -5] } : {}}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    style={{ transformOrigin: 'top center' }}
  >
    {/* Top hook */}
    <path
      d="M30 0V10M25 10H35"
      stroke="#FFD700"
      strokeWidth="2"
    />
    {/* Lantern body */}
    <rect x="15" y="15" width="30" height="50" rx="3" fill="#FDB931" opacity="0.8" />
    {/* Window pattern */}
    <rect x="20" y="25" width="20" height="30" rx="2" fill="#1a1a2e" opacity="0.6" />
    {/* Decorative lines */}
    <line x1="30" y1="15" x2="30" y2="65" stroke="#FFD700" strokeWidth="1" />
    <line x1="15" y1="40" x2="45" y2="40" stroke="#FFD700" strokeWidth="1" />
    {/* Bottom tassel */}
    <path d="M30 65V80M25 80H35" stroke="#FFD700" strokeWidth="2" />
    <circle cx="30" cy="85" r="3" fill="#FFD700" />
  </motion.svg>
);

// Corner Ornament
export const CornerOrnament = ({ 
  position = "top-left", 
  className = "w-20 h-20",
  color = "#FFD700"
}) => {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  };

  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      {/* Curved decorative element */}
      <path
        d="M10 90Q10 50 50 10Q50 50 90 90"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M20 85Q20 55 50 25Q50 55 80 85"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Dots decoration */}
      {[...Array(5)].map((_, i) => (
        <circle
          key={i}
          cx={20 + i * 15}
          cy={85 - i * 15}
          r="2"
          fill={color}
          opacity="0.8"
        />
      ))}
    </motion.svg>
  );
};

// Arabic Bismillah Calligraphy (stylized text)
export const Bismillah = ({ className = "text-3xl" }) => (
  <div className={className}>
    <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="200"
        y="60"
        textAnchor="middle"
        fontFamily="'Amiri', serif"
        fontSize="48"
        fill="#FFD700"
        opacity="0.9"
      >
        بسم الله
      </text>
    </svg>
  </div>
);

// Decorative Border Pattern
export const BorderPattern = ({ 
  position = "top", 
  className = "w-full h-8",
  color = "#FFD700"
}) => {
  const isVertical = position === 'left' || position === 'right';
  
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio={isVertical ? "none" : "xMidYMid meet"}
    >
      {/* Repeating geometric pattern */}
      {[...Array(10)].map((_, i) => (
        <g key={i}>
          <polygon
            points={(i * 20 + 10) + ',5 ' + (i * 20 + 15) + ',20 ' + (i * 20 + 10) + ',35 ' + (i * 20 + 5) + ',20'}
            fill={color}
            opacity="0.3"
          />
          <circle
            cx={i * 20 + 10}
            cy={20}
            r="3"
            fill={color}
            opacity="0.6"
          />
        </g>
      ))}
    </svg>
  );
};

// Main composite ornament for easy use
export const RamadanOrnaments = ({ showCorners = true, showLanterns = false }) => (
  <>
    {/* Corner ornaments */}
    {showCorners && (
      <>
        <CornerOrnament position="top-left" className="absolute top-2 left-2 w-16 h-16" />
        <CornerOrnament position="top-right" className="absolute top-2 right-2 w-16 h-16" />
        <CornerOrnament position="bottom-left" className="absolute bottom-2 left-2 w-16 h-16" />
        <CornerOrnament position="bottom-right" className="absolute bottom-2 right-2 w-16 h-16" />
      </>
    )}
    
    {/* Hanging lanterns (optional) */}
    {showLanterns && (
      <>
        <Lantern className="absolute top-0 left-1/4 w-10 h-14" />
        <Lantern className="absolute top-0 right-1/4 w-10 h-14" />
      </>
    )}
    
    {/* REMOVED: Central rosette - no center ornament */}
  </>
);

export default {
  IslamicRosette,
  Lantern,
  CornerOrnament,
  Bismillah,
  BorderPattern,
  RamadanOrnaments
};
