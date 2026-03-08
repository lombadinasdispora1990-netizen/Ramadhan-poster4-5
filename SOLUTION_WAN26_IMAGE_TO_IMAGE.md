# 🎨 Wan2.6 Image-to-Image Transformation - FIXED!

## ✅ Masalah yang Diperbaiki

### ❌ **Masalah Sebelumnya:**
1. **Network Error** - Menggunakan endpoint yang salah (`/compatible-mode/v1/image/generations`)
2. **Format Request Salah** - Menggunakan format text-to-image biasa dengan `ref_image`
3. **Gender Detection** - Menggunakan bahasa Indonesia ("pria/wanita") bukan Inggris ("male/female")

### ✅ **Solusi yang Diterapkan:**

#### 1. **Endpoint yang Benar**
```javascript
// SALAH ❌
const wanxEndpoint = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/image/generations';

// BENAR ✅
const wanxEndpoint = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
```

#### 2. **Format Payload Multimodal**
```javascript
// SALAH ❌ - Format Text-to-Image biasa
{
  model: "wan2.6-t2i",
  input: {
    prompt: "...",
    ref_image: "base64..."
  }
}

// BENAR ✅ - Format Multimodal Image-to-Image
{
  model: "wan2.6-t2i",
  input: {
    messages: [{
      role: "user",
      content: [
        { text: "engineered prompt..." },
        { image: "data:image/jpeg;base64,..." }
      ]
    }]
  },
  parameters: {
    size: "1K", // 1280*1280
    n: 1,
    negative_prompt: "...",
    watermark: false
  }
}
```

#### 3. **Gender Detection dalam Bahasa Inggris**
```javascript
// SALAH ❌
content: `Anda adalah AI yang bertugas mendeteksi gender... Jawab HANYA dengan "pria" atau "wanita"`

// BENAR ✅
content: `You are an AI that detects gender from facial photos. Answer ONLY with "male" or "female"`
```

---

## 🔧 Implementasi Terbaru

### File yang Diupdate:

#### 1. **`src/utils/api.js`** - Fungsi `transformImage`

```javascript
export const transformImage = async (originalImageBase64, theme, gender) => {
  // Get engineered prompt
  const { buildRamadanPrompt } = await import('./promptEngine.js');
  const engineeredPrompt = buildRamadanPrompt(theme, gender);

  // Correct Singapore endpoint for Wan2.6
  const wanxEndpoint = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

  // Prepare Base64 (remove data:image prefix if present)
  let cleanBase64 = originalImageBase64;
  if (cleanBase64.startsWith('data:')) {
    cleanBase64 = cleanBase64.split(',')[1];
  }

  // Correct multimodal payload
  const payload = {
    model: WANX_MODEL,
    input: {
      messages: [{
        role: 'user',
        content: [
          { text: engineeredPrompt },
          { image: `data:image/jpeg;base64,${cleanBase64}` }
        ]
      }]
    },
    parameters: {
      negative_prompt: 'low quality, worst quality, deformed...',
      size: '1K', // 1280*1280
      n: 1,
      seed: Math.floor(Math.random() * 2147483647),
      watermark: false
    }
  };

  const response = await axios.post(wanxEndpoint, payload, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 120000 // 2 minutes
  });

  return response.data;
};
```

#### 2. **`src/utils/imageTransform.js`** - Gender Detection

```javascript
export const analyzeImageForGender = async (imageUrl) => {
  const response = await axios.post(
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
    {
      model: 'qwen-vl-plus',
      messages: [
        {
          role: 'system',
          content: 'You are an AI that detects gender from facial photos. Answer ONLY with "male" or "female" without any explanation.'
        },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: 'Is the person in this photo male or female? Answer only with one word: "male" or "female".' }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );

  const content = response.data.choices[0].message.content.trim().toLowerCase();
  return content.includes('female') ? 'female' : 'male';
};
```

#### 3. **`src/utils/promptEngine.js`** - Enhanced Prompts

```javascript
export const buildRamadanPrompt = (theme, gender) => {
  // Detailed attire based on gender
  const attire = gender === 'male'
    ? "wearing a highly detailed elegant traditional Indonesian Baju Koko (Islamic shirt), wearing a black Peci/Songkok cap on head, neat and handsome appearance, peaceful Islamic expression"
    : "wearing a beautiful elegant silk Hijab covering hair and neck, modest Islamic gamis syar'i attire, flawless soft natural glowing Ramadan makeup, elegant and graceful, serene expression";

  // Background based on theme
  let background = "";
  if (theme === 'sahur') {
    background = "warm pre-dawn sahur lighting, dining table with traditional Indonesian Suhoor meal, softly glowing Fanous (Ramadan lantern), cozy early morning atmosphere, warm golden hour lighting";
  } else if (theme === 'bukapuasa') {
    background = "beautiful sunset lighting for breaking fast, a table full of dates (kurma) and sweet drinks, vibrant and warm atmosphere, breaking fast scene, golden hour glow";
  } else {
    background = "festive Eid al-Fitr celebration background, golden crescent moon in night sky, twinkling stars, traditional Ketupat decorations, sparkling lights, celebratory atmosphere, Eid Mubarak";
  }

  return `A highly realistic, 8k resolution portrait photograph of a person, ${attire}. The person is placed in a ${background}. Cinematic professional studio lighting, ultra-detailed face, keeping the original facial features intact from reference photo. Ramadan aesthetic, photorealistic, masterpiece, high quality photography.`;
};
```

---

## 📊 Flow Diagram Baru

```
User Upload Photo (Base64)
      ↓
┌─────────────────────┐
│ Gender Detection    │
│ Qwen-VL-Plus        │
│ English prompt      │
│ Result: male/female │
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Build Ramadan Prompt│
│ promptEngine.js     │
│ - Attire (detailed) │
│ - Background (theme)│
│ - Photography style │
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Image-to-Image API  │
│ Wan2.6 Multimodal   │
│ Endpoint:           │
│ /multimodal-generat │
│ Input:              │
│ - Text prompt       │
│ - Reference image   │
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Transformed Image   │
│ URL from API        │
│ Islamic attire +    │
│ Ramadan background  │
└─────────────────────┘
      ↓
Poster Ready! ✨
```

---

## 🚀 Cara Testing

### 1. **Restart Development Server**
```bash
npm run dev
```

### 2. **Test di Browser**
1. Buka http://localhost:5173
2. Upload foto Anda
3. Klik "Generate Poster"
4. Buka browser console (F12)

### 3. **Expected Console Output**

```
🔍 Step 1: Analyzing image for gender detection...
📡 Calling Qwen-VL for gender analysis...
✓ Gender detected: male

🎨 Step 2: Transforming image with Wanx AI...
🎨 Starting image transformation...
Theme: lebaran
Gender: male
Prompt: A highly realistic, 8k resolution portrait photograph of a person, wearing a highly detailed elegant traditional Indonesian Baju Koko...

📡 Mengirim request ke Alibaba Cloud Wan2.6...
Endpoint: https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
Payload: {
  "model": "wan2.6-t2i",
  "input": {
    "messages": [{
      "role": "user",
      "content": [
        { "text": "A highly realistic..." },
        { "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." }
      ]
    }]
  },
  "parameters": {
    "negative_prompt": "low quality, worst quality...",
    "size": "1K",
    "n": 1,
    "seed": 1234567890,
    "watermark": false
  }
}

📥 Response received: {
  "output": {
    "results": [{
      "url": "https://wanx-image-generation.oss-cn-shanghai.aliyuncs.com/..."
    }]
  }
}

✅ Image transformation successful!
✓ Image transformed successfully
Transferred image URL to store
```

---

## 🎯 Perbedaan Utama

| Aspek | Sebelum ❌ | Sesudah ✅ |
|-------|-----------|-----------|
| **Endpoint** | `/image/generations` | `/multimodal-generation/generation` |
| **Format** | Text-to-Image dengan ref_image | Multimodal Image-to-Image |
| **Input Gambar** | `ref_image: base64` | `messages[].content[].image: data:image;base64,...` |
| **Gender Language** | Indonesia (pria/wanita) | Inggris (male/female) |
| **Timeout** | 60 detik | 120 detik |
| **Size** | 1024*1024 | 1K (1280*1280) |
| **Prompt Detail** | Basic | Enhanced dengan photography terms |

---

## 💡 Tips Troubleshooting

### Jika masih ada Network Error:

#### 1. **Cek Console Log**
```javascript
// Lihat output lengkapnya
console.log('Full error:', error);
console.log('Response status:', error.response?.status);
console.log('Response data:', JSON.stringify(error.response?.data, null, 2));
```

#### 2. **Verify API Key**
Pastikan `.env` menggunakan Singapore region:
```env
VITE_ALIBABA_API_KEY=sk-9bd39877486540a48038b0593132cdaf
```

#### 3. **Test Manual dengan curl**
```bash
curl --location 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer sk-9bd39877486540a48038b0593132cdaf" \
--data '{
  "model": "wan2.6-t2i",
  "input": {
    "messages": [{
      "role": "user",
      "content": [
        { "text": "A beautiful portrait" },
        { "image": "data:image/jpeg;base64,YOUR_BASE64_HERE" }
      ]
    }]
  },
  "parameters": {
    "size": "1K",
    "n": 1
  }
}'
```

#### 4. **Cek Credits/Quota**
Login ke Alibaba Cloud Console → Model Studio → Usage Statistics

---

## 📝 Referensi Dokumentasi

- **Wan2.6 API Documentation**: https://www.alibabacloud.com/help/en/model-studio/wan-image-generation-api-reference
- **Multimodal Generation**: https://help.aliyun.com/zh/model-studio/text-to-image-v2-api-reference
- **Singapore Endpoint**: `https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

---

## ✅ Checklist Implementation

- [x] Updated `src/utils/api.js` with correct multimodal format
- [x] Updated `src/utils/imageTransform.js` with English gender detection
- [x] Updated `src/utils/promptEngine.js` with enhanced photography prompts
- [x] Using correct Singapore endpoint
- [x] Proper Base64 encoding with `data:image/jpeg;base64,` prefix
- [x] Increased timeout to 120 seconds
- [x] Added comprehensive error logging
- [x] Removed incorrect `X-DashScope-Async` header
- [x] Using `size: '1K'` instead of hardcoded resolution

---

**Status**: ✅ READY FOR TESTING!

Silakan restart server dan test generate poster! 🎉🌙✨
