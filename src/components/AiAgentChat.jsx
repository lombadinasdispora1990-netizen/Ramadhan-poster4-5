import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Camera, ImagePlus, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { parseUserIntent, getQuickSuggestions, getModeLabel, getGreetingLabel } from '../utils/agentEngine';
import useAppStore from '../store/useAppStore';

const AiAgentChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! 👋 Saya BarokahGen Assistant. Ceritakan poster Ramadan seperti apa yang kamu inginkan, dan saya akan buatkan untukmu!\n\nContoh: "Buat poster aku di Mekkah" atau "Pakai jersey ONIC" 🎨',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const store = useAppStore();
  const {
    uploadedImage,
    uploadedImage2,
    generationMode,
    greetingType,
    userName,
    isLoading,
    isGenerated,
    credits,
    setGenerationMode,
    setGreetingType,
    setUserName,
    setUploadedImage,
    setImageName,
    clearError,
  } = store;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Get current app state for context
  const getAppState = useCallback(() => ({
    uploadedImage: !!uploadedImage,
    uploadedImage2: !!uploadedImage2,
    generationMode,
    greetingType,
    userName,
    isLoading,
    isGenerated,
    credits,
  }), [uploadedImage, uploadedImage2, generationMode, greetingType, userName, isLoading, isGenerated, credits]);

  const suggestions = getQuickSuggestions(getAppState());

  // Handle photo upload from chat
  const handleChatPhotoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ File harus berupa gambar (JPG, PNG, dll). Silakan pilih ulang.',
        timestamp: Date.now()
      }]);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ File terlalu besar! Maksimal 5MB ya.',
        timestamp: Date.now()
      }]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setImageName(file.name);
      clearError();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Foto **${file.name}** berhasil di-upload! 📸\n\nSekarang tinggal pilih mode dan generate. Mau pakai gaya apa?`,
        timestamp: Date.now(),
        isConfirmation: true,
        actions: ['scroll_to_modes']
      }]);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  }, [setUploadedImage, setImageName, clearError]);

  // Handle action execution
  const executeAction = useCallback((action) => {
    switch (action) {
      case 'generate':
        window.dispatchEvent(new CustomEvent('trigger-generate'));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🚀 Memulai proses generate poster... Tunggu sebentar ya!',
          timestamp: Date.now(),
          isConfirmation: true
        }]);
        break;

      case 'upload_photo':
        fileInputRef.current?.click();
        break;

      case 'scroll_to_modes': {
        const modesSection = document.querySelector('[class*="Artistic Curations"]')?.closest('div')
          || document.querySelector('#ai-modes-section');
        if (modesSection) {
          modesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      }

      case 'show_modes_list': {
        const modesList = [
          '🎨 **Mode yang tersedia:**\n',
          '• Realistic — Busana Islami realistis',
          '• 3D Cartoon — Animasi 3D modern',
          '• Anime — Gaya anime Jepang',
          '• Oil Painting — Lukisan minyak klasik',
          '• Watercolor — Cat air lembut',
          '• Free Fire — Karakter battle royale',
          '• Roblox — Avatar game Roblox',
          '• Sketch — Sketsa pensil',
          '• Cyberpunk — Futuristik sci-fi',
          '• Fantasy RPG — Karakter fantasi',
          '• Mobile Legend — Hero MOBA',
          '• China Drama — Hanfu/Wuxia elegan',
          '• Pohon Sawit — Kebun sawit',
          '• Kamen Rider — Pahlawan bertopeng',
          '• ONIC Esports — Jersey pro gamer',
          '• Di Mekkah — Depan Ka\'bah',
          '• Di Madinah — Masjid Nabawi',
          '• 🔒 Bareng CR7 (Premium)',
          '• 🔒 Kpop Slayers (Premium)',
          '• 🔒 Palestine (Premium)',
          '\nBilang aja mau pakai mode yang mana! 😊'
        ].join('\n');

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: modesList,
          timestamp: Date.now()
        }]);
        break;
      }

      default:
        break;
    }
  }, []);

  const handleSendMessage = useCallback(async (text) => {
    const userMessage = text || inputValue.trim();
    if (!userMessage || isThinking) return;

    setInputValue('');

    // Add user message
    const userMsg = { role: 'user', content: userMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    // Update conversation history for context
    const updatedHistory = [...conversationHistory, { role: 'user', content: userMessage }];
    setConversationHistory(updatedHistory);

    // Show thinking
    setIsThinking(true);

    try {
      const result = await parseUserIntent(userMessage, conversationHistory, getAppState());

      // Add assistant response
      const assistantMsg = {
        role: 'assistant',
        content: result.message,
        timestamp: Date.now(),
        params: result.ready ? result : null,
        actions: result.actions || []
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: result.message }
      ]);

      // If agent has extracted params, apply them
      if (result.mode) {
        setGenerationMode(result.mode);
      }
      if (result.greetingType) {
        setGreetingType(result.greetingType);
      }
      if (result.userName) {
        setUserName(result.userName);
      }

      // If ready, show confirmation
      if (result.ready) {
        setTimeout(() => {
          const hasPhoto = !!useAppStore.getState().uploadedImage;
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ Setting sudah saya terapkan!\n\n🎨 Mode: **${getModeLabel(result.mode || generationMode)}**\n📝 Gaya: **${getGreetingLabel(result.greetingType || greetingType)}**${result.userName ? `\n👤 Nama: **${result.userName}**` : ''}\n\n${hasPhoto ? 'Klik tombol **Generate** di bawah untuk mulai! 🚀' : '⚠️ Jangan lupa upload foto dulu ya!'}`,
            timestamp: Date.now(),
            isConfirmation: true,
            actions: hasPhoto ? ['generate'] : ['upload_photo']
          }]);
        }, 500);
      }

      // Execute non-UI actions automatically (like show_modes_list)
      if (result.actions?.includes('show_modes_list')) {
        setTimeout(() => executeAction('show_modes_list'), 300);
      }

    } catch (error) {
      console.error('Agent error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi. 🔄',
        timestamp: Date.now()
      }]);
    } finally {
      setIsThinking(false);
    }
  }, [inputValue, isThinking, conversationHistory, getAppState, setGenerationMode, setGreetingType, setUserName, generationMode, greetingType, executeAction]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  // Pulse animation for the chat button
  const [showPulse, setShowPulse] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Action button renderer
  const renderActionButtons = (actions = []) => {
    if (!actions.length) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {actions.includes('generate') && (
          <button
            onClick={() => executeAction('generate')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all active:scale-95"
          >
            <Zap className="w-3 h-3" />
            Generate Sekarang
          </button>
        )}
        {actions.includes('upload_photo') && (
          <button
            onClick={() => executeAction('upload_photo')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all active:scale-95"
          >
            <ImagePlus className="w-3 h-3" />
            Upload Foto
          </button>
        )}
        {actions.includes('scroll_to_modes') && (
          <button
            onClick={() => executeAction('scroll_to_modes')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all active:scale-95"
          >
            <ArrowRight className="w-3 h-3" />
            Lihat Mode
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Hidden file input for chat photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChatPhotoUpload}
        className="hidden"
      />

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/20 border border-emerald-500/30"
            id="ai-agent-chat-toggle"
          >
            <Bot className="w-6 h-6" />
            {/* Pulse ring */}
            {showPulse && (
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-emerald-400"
              />
            )}
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 flex flex-col"
            style={{ background: 'rgba(15, 23, 42, 0.97)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-emerald-950/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center border border-emerald-500/30">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">BarokahGen AI</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Smart Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors border border-white/[0.04]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* State Indicator Bar */}
            <div className="px-4 py-2 border-b border-white/[0.04] bg-white/[0.01] flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider overflow-x-auto scrollbar-none">
              <span className={`flex items-center gap-1 flex-shrink-0 ${uploadedImage ? 'text-emerald-400' : 'text-slate-600'}`}>
                {uploadedImage ? <CheckCircle2 className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                Foto
              </span>
              <span className="w-px h-3 bg-white/[0.06] flex-shrink-0" />
              <span className="text-amber-400 flex-shrink-0 truncate max-w-[80px]">
                🎨 {getModeLabel(generationMode)}
              </span>
              <span className="w-px h-3 bg-white/[0.06] flex-shrink-0" />
              <span className="text-blue-400 flex-shrink-0 truncate max-w-[60px]">
                📝 {getGreetingLabel(greetingType)}
              </span>
              {userName && (
                <>
                  <span className="w-px h-3 bg-white/[0.06] flex-shrink-0" />
                  <span className="text-purple-400 flex-shrink-0 truncate max-w-[60px]">
                    👤 {userName}
                  </span>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : msg.isConfirmation 
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20 rounded-tr-md'
                        : msg.isConfirmation
                          ? 'bg-amber-500/10 text-amber-100 border border-amber-500/20 rounded-tl-md'
                          : 'bg-white/[0.04] text-slate-300 border border-white/[0.06] rounded-tl-md'
                    }`}>
                      {msg.content.split('\n').map((line, j) => (
                        <span key={j}>
                          {line.split(/\*\*(.*?)\*\*/g).map((part, k) => 
                            k % 2 === 1 ? <strong key={k} className="text-white font-semibold">{part}</strong> : part
                          )}
                          {j < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>

                    {/* Inline Action Buttons */}
                    {msg.role === 'assistant' && msg.actions && renderActionButtons(msg.actions)}
                  </div>
                </motion.div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span className="text-[12px] text-slate-500 italic">Sedang berpikir...</span>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator from external generation */}
              {isLoading && !isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-amber-500/5 border border-amber-500/10 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span className="text-[12px] text-amber-400/70 italic">Generating poster...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && !isThinking && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.slice(0, 4).map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl border border-white/[0.06] px-3 py-2.5 focus-within:border-emerald-500/30 transition-colors">
                {/* Photo upload button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all flex-shrink-0"
                  title="Upload foto dari chat"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik perintah poster..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none min-w-0"
                  disabled={isThinking}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isThinking}
                  className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                    inputValue.trim() && !isThinking
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg'
                      : 'bg-white/[0.03] text-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAgentChat;
