import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, Settings, Image, FileImage, MonitorSmartphone, Share2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import html2canvas from 'html2canvas';
import { RamadanHeader, GreetingText, PosterFooter, DecorativeDivider } from './RamadanTypography';
import { CornerOrnament } from './IslamicOrnaments';

const PosterPreview = () => {
  const { uploadedImage, transformedImage, generatedText, userName, greetingType, isGenerated, isTransformed, generationMode } = useAppStore();
  const { exportQuality, exportFormat, setExportQuality, setExportFormat } = useAppStore();
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Use transformed image if available, otherwise use original
  const displayImage = transformedImage || uploadedImage;

  // Slightly smaller ornaments for Fantasy mode
  const isFantasyMode = generationMode === 'fantasy';
  const ornamentSize = isFantasyMode ? 'w-10 h-10 md:w-12 md:h-12' : 'w-12 h-12 md:w-16 md:h-16';

  // Standard header height for all modes
  const headerHeight = 'h-[18%]';

  // Capture poster as canvas
  const capturePoster = async () => {
    const posterElement = document.getElementById('poster-preview');
    if (!posterElement) throw new Error('Poster element not found');

    const img = posterElement.querySelector('img');
    if (img) {
      await new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = () => {
            console.warn('⚠️ Image failed to load, proceeding anyway');
            resolve();
          };
          setTimeout(() => {
            console.warn('⚠️ Image load timeout, proceeding anyway');
            resolve();
          }, 5000);
        }
      });
      console.log('✅ Image ready for capture');
      console.log('   Image src type:', img.src.startsWith('data:') ? 'base64' : img.src.substring(0, 40) + '...');
    }

    console.log('📤 Capturing poster with html2canvas...');

    const canvas = await html2canvas(posterElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#0f172a',
      logging: true,
      imageTimeout: 15000,
      removeContainer: true,
    });

    console.log('📐 Canvas created:', canvas.width, 'x', canvas.height);

    const blob = await new Promise((resolve, reject) => {
      try {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('canvas.toBlob returned null'));
        }, 'image/png');
      } catch (err) {
        console.error('❌ canvas.toBlob threw:', err.name, err.message);
        reject(err);
      }
    });

    console.log('✅ Poster captured, size:', blob.size, 'bytes');
    return blob;
  };

  // Download poster as PNG
  const downloadPoster = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ramadan-poster-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ Poster downloaded');
  };

  // Share poster using Web Share API
  const handleShare = async () => {
    setIsDownloading(true);

    try {
      const blob = await capturePoster();

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'ramadan-poster.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Ramadan Mubarak Poster',
              text: 'Lihat poster Ramadan-ku! Buat punyamu juga di BarokahGen.',
              files: [file]
            });
            console.log('✅ Poster shared successfully!');
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') {
              console.warn('⚠️ Share failed, downloading instead:', shareErr.message);
              downloadPoster(blob);
            }
          }
        } else {
          console.log('⚠️ Cannot share files, downloading instead');
          downloadPoster(blob);
        }
      } else {
        console.log('⚠️ Web Share API not supported, downloading instead');
        downloadPoster(blob);
      }
    } catch (error) {
      console.error('❌ Capture/share error:', error.name, error.message);

      try {
        const blob = await capturePoster();
        downloadPoster(blob);
      } catch (finalError) {
        console.error('❌ Final fallback failed:', finalError.name, finalError.message);
        alert('Gagal membagikan poster.\n\nError: ' + finalError.message);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (!uploadedImage) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Poster Frame - 4:5 Aspect Ratio */}
      <div className="relative">
        <div
          id="poster-preview"
          className="poster-frame relative w-full aspect-[4/5] rounded-2xl overflow-hidden ornate-border"
          style={{
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
          }}
        >

          {/* Background Image */}
          {displayImage ? (
            <>
              <img
                key={displayImage}
                src={displayImage}
                alt="Poster background"
                className="absolute inset-0 w-full h-full object-cover vignette-effect"
                style={{ backgroundColor: '#1a1a2e' }}
                onLoad={() => {
                  console.log('✅ Background image loaded successfully');
                  setIsImageLoaded(true);
                }}
                onError={(e) => {
                  console.error('❌ Failed to load background image:', e);
                  setIsImageLoaded(false);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-gray-400 text-center px-4">
                📷 Upload foto Anda untuk memulai...
              </p>
            </div>
          )}

          {/* TOP SECTION: Header Band */}
          <div className={`absolute top-0 left-0 right-0 ${headerHeight} top-banner-gradient flex flex-col items-center justify-center px-4 z-20`}>
            <div className="absolute inset-0 islamic-pattern opacity-30" />

            <CornerOrnament position="top-left" className={`absolute top-1 left-1 ${ornamentSize}`} />
            <CornerOrnament position="top-right" className={`absolute top-1 right-1 ${ornamentSize}`} />

            <CornerOrnament position="top-left" className="absolute top-3 left-8 w-8 h-8 md:w-10 md:h-10 ramadan-element opacity-60" />
            <CornerOrnament position="top-right" className="absolute top-3 right-8 w-8 h-8 md:w-10 md:h-10 ramadan-element opacity-60" />

            <div className="absolute top-2 left-16 w-4 h-4 md:w-5 md:h-5">
              <svg viewBox="0 0 100 100" fill="#FFD700" opacity="0.7" className="ramadan-element">
                <path d="M50 0L61 35L98 35L68 57L79 91L50 70L21 91L32 57L2 35L39 35Z" />
              </svg>
            </div>
            <div className="absolute top-2 right-16 w-4 h-4 md:w-5 md:h-5">
              <svg viewBox="0 0 100 100" fill="#FFD700" opacity="0.7" className="ramadan-element">
                <path d="M50 0L61 35L98 35L68 57L79 91L50 70L21 91L32 57L2 35L39 35Z" />
              </svg>
            </div>

            <div className="relative z-10 mt-6">
              <RamadanHeader
                arabicText="رمضان مبارك"
                englishText="Ramadan Mubarak"
                size="medium"
              />
            </div>
          </div>

          {/* CENTER SECTION: Image Safe Zone */}
          <div className="absolute top-[18%] bottom-[20%] left-0 right-0 z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none" />
          </div>

          {/* BOTTOM SECTION: Text Area */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bottom-banner-gradient flex flex-col items-center justify-end pb-6 px-4 z-20">
            <DecorativeDivider style="simple" />

            {isGenerated && generatedText ? (
              <GreetingText
                text={generatedText}
                userName={userName}
                showQuotes={true}
              />
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-base md:text-lg text-gray-300 italic text-center px-4"
              >
                Preview teks akan muncul di sini setelah generate...
              </motion.p>
            )}

            {!isGenerated && (
              <PosterFooter
                userName={userName}
                hashtags={["#RamadanMubarak", "#BarokahGen"]}
              />
            )}
          </div>

          {/* Decorative Border Glow */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none z-30" />
        </div>

        {/* Share Button */}
        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              disabled={isDownloading}
              className="w-full py-3.5 btn-primary rounded-xl font-display font-semibold flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Share Poster
                </>
              )}
            </motion.button>

            <p className="text-[11px] text-gray-500 text-center">
              📱 Bagikan poster ke WhatsApp, Instagram, atau media sosial lainnya
            </p>
          </motion.div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-3 mt-6">
        {/* Transformation Badge */}
        {isTransformed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/[0.06] to-blue-500/[0.06] border border-purple-500/20"
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm text-purple-200 font-medium">
                AI Islamic Attire Transformation Applied
              </p>
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-1">
              Foto telah ditransformasi dengan busana Islami menggunakan AI
            </p>
          </motion.div>
        )}

        {/* Design Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 py-3"
        >
          <div className="badge">
            <span className="text-sm">🎨</span>
            <span>Enhanced Design</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <div className="badge">
            <span className="text-sm">📐</span>
            <span>4:5 Instagram</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PosterPreview;
