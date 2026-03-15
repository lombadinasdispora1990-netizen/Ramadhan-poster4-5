import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, AlertCircle, CheckCircle2, Sparkles, Image, Type, Box, Paintbrush, Zap, Sword, Theater, Leaf, Shield, UserPlus, Flame, Heart } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { generateGreetingText, saveGenerationToDB, cleanGeneratedText } from '../utils/api';
import { getSystemPrompt } from '../utils/promptEngine';
import { transformWithMode } from '../utils/imageTransformAdvanced';
import { convertImageUrlToBase64 } from '../utils/imageToBase64';
import { useAuth } from '../context/AuthContext';
import { consumeOneCredit } from '../utils/supabase';
import { Lock } from 'lucide-react';

const ActionButtons = () => {
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const {
    uploadedImage,
    uploadedImage2,
    userName,
    greetingType,
    isLoading,
    isTransforming,
    error,
    isGenerated,
    isTransformed,
    generationMode,
    transformedImage,
    generatedText,
    credits,
    isPremium,
    setLoading,
    setError,
    setGeneratedText,
    setTransforming,
    setTransformedImage,
    resetPoster,
    setGenerationMode,
    consumeCredit,
    setCredits
  } = useAppStore();

  // Ref to hold latest handleGenerate for event listener
  const handleGenerateRef = useRef(null);

  // Handle Generate Poster
  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Silakan upload foto terlebih dahulu');
      return;
    }

    if (credits <= 0) {
      setError('Kredit habis. Silakan tunggu hingga besok atau berlangganan untuk menambah kredit.');
      window.dispatchEvent(new CustomEvent('open-subscription-modal'));
      return;
    }

    // Deduct credit immediately on click
    console.log('💳 Consuming credit immediately...');
    if (user) {
      try {
        const { data: newCreditCount, error: creditError } = await consumeOneCredit(user.id);
        if (creditError) throw creditError;
        console.log('✅ Credit consumed in DB, new balance:', newCreditCount);
        setCredits(newCreditCount);
      } catch (ced) {
        console.error('⚠️ Failed to deduct credit in DB:', ced);
        setError('Gagal memproses kredit. Silakan coba lagi.');
        return; 
      }
    } else {
      consumeCredit();
    }

    console.log('🔍 Current state:', {
      uploadedImage: !!uploadedImage,
      isGenerated,
      isTransformed,
      hasTransformedImage: !!useAppStore.getState().transformedImage
    });

    console.log('🔄 Force reset for new generation...');
    setGeneratedText('');
    setTransformedImage(null);
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('✅ Reset complete, starting fresh generation...');

    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);

    try {
      let currentTransformedImage = null;
      if (generationMode !== 'text-only') {
        console.log('🎨 Step 1: Starting image transformation with mode:', generationMode);
        setTransforming(true);

        try {
          console.log('📷 Input image:', uploadedImage?.substring(0, 50) + '...');
          const transformResult = await transformWithMode(uploadedImage, generationMode, uploadedImage2);
          console.log('🔄 Transformation result:', transformResult);

          if (transformResult.success && transformResult.imageUrl) {
            console.log('✅ Image transformation complete!');
            console.log('🖼️ Transformed image URL:', transformResult.imageUrl.substring(0, 80) + '...');

            console.log('🔄 Converting to base64 before URL expires...');
            try {
              const base64Image = await convertImageUrlToBase64(transformResult.imageUrl);
              currentTransformedImage = base64Image;
              setTransformedImage(base64Image);
              console.log('✅ Image saved as base64 data URL — no more CORS issues!');
            } catch (conversionError) {
              console.warn('⚠️ Base64 conversion failed, using original URL:', conversionError.message);
              currentTransformedImage = transformResult.imageUrl;
              setTransformedImage(transformResult.imageUrl);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
          } else {
            throw new Error('No image URL in transformation result');
          }
        } catch (transformError) {
          console.warn('⚠️ Image transformation failed, using original image:', transformError);
          currentTransformedImage = uploadedImage;
          setTransformedImage(uploadedImage);
          setError(`Transformasi gagal: ${transformError.message}. Menggunakan foto asli.`);
        } finally {
          setTransforming(false);
        }
      } else {
        console.log('📝 Text-only mode: Using original image without transformation');
        currentTransformedImage = null;
        setTransformedImage(null);
      }

      console.log('📝 Step 2: Generating greeting text...');

      const rawGreetingText = await generateGreetingText(
        userName,
        greetingType,
        getSystemPrompt()
      );

      const currentCleanedText = cleanGeneratedText(rawGreetingText);
      console.log('📝 Raw AI text:', rawGreetingText);
      console.log('✨ Cleaned text:', currentCleanedText);

      setGeneratedText(currentCleanedText);

      // Save to database if user is authenticated
      console.log('🔍 Checking authentication state...');
      console.log('User object:', user);
      console.log('Is authenticated:', !!user);

      if (user) {
        console.log('💾 Saving generation to database...');
        console.log('Generation data:', {
          originalImage: uploadedImage ? '✅ Present' : '❌ Missing',
          transformedImage: currentTransformedImage ? '✅ Present' : '❌ Missing',
          userName,
          greetingType,
          mode: generationMode,
          text: currentCleanedText
        });

        try {
          // The transformed image is already converted to base64 earlier (currentTransformedImage)
          // to prevent CORS and expiration issues. We can use it directly.
          const posterBase64 = currentTransformedImage;

          console.log('📸 Preparation for database:', {
            hasBase64: !!posterBase64,
            size: posterBase64?.length || 0
          });

          const saveResult = await saveGenerationToDB({
            originalImage: uploadedImage,
            transformedImage: currentTransformedImage || uploadedImage,
            uploadedImage2: uploadedImage2,
            userName: userName,
            greetingType: greetingType,
            mode: generationMode,
            text: currentCleanedText,
            posterBase64: posterBase64
          });

          console.log('✅ Generation save result:', saveResult);
          if (saveResult.success) {
            console.log('✅ Generation saved successfully!');
            
            // Trigger history refresh
            window.dispatchEvent(new CustomEvent('refresh-history'));
            console.log('🔄 History refresh event dispatched');
          } else {
            console.error('⚠️ Save failed:', saveResult.error);
          }
        } catch (saveError) {
          console.error('⚠️ Failed to save generation:', saveError.message);
          console.error('Stack trace:', saveError.stack);
          // Don't show error to user, just log it
        }
      } else {
        console.log('ℹ️ User not logged in, skipping database save');
      }
    } catch (err) {
      console.error('Generation error:', err);

      let errorMessage = 'Gagal generate poster. ';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage += 'API key tidak valid. Periksa konfigurasi .env file Anda.';
        } else if (err.response.status === 429) {
          errorMessage += 'Quota exceeded. Tunggu beberapa saat dan coba lagi.';
        } else if (err.response.status === 500) {
          errorMessage += 'Server error. Coba lagi nanti.';
        } else {
          errorMessage += `Error ${err.response.status}: ${err.message}`;
        }
      } else if (err.request) {
        errorMessage += 'Tidak ada respon dari server. Periksa koneksi internet Anda.';
      } else {
        errorMessage += err.message || 'Terjadi kesalahan yang tidak diketahui.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Keep ref updated for event listener
  handleGenerateRef.current = handleGenerate;

  // Listen for trigger-generate event from AI Agent chat
  useEffect(() => {
    const handler = () => {
      if (handleGenerateRef.current) {
        handleGenerateRef.current();
      }
    };
    window.addEventListener('trigger-generate', handler);
    return () => window.removeEventListener('trigger-generate', handler);
  }, []);

  // Generation mode options
  const modeOptions = [
    { value: 'text-only', label: 'Text Only', icon: Type, description: 'Generate text without transforming photo', color: 'from-blue-500 to-cyan-500' },
    { value: 'realistic', label: 'Realistic', icon: Image, description: 'Transform to Islamic attire (photorealistic)', color: 'from-green-500 to-emerald-500' },
    { value: '3d', label: '3D Cartoon', icon: Box, description: 'Modern animation studio style', color: 'from-purple-500 to-pink-500' },
    { value: 'anime', label: 'Anime', icon: Sparkles, description: 'Japanese animation art style', color: 'from-orange-500 to-red-500' },
    { value: 'painting', label: 'Oil Painting', icon: Paintbrush, description: 'Classical oil painting style', color: 'from-amber-500 to-yellow-500' },
    { value: 'watercolor', label: 'Watercolor', icon: Paintbrush, description: 'Soft watercolor painting aesthetic', color: 'from-teal-500 to-emerald-500' },
    { value: 'freefire', label: 'Free Fire', icon: Zap, description: 'Battle royale hero style', color: 'from-orange-500 to-red-600' },
    { value: 'roblox', label: 'Roblox', icon: Box, description: 'Blocky avatar game style', color: 'from-red-500 to-pink-500' },
    { value: 'sketch', label: 'Sketch', icon: Paintbrush, description: 'Hand-drawn pencil sketch', color: 'from-gray-500 to-slate-500' },
    { value: 'cyberpunk', label: 'Cyberpunk', icon: Zap, description: 'Futuristic sci-fi style', color: 'from-indigo-500 to-violet-500' },
    { value: 'fantasy', label: 'Fantasy RPG', icon: Sparkles, description: 'Epic fantasy character portrait', color: 'from-fuchsia-500 to-purple-600' },
    { value: 'ml', label: 'Mobile Legend', icon: Sword, description: 'Epic MOBA hero style', color: 'from-blue-600 to-indigo-700' },
    { value: 'chinadrama', label: 'China Drama', icon: Theater, description: 'Elegant Hanfu/Wuxia style', color: 'from-red-600 to-rose-700' },
    { value: 'oilpalm', label: 'Pohon Sawit', icon: Leaf, description: 'Lush plantation aesthetic', color: 'from-green-600 to-lime-700' },
    { value: 'kamenrider', label: 'Kamen Rider', icon: Shield, description: 'High-tech armored hero', color: 'from-gray-700 to-slate-900' },
    { value: 'onic', label: 'ONIC Esports', icon: Zap, description: 'Pro gamer jersey style', color: 'from-orange-500 to-amber-600' },
    { value: 'mekkah', label: 'Di Mekkah', icon: Heart, description: 'Umrah di Masjidil Haram', color: 'from-amber-500 to-yellow-600' },
    { value: 'madinah', label: 'Di Madinah', icon: Heart, description: 'Ziarah ke Masjid Nabawi', color: 'from-green-500 to-teal-600' },
    { value: 'cr7', label: 'Bareng CR7', icon: UserPlus, description: 'Greeting with Ronaldo', color: 'from-blue-500 to-indigo-600', premium: true },
    { value: 'kpop', label: 'Kpop Slayers', icon: Flame, description: 'Idol Demon Hunter style', color: 'from-purple-600 to-fuchsia-700', premium: true },
    { value: 'palestine', label: 'Palestine', icon: Heart, description: 'Free Palestine Solidarity', color: 'from-emerald-600 to-green-800', premium: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6"
    >
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5 p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl flex items-start gap-3 backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-red-300 text-sm">{error}</p>
              {error.includes('API key') && (
                <p className="text-red-400/70 text-xs mt-2">
                  💡 Tip: Buat file .env di root folder dan tambahkan:<br />
                  <code className="bg-black/30 px-2 py-1 rounded mt-1 inline-block text-[11px]">
                    VITE_ALIBABA_API_KEY=your_api_key_here
                  </code>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {isGenerated && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-5 p-4 bg-brand-500/[0.06] border border-brand-500/20 rounded-xl flex items-center gap-3 backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-brand-300 text-sm font-medium">Poster berhasil dibuat! Download untuk menyimpan.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button Container */}
      <div className="flex flex-col items-center">
        <motion.button
          whileHover={{ y: isLoading ? 0 : -2 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          onClick={handleGenerate}
          disabled={isLoading || !uploadedImage}
          className={`
            relative px-12 py-5 rounded-xl font-bold text-sm tracking-[0.2em] uppercase
            flex items-center gap-4 transition-all duration-500 overflow-hidden
            ${isLoading || !uploadedImage
              ? 'bg-slate-900 text-slate-700 cursor-not-allowed opacity-50 border border-white/5'
              : 'btn-primary shadow-2xl'
            }
          `}
        >
          {isLoading || isTransforming ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border border-emerald-500/30 border-t-emerald-400 rounded-full"
              />
              <span className="font-medium lowercase tracking-normal">
                {isTransforming ? `curating ${generationMode}...` : 'composing...'}
              </span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-emerald-400" />
              Generate Artifact
            </>
          )}
        </motion.button>
        
        {!uploadedImage && (
          <p className="text-slate-600 text-[10px] uppercase tracking-widest mt-6 font-bold">
            Awaiting Source Portrait
          </p>
        )}
      </div>

      {/* Info Badges - Inline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <div className="badge-brand">
          <span className="text-sm">🤖</span>
          <span>Qwen Plus Model</span>
        </div>
        <div className="badge">
          <span className="text-sm">⚡</span>
          <span>Hitungan detik</span>
        </div>
        <div className="badge-gold">
          <span className="text-sm">📱</span>
          <span>Instagram 4:5</span>
        </div>
      </motion.div>

      {/* Generation Mode Selection */}
      {uploadedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-emerald-500/50" />
                Artistic Curations
              </h3>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Select a visual mode to determine the core aesthetic of your final piece.
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {modeOptions.length} Signature Styles
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {modeOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = generationMode === option.value;
              const isLocked = option.premium && !isPremium;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    if (isLocked) {
                      window.dispatchEvent(new CustomEvent('open-subscription-modal'));
                      return;
                    }
                    setGenerationMode(option.value);
                  }}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-500 group ${isSelected
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/20'
                    : isLocked 
                      ? 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'
                      : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03]'
                    }`}
                >
                  {/* Lock icon for premium */}
                  {isLocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-amber-500/50" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/[0.03] text-slate-500 group-hover:text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text */}
                  <span className={`text-[11px] font-bold uppercase tracking-widest text-center ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {option.label}
                  </span>

                  {/* Selection dot */}
                  {isSelected && (
                    <motion.div
                      layoutId="selected-dot"
                      className="absolute bottom-2 w-1 h-1 rounded-full bg-emerald-500"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActionButtons;
