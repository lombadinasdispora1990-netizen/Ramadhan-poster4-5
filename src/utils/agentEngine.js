import axios from 'axios';

/**
 * BarokahGen AI Agent Engine v2
 * Enhanced with:
 * 1. Smart Poster Creator — parses natural language to extract poster parameters
 * 2. Prompt Refinement — analyzes uploaded photos to optimize generation prompts
 * 3. Action System — returns structured actions (generate, upload_photo, etc.)
 * 4. State Context — provides real-time app state to the AI for smarter responses
 */

// All available modes for the agent to choose from
const AVAILABLE_MODES = [
  'text-only', 'realistic', '3d', 'anime', 'painting', 'watercolor',
  'freefire', 'roblox', 'sketch', 'cyberpunk', 'fantasy', 'ml',
  'chinadrama', 'oilpalm', 'kamenrider', 'onic', 'mekkah', 'madinah',
  'cr7', 'kpop', 'palestine'
];

const AVAILABLE_GREETINGS = [
  'formal', 'funny', 'casual', 'sahur', 'buka', 'lebaran'
];

// Valid actions the agent can request
const VALID_ACTIONS = [
  'generate',        // Trigger poster generation
  'upload_photo',    // Prompt user to upload a photo
  'scroll_to_modes', // Scroll to mode selector
  'show_modes_list', // Display all available modes
];

/**
 * Build state context string from current app state
 * @param {object} appState - Current Zustand store state
 * @returns {string} Context string for AI
 */
export const getStateContext = (appState = {}) => {
  const parts = [];
  parts.push(`foto_utama=${appState.uploadedImage ? 'sudah_upload' : 'belum'}`);
  parts.push(`foto_referensi=${appState.uploadedImage2 ? 'sudah_upload' : 'belum'}`);
  parts.push(`mode=${appState.generationMode || 'realistic'}`);
  parts.push(`ucapan=${appState.greetingType || 'formal'}`);
  parts.push(`nama=${appState.userName || '(kosong)'}`);
  parts.push(`sedang_loading=${appState.isLoading ? 'ya' : 'tidak'}`);
  parts.push(`sudah_generate=${appState.isGenerated ? 'ya' : 'belum'}`);
  parts.push(`kredit=${appState.credits ?? 0}`);
  return `[KONTEKS APP: ${parts.join(', ')}]`;
};

/**
 * System prompt for AI Agent v2 — instructs Qwen to parse user intent,
 * return structured JSON with actions
 */
const AGENT_SYSTEM_PROMPT = `Kamu adalah "BarokahGen Assistant", asisten AI cerdas untuk membuat poster Ramadan.

TUGAS UTAMA:
Pahami keinginan user dan kembalikan parameter poster dalam format JSON. Kamu juga bisa memicu aksi tertentu.

MODE YANG TERSEDIA:
- text-only (teks saja tanpa transformasi foto)
- realistic (busana Islami realistis)
- 3d (kartun 3D animasi)
- anime (gaya anime Jepang)
- painting (lukisan minyak klasik)
- watercolor (cat air)
- freefire (karakter Free Fire)
- roblox (avatar Roblox)
- sketch (sketsa pensil)
- cyberpunk (futuristik sci-fi)
- fantasy (karakter RPG fantasi)
- ml (hero Mobile Legends)
- chinadrama (drama Cina/Wuxia)
- oilpalm (kebun sawit)
- kamenrider (pahlawan Kamen Rider)
- onic (jersey ONIC Esports)
- mekkah (di depan Ka'bah, Mekkah)
- madinah (di depan Masjid Nabawi, Madinah)
- cr7 (bersama Cristiano Ronaldo) [PREMIUM]
- kpop (K-pop Demon Slayer) [PREMIUM]
- palestine (solidaritas Palestina) [PREMIUM]

GAYA UCAPAN:
- formal (puitis dan penuh doa)
- funny (lucu, slang Gen Z)
- casual (santai dan hangat)
- sahur (semangat sahur)
- buka (menunggu buka puasa)
- lebaran (Idul Fitri)

AKSI YANG BISA KAMU TRIGGER:
- "generate" → mulai proses generate poster (HANYA jika foto sudah diupload DAN mode sudah dipilih)
- "upload_photo" → minta user upload foto
- "scroll_to_modes" → scroll ke pemilihan mode
- "show_modes_list" → tampilkan daftar semua mode

ATURAN:
1. Jika user menyebutkan mode spesifik, set "mode" ke mode itu
2. Jika user menyebutkan gaya ucapan, set "greetingType"
3. Jika user menyebutkan nama, set "userName"
4. Jika info sudah cukup (minimal mode), set "ready": true
5. Jika info kurang, set "ready": false dan tanya lagi lewat "message"
6. SELALU respond dalam Bahasa Indonesia yang ramah dan ekspresif
7. SELALU kembalikan JSON valid
8. Perhatikan KONTEKS APP yang diberikan — gunakan untuk memberikan respons yang relevan
9. Jika user minta generate tapi BELUM upload foto, set actions=["upload_photo"] dan ingatkan
10. Jika user minta generate dan foto SUDAH ada, set actions=["generate"]
11. Jika user bilang "buat", "generate", "jalankan", "mulai", "bikin", "proses" → itu artinya minta generate
12. Jangan masukkan action "generate" jika foto belum di-upload

FORMAT RESPONS (JSON saja, tanpa markdown):
{
  "mode": "onic",
  "greetingType": "formal",
  "userName": "",
  "ready": true,
  "message": "Siap! Saya akan buatkan poster jersey ONIC untukmu 🎮⚡ Klik tombol Generate di bawah atau bilang 'generate' untuk mulai!",
  "actions": ["generate"]
}

Contoh jika belum upload foto:
{
  "mode": "mekkah",
  "greetingType": null,
  "userName": null,
  "ready": false,
  "message": "Mode Mekkah sudah saya set! 🕋 Tapi kamu belum upload foto nih. Upload dulu ya biar bisa diproses!",
  "actions": ["upload_photo"]
}

Contoh jika user belum jelas:
{
  "mode": null,
  "greetingType": null,
  "userName": null,
  "ready": false,
  "message": "Mau pakai gaya apa? Ada 21 pilihan mode, misalnya: Realistic, ONIC Esports, Di Mekkah, 3D Cartoon, Anime, dan lainnya 🎨",
  "actions": ["show_modes_list"]
}`;

/**
 * Parse user message via Qwen to extract poster parameters
 * @param {string} userMessage - raw user message
 * @param {Array} conversationHistory - previous messages for context
 * @param {object} appState - current app state for context
 * @returns {Promise<{mode, greetingType, userName, ready, message, actions}>}
 */
export const parseUserIntent = async (userMessage, conversationHistory = [], appState = {}) => {
  try {
    const apiKey = import.meta.env.VITE_ALIBABA_API_KEY;
    const stateContext = getStateContext(appState);

    // Build messages array with history for multi-turn context
    const messages = [
      { role: 'system', content: AGENT_SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: `${stateContext}\n\n${userMessage}` }
    ];

    const response = await axios.post(
      '/api/alibaba/compatible-mode/v1/chat/completions',
      {
        model: import.meta.env.VITE_MODEL_NAME || 'qwen-plus',
        messages,
        temperature: 0.3,
        max_tokens: 400
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      const rawContent = response.data.choices[0].message.content.trim();
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = rawContent;
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      
      // Try parsing JSON
      try {
        const parsed = JSON.parse(jsonStr);
        
        // Validate mode
        if (parsed.mode && !AVAILABLE_MODES.includes(parsed.mode)) {
          parsed.mode = null;
          parsed.ready = false;
          parsed.message += '\n\n(Mode tidak dikenali, silakan pilih dari daftar yang tersedia)';
        }
        
        // Validate greetingType
        if (parsed.greetingType && !AVAILABLE_GREETINGS.includes(parsed.greetingType)) {
          parsed.greetingType = 'formal';
        }

        // Validate and filter actions
        if (parsed.actions && Array.isArray(parsed.actions)) {
          parsed.actions = parsed.actions.filter(a => VALID_ACTIONS.includes(a));
        } else {
          parsed.actions = [];
        }

        // Safety check: don't allow generate if no photo
        if (parsed.actions.includes('generate') && !appState.uploadedImage) {
          parsed.actions = parsed.actions.filter(a => a !== 'generate');
          if (!parsed.actions.includes('upload_photo')) {
            parsed.actions.push('upload_photo');
          }
          parsed.message += '\n\n⚠️ Upload foto dulu ya sebelum generate!';
        }
        
        return parsed;
      } catch {
        // If JSON parse fails, return the text as a message
        return {
          mode: null,
          greetingType: null,
          userName: null,
          ready: false,
          message: rawContent,
          actions: []
        };
      }
    }

    return {
      mode: null,
      greetingType: null,
      userName: null,
      ready: false,
      message: 'Maaf, saya tidak mengerti. Bisa jelaskan poster seperti apa yang kamu inginkan? 🤔',
      actions: []
    };
  } catch (error) {
    console.error('Agent parse error:', error);
    return {
      mode: null,
      greetingType: null,
      userName: null,
      ready: false,
      message: 'Terjadi kesalahan koneksi. Silakan coba lagi. 🔄',
      actions: []
    };
  }
};

/**
 * Prompt Refinement Agent
 * Analyzes an uploaded photo and returns prompt adjustments
 * @param {string} imageUrl - base64 data URL or image URL
 * @returns {Promise<string>} - Additional prompt instructions
 */
export const analyzePhotoForPrompt = async (imageUrl) => {
  try {
    const apiKey = import.meta.env.VITE_ALIBABA_API_KEY;

    const response = await axios.post(
      '/api/alibaba/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'system',
            content: `You are an expert photo analyst for AI image generation. Analyze the photo and return a SHORT prompt adjustment string (max 50 words) to improve AI transformation quality.

Focus on:
1. Face position (close-up, medium, full body)
2. Face angle (front, 3/4, side profile)
3. Lighting quality (bright, dim, backlit)
4. Eye accessories (glasses, sunglasses)
5. Head covering (hat, hijab already worn)

Return ONLY the adjustment text, no explanation. Example outputs:
- "portrait framing, face is front-facing, good lighting, no accessories"
- "close-up shot, slight left angle, dim lighting add fill light, wearing glasses preserve eyewear"
- "full body shot needs tighter crop to medium shot, face is small enhance facial details, backlit add frontal lighting"`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              },
              {
                type: 'text',
                text: 'Analyze this photo for AI transformation. Return only the prompt adjustment string.'
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      const adjustment = response.data.choices[0].message.content.trim();
      console.log('🔍 [Prompt Refinement] Photo analysis:', adjustment);
      return adjustment;
    }

    return '';
  } catch (error) {
    console.warn('⚠️ [Prompt Refinement] Analysis failed, using defaults:', error.message);
    return '';
  }
};

/**
 * Get quick suggestion chips based on current app state
 * @param {object} appState - current app state
 * @returns {Array<string>} suggestion texts
 */
export const getQuickSuggestions = (appState = {}) => {
  const hasImage = !!appState.uploadedImage || appState === true; // backward compat

  if (!hasImage) {
    return [
      'Apa saja mode yang tersedia?',
      'Poster Ramadan realistis',
      'Buat poster di Mekkah',
      'Poster gaya anime',
    ];
  }

  // If image uploaded but not yet generated
  if (hasImage && !appState.isGenerated) {
    return [
      '🚀 Generate poster sekarang',
      'Pakai mode ONIC Esports',
      'Buat poster di Madinah',
      'Gaya 3D Cartoon',
      'Mode Mobile Legends',
      'Gaya lucu Gen Z',
    ];
  }

  // If already generated, suggest variations
  return [
    'Ganti mode lain',
    'Buat ulang dengan gaya baru',
    'Ubah ucapan jadi lucu',
    'Coba mode Mekkah',
  ];
};

/**
 * Get human-readable mode label
 * @param {string} mode 
 * @returns {string}
 */
export const getModeLabel = (mode) => {
  const labels = {
    'text-only': 'Text Only',
    'realistic': 'Realistic',
    '3d': '3D Cartoon',
    'anime': 'Anime',
    'painting': 'Oil Painting',
    'watercolor': 'Watercolor',
    'freefire': 'Free Fire',
    'roblox': 'Roblox',
    'sketch': 'Sketch',
    'cyberpunk': 'Cyberpunk',
    'fantasy': 'Fantasy RPG',
    'ml': 'Mobile Legend',
    'chinadrama': 'China Drama',
    'oilpalm': 'Pohon Sawit',
    'kamenrider': 'Kamen Rider',
    'onic': 'ONIC Esports',
    'mekkah': 'Di Mekkah',
    'madinah': 'Di Madinah',
    'cr7': 'Bareng CR7',
    'kpop': 'Kpop Slayers',
    'palestine': 'Palestine',
  };
  return labels[mode] || mode;
};

/**
 * Get human-readable greeting type label
 * @param {string} type 
 * @returns {string}
 */
export const getGreetingLabel = (type) => {
  const labels = {
    'formal': 'Formal',
    'funny': 'Lucu',
    'casual': 'Santai',
    'sahur': 'Sahur',
    'buka': 'Buka Puasa',
    'lebaran': 'Lebaran',
  };
  return labels[type] || type;
};

export default {
  parseUserIntent,
  analyzePhotoForPrompt,
  getQuickSuggestions,
  getStateContext,
  getModeLabel,
  getGreetingLabel,
};
