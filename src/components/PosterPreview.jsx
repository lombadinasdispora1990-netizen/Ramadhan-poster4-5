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

  // Helper to get proxied URL for remote images to avoid CORS in html2canvas
  const getSafeImageUrl = (src) => {
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
    return `/api/proxy-image?url=${encodeURIComponent(src)}`;
  };

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
      <div className="relative group p-1 bg-white/[0.02] rounded-[22px] border border-white/[0.05]">
        <div
          id="poster-preview"
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Background Image with slight scale on hover could be cool but keep it solid for now */}
          {displayImage ? (
            <div className="absolute inset-0">
              <img
                key={displayImage}
                src={getSafeImageUrl(displayImage)}
                alt="Poster background"
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#020617' }}
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pt-10" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest px-4">
                Composition Canvas
              </p>
            </div>
          )}

          {/* TOP SECTION: Header Band */}
          <div className={`absolute top-0 left-0 right-0 ${headerHeight} flex flex-col items-center justify-center px-6 z-20`}>
            <div className="relative z-10 mt-8">
              <RamadanHeader
                arabicText="رمضان مبارك"
                englishText="Ramadan Mubarak"
                size="medium"
              />
            </div>
          </div>

          {/* CENTER SECTION: Image Safe Zone */}
          <div className="absolute top-[18%] bottom-[20%] left-0 right-0 z-10" />

          {/* BOTTOM SECTION: Text Area */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] flex flex-col items-center justify-end pb-10 px-6 z-20">
            {isGenerated && generatedText ? (
              <GreetingText
                text={generatedText}
                userName={userName}
                showQuotes={false}
              />
            ) : (
              <p className="text-[11px] font-medium text-slate-400 italic text-center opacity-40">
                Awaiting algorithmic inspiration...
              </p>
            )}
          </div>
        </div>

        {/* Share Button Overlay or Below */}
        {isGenerated && (
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isDownloading}
              className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-2xl flex items-center gap-3 transition-colors hover:bg-emerald-50"
            >
              {isDownloading ? 'Processing...' : (
                <>
                  <Share2 className="w-3 h-3" />
                  Distribute Art
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Spacing for Share button when visible */}
      {isGenerated && <div className="h-16" />}

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
