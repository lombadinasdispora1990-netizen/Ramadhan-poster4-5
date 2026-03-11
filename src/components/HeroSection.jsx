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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
          Experience Excellence
        </p>
        <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4 tracking-tight">
          Create Your <span className="italic font-serif text-emerald-500">Masterpiece</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Craft elegant Ramadan greeting posters powered by high-fidelity AI vision.
          Select your style and transform your story.
        </p>
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
          <div className="glass-card p-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-emerald-500/50" />
              Source Material
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
                  className={`upload-zone min-h-[260px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${isDragging ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.01] hover:bg-white/[0.03]'}`}
                >
                  <div className="w-12 h-12 mb-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-slate-300 text-sm font-medium mb-1 tracking-tight">
                    Select primary portrait
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    JPEG, PNG, WEBP • Max 5MB
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
          <div className="glass-card p-8 space-y-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-[1px] bg-emerald-500/50" />
              Poster Details
            </h3>

            {/* Name Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Sender Name <span className="text-slate-700 italic">(Optional)</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="The Ahmad Family, etc."
                className="input-premium py-4"
              />
            </div>

            {/* Greeting Type Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Atmosphere & Mood
              </label>
              <div className="grid grid-cols-2 gap-3">
                {greetingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGreetingType(option.value)}
                    className={`p-4 rounded-xl border text-left transition-all duration-500 ${greetingType === option.value
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg'
                      : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03]'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{option.icon}</span>
                      {greetingType === option.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <span className="font-bold text-xs block text-slate-200 tracking-tight">{option.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-relaxed">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Descriptive Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="lg:pl-8 flex flex-col justify-center"
        >
          <div className="relative p-10 rounded-2xl border border-white/[0.03] bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="mb-10">
              <Sparkles className="w-6 h-6 text-emerald-500 mb-6" />
              <h3 className="font-display font-medium text-2xl text-white mb-4">
                Atelier Standards
              </h3>
              <p className="text-sm text-slate-400 leading-loose">
                Our AI engine utilizes high-resolution latent diffusion to preserve your identity while 
                applying authentic Islamic aesthetics. Every transformation is curated for 
                dignity and cultural elegance.
              </p>
            </div>

            <div className="space-y-6 border-t border-white/[0.05] pt-10">
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Identity Preservation</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Advanced face-reference tracking ensures consistent resemblance.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Curation & Style</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Choose from 18+ bespoke modes from Realistic to Ethereal Painting.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
