import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, AlertCircle, CheckCircle2, Sparkles, Image, Type, Box, Paintbrush, Zap, Sword, Theater, Leaf, Shield, UserPlus, Flame, Heart } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { generateGreetingText, saveGenerationToDB, cleanGeneratedText } from '../utils/api';
import { getSystemPrompt } from '../utils/promptEngine';
import { transformWithMode } from '../utils/imageTransformAdvanced';
import { convertImageUrlToBase64 } from '../utils/imageToBase64';
import { useAuth } from '../context/AuthContext';

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
    setLoading,
    setError,
    setGeneratedText,
    setTransforming,
    setTransformedImage,
    resetPoster,
    setGenerationMode
  } = useAppStore();

  // Handle Generate Poster
  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Silakan upload foto terlebih dahulu');
      return;
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
    { value: 'cr7', label: 'Bareng CR7', icon: UserPlus, description: 'Greeting with Ronaldo', color: 'from-blue-500 to-indigo-600' },
    { value: 'kpop', label: 'Kpop Slayers', icon: Flame, description: 'Idol Demon Hunter style', color: 'from-purple-600 to-fuchsia-700' },
    { value: 'palestine', label: 'Palestine', icon: Heart, description: 'Free Palestine Solidarity', color: 'from-emerald-600 to-green-800' },
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

      {/* Generate Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.97 }}
          onClick={handleGenerate}
          disabled={isLoading || !uploadedImage}
          className={`
            relative px-10 py-4 rounded-xl font-display font-bold text-lg
            flex items-center gap-3 transition-all duration-300 overflow-hidden
            ${isLoading || !uploadedImage
              ? 'bg-gray-700/50 cursor-not-allowed opacity-40 border border-white/5'
              : 'btn-primary shadow-glow-green'
            }
          `}
        >
          {isLoading || isTransforming ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              <span className="text-base">
                {isTransforming ? `Transforming (${generationMode})...` : 'Generating...'}
              </span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate {generationMode === 'text-only' ? 'Text' : generationMode === 'realistic' ? 'Realistic' : generationMode.charAt(0).toUpperCase() + generationMode.slice(1)} Poster
            </>
          )}
        </motion.button>
      </div>

      {/* Helper Text */}
      {!uploadedImage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-sm mt-4"
        >
          Upload foto terlebih dahulu untuk membuat poster
        </motion.p>
      )}

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
          <div className="text-center mb-6">
            <h3 className="text-xl font-display font-semibold text-white mb-1.5">
              Pilih Mode Transformasi
            </h3>
            <p className="text-sm text-gray-500">
              {modeOptions.length} mode tersedia — pilih gaya visual favorit Anda
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {modeOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = generationMode === option.value;

              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGenerationMode(option.value)}
                  className={`mode-card ${isSelected ? 'selected' : ''}`}
                >
                  {/* Icon */}
                  <div
                    className={`icon-wrapper ${isSelected
                      ? `bg-gradient-to-br ${option.color}`
                      : 'bg-white/[0.04] border border-white/[0.06]'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>

                  {/* Text */}
                  <div>
                    <p className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-brand-200' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center shadow-glow-green"
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </motion.div>
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
