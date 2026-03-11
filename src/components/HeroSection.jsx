import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, User, Type, Sparkles, Camera, CheckCircle2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const greetingOptions = [
  { value: 'formal', label: 'Formal/Religius', icon: '🕌', description: 'Puitis dan penuh doa' },
  { value: 'funny', label: 'Lucu/Ngakak', icon: '😂', description: 'Slang Gen Z' },
  { value: 'casual', label: 'Santai/Hangat', icon: '☕', description: 'Akrab dan hangat' },
  { value: 'sahur', label: 'Sahur', icon: '🌙', description: 'Semangat bangun sahur' },
  { value: 'buka', label: 'Buka Puasa', icon: '🍽️', description: 'Menunggu berbuka' },
  { value: 'lebaran', label: 'Lebaran', icon: '🎉', description: 'Idul Fitri' },
];

const HeroSection = () => {
  const {
    uploadedImage,
    imageName,
    uploadedImage2,
    imageName2,
    userName,
    greetingType,
    isTransformed,
    setUploadedImage,
    setImageName,
    setUploadedImage2,
    setImageName2,
    setUserName,
    setGreetingType,
    clearError
  } = useAppStore();

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle file upload
  const handleFileUpload = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal ukuran file adalah 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setImageName(file.name);
        clearError();
      };
      reader.readAsDataURL(file);
    } else {
      alert('Silakan upload file gambar (JPG, PNG, dll)');
    }
  }, [setUploadedImage, setImageName, clearError]);

  const handleFileUpload2 = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal ukuran file adalah 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage2(e.target.result);
        setImageName2(file.name);
        clearError();
      };
      reader.readAsDataURL(file);
    } else {
      alert('Silakan upload file gambar (JPG, PNG, dll)');
    }
  }, [setUploadedImage2, setImageName2, clearError]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      // Reset input value to allow re-uploading same file
      e.target.value = '';
    }
  }, [handleFileUpload]);

  const handleFileInput2 = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload2(file);
      // Reset input value to allow re-uploading same file
      e.target.value = '';
    }
  }, [handleFileUpload2]);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setImageName('');
  }, [setUploadedImage, setImageName]);

  const handleRemoveImage2 = useCallback(() => {
    setUploadedImage2(null);
    setImageName2('');
  }, [setUploadedImage2, setImageName2]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
          Create Your <span className="gradient-text">Poster</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
          Upload foto, pilih gaya, dan biarkan AI membuat poster Ramadan yang memukau untuk Anda
        </p>
        {/* Animated underline */}
        <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-brand-400 to-gold-400 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload & Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Upload Area */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
                <Camera className="w-4 h-4 text-brand-400" />
              </div>
              Pilih Foto Anda
            </h3>

            {/* Hidden Inputs moved outside clickable areas */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              ref={fileInputRef2}
              type="file"
              accept="image/*"
              onChange={handleFileInput2}
              className="hidden"
            />

            <div className="space-y-6">
              {!uploadedImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={(e) => {
                    // Prevent bubbling issues
                    if (e.target === e.currentTarget || e.currentTarget.contains(e.target)) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`upload-zone min-h-[220px] flex flex-col items-center justify-center cursor-pointer ${isDragging ? 'dragging' : ''}`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Upload className="w-8 h-8 text-brand-400" />
                    </div>
                  </motion.div>
                  <p className="text-gray-200 font-medium mb-2 text-center px-4">
                    Klik atau tarik foto utama ke sini
                  </p>
                  <p className="text-xs text-gray-500">
                    Maksimal 5MB (JPG, PNG, WebP)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Primary Image Preview */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden group border border-white/10"
                  >
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-brand-500/90 hover:bg-brand-500 rounded-xl transition-colors shadow-lg"
                        title="Ganti foto"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        className="p-3 bg-red-500/90 hover:bg-red-500 rounded-xl transition-colors shadow-lg"
                        title="Hapus foto"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-sm text-white font-medium truncate flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-400" />
                        {imageName}
                      </p>
                    </div>
                  </motion.div>

                  {/* Optional Face Reference - Subtle & Expandable */}
                  <div className="pt-2">
                    {!uploadedImage2 && !showAdvanced ? (
                      <button 
                        onClick={() => setShowAdvanced(true)}
                        className="text-[11px] text-gray-500 hover:text-brand-400 flex items-center gap-1.5 transition-colors mx-auto"
                      >
                        <Sparkles className="w-3 h-3" />
                        Ingin hasil lebih mirip? (Opsi Lanjutan)
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 border-t border-white/5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-400" />
                            Foto Referensi Wajah
                          </h4>
                          <button 
                            onClick={() => uploadedImage2 ? handleRemoveImage2() : fileInputRef2.current?.click()}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              uploadedImage2 
                                ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                                : 'text-brand-400 bg-brand-500/10 hover:bg-brand-500/20'
                            }`}
                          >
                            {uploadedImage2 ? 'Hapus' : 'Tambah'}
                          </button>
                        </div>
                        
                        {!uploadedImage2 ? (
                          <p className="text-[11px] text-gray-500 mb-2 italic px-1">
                            💡 Tambah foto wajah close-up agar hasil AI lebih akurat.
                          </p>
                        ) : (
                          <div className="relative rounded-lg overflow-hidden group border border-purple-500/20 max-w-[120px]">
                            <img
                              src={uploadedImage2}
                              alt="Face Reference"
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-lg font-display font-semibold flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 flex items-center justify-center">
                <Type className="w-4 h-4 text-gold-400" />
              </div>
              Detail Poster
            </h3>

            {/* AI Transform Toggle */}
            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-gradient-to-r from-purple-500/[0.06] to-blue-500/[0.06] border border-purple-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-purple-300 text-sm mb-1">
                      Transformasi Busana Islami
                    </h4>
                    <p className="text-[11px] text-gray-400 mb-2 leading-relaxed">
                      AI akan mengubah foto Anda dengan busana Islami (pria: koko + kupiah, wanita: gamis + jilbab)
                    </p>
                    {isTransformed ? (
                      <div className="flex items-center gap-2 text-brand-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Foto sudah ditransformasi!</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-yellow-400/80">
                        💡 Fitur ini akan tersedia setelah generate poster pertama
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Nama Pengirim (Opsional)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: Ahmad, Keluarga Besar, dll"
                className="input-premium"
              />
            </div>

            {/* Greeting Type Selection */}
            <div>
              <label className="block text-xs text-gray-400 mb-3 font-medium flex items-center gap-2">
                <Type className="w-3.5 h-3.5" />
                Jenis Ucapan
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {greetingOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setGreetingType(option.value)}
                    className={`p-3 rounded-xl border transition-all duration-300 text-left ${greetingType === option.value
                      ? 'bg-brand-500/10 border-brand-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                      }`}
                  >
                    <span className="text-xl mb-1 block">{option.icon}</span>
                    <span className="font-medium text-sm block text-white">{option.label}</span>
                    <span className="text-[11px] text-gray-500">{option.description}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Decorative / Preview Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center"
        >
          <div className="relative w-full max-w-sm">
            {/* Decorative background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-72 h-72 bg-gradient-to-br from-brand-500/20 to-gold-500/20 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative text-center py-16">
              {/* Floating AI badge */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-brand-400" />
              </motion.div>

              <h3 className="font-display font-semibold text-lg text-white mb-2">
                Poster Preview
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                Upload foto dan pilih jenis ucapan, lalu klik Generate untuk melihat hasil AI ✨
              </p>

              {/* Decorative dots */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-1.5 h-1.5 rounded-full bg-brand-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
