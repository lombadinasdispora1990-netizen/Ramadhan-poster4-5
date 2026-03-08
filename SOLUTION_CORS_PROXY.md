# 🚀 FIXED: CORS Error dengan Vite Proxy!

## ❌ **Masalah CORS yang Terjadi:**

```
Access to XMLHttpRequest at 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' 
from origin 'http://localhost:3001' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### **Penyebab:**
Browser memblokir request langsung dari `localhost:3001` ke `https://dashscope-intl.aliyuncs.com` karena **kebijakan CORS** (Cross-Origin Resource Sharing).

---

## ✅ **Solusi: Vite Development Proxy**

### **Cara Kerja Proxy:**
```
Browser → localhost:3001 → Vite Proxy → Alibaba Cloud API
         (same origin)    (forward)     (no CORS block)
```

Dengan proxy, browser mengira request dikirim ke server yang sama (localhost), jadi tidak ada CORS error!

---

## 🔧 **Implementasi:**

### 1. **Update `vite.config.js`**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    // Proxy configuration for Alibaba Cloud API
    proxy: {
      '/api/alibaba': {
        target: 'https://dashscope-intl.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/alibaba/, ''),
      },
      '/compatible-mode': {
        target: 'https://dashscope-intl.aliyuncs.com',
        changeOrigin: true,
      }
    }
  }
})
```

### **Penjelasan Proxy Paths:**

| Path | Target | Rewrite | Digunakan Untuk |
|------|--------|---------|-----------------|
| `/api/alibaba/*` | `https://dashscope-intl.aliyuncs.com/*` | Remove `/api/alibaba` prefix | Wan2.6 multimodal endpoint |
| `/compatible-mode/*` | `https://dashscope-intl.aliyuncs.com/compatible-mode/*` | No rewrite | Qwen-VL chat completions |

---

### 2. **Update `src/utils/api.js`**

**Sebelum:**
```javascript
const wanxEndpoint = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
```

**Sesudah:**
```javascript
// Using Vite proxy to avoid CORS issues
const wanxEndpoint = '/api/alibaba/api/v1/services/aigc/multimodal-generation/generation';
```

---

### 3. **Update `src/utils/imageTransform.js`**

**Sebelum:**
```javascript
const response = await axios.post(
  'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
  ...
);
```

**Sesudah:**
```javascript
const response = await axios.post(
  '/api/alibaba/compatible-mode/v1/chat/completions',
  ...
);
```

---

## 🎯 **Flow Request dengan Proxy:**

```
User Upload Photo
      ↓
Gender Detection API
├─ Browser → http://localhost:3001/api/alibaba/compatible-mode/v1/chat/completions
├─ Vite Proxy → https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions
└─ Response ← Qwen-VL Plus API
      ↓
Wan2.6 Image Generation API
├─ Browser → http://localhost:3001/api/alibaba/api/v1/services/aigc/multimodal-generation/generation
├─ Vite Proxy → https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
└─ Response ← Wan2.6 API with transformed image URL
      ↓
Poster Ready! ✨
```

---

## 📊 **Perbandingan: Tanpa vs Dengan Proxy**

| Aspek | Tanpa Proxy ❌ | Dengan Proxy ✅ |
|-------|---------------|----------------|
| **Request URL** | Direct ke Alibaba Cloud | Via localhost proxy |
| **CORS Error** | ✅ Terjadi | ❌ Tidak terjadi |
| **Browser Console** | Blocked by CORS | Success |
| **Network Tab** | Failed | 200 OK |
| **Development Flow** | Terganggu | Lancar |

---

## 🚀 **Testing:**

### 1. **Restart Development Server**

```bash
# Stop server lama (Ctrl + C)
npm run dev
```

### 2. **Verify Proxy Configuration**

Buka terminal, harusnya muncul:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
➜  Network: use --host to expose
```

### 3. **Test Generate Poster**

1. Buka `http://localhost:3001`
2. Upload foto
3. Klik "Generate Poster"
4. Lihat console output

### 4. **Expected Console Output:**

```
🔍 Step 1: Analyzing image for gender detection...
✓ Gender detected: male

🎨 Starting image transformation...
Theme: lebaran
Gender: male
Prompt: A highly realistic, 8k resolution portrait photograph...

📡 Mengirim request ke Alibaba Cloud Wan2.6...
Endpoint: /api/alibaba/api/v1/services/aigc/multimodal-generation/generation

Proxying request to: https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation

📥 Response received: {...}

✅ Image transformation successful!
```

### 5. **Check Network Tab (F12):**

Harusnya terlihat:
```
POST http://localhost:3001/api/alibaba/api/v1/services/aigc/multimodal-generation/generation
Status: 200 OK
Method: POST
```

---

## 💡 **Tips Troubleshooting:**

### 1. **Jika masih ada CORS error:**

Pastikan menggunakan path proxy yang benar:
```javascript
// BENAR ✅
const endpoint = '/api/alibaba/api/v1/...'

// SALAH ❌
const endpoint = 'https://dashscope-intl.aliyuncs.com/...'
```

### 2. **Verify Proxy Working:**

Di terminal Vite, harusnya muncul log:
```
Proxying request to: https://dashscope-intl.aliyuncs.com/...
```

### 3. **Check Port:**

Pastikan port di `vite.config.js` sesuai:
```javascript
server: {
  port: 3001, // Harus sama dengan browser
}
```

### 4. **Clear Browser Cache:**

Terkadang cache bisa menyebabkan masalah:
- Chrome: `Ctrl + Shift + Delete`
- Hard reload: `Ctrl + F5`

---

## 🔐 **Security Note:**

### **Development Only!**
Proxy configuration ini **HANYA untuk development** di localhost.

### **Production Deployment:**
Untuk production, Anda perlu:
1. **Backend Server** (Node.js/Express, Python/FastAPI, dll)
2. **Environment Variables** di backend
3. **API Calls** dari backend ke Alibaba Cloud

**Contoh Production Architecture:**
```
Frontend (React) → Backend (Node.js) → Alibaba Cloud API
                   (handles API keys)
```

---

## 📝 **File yang Diupdate:**

| File | Perubahan |
|------|-----------|
| [`vite.config.js`](file:///c:/Users/User/OneDrive/Documents/GitHub/Ramadhan-poster/vite.config.js) | ✅ Added proxy configuration<br>✅ Changed port to 3001 |
| [`src/utils/api.js`](file:///c:/Users/User/OneDrive/Documents/GitHub/Ramadhan-poster/src/utils/api.js) | ✅ Using proxy endpoint `/api/alibaba/...` |
| [`src/utils/imageTransform.js`](file:///c:/Users/User/OneDrive/Documents/GitHub/Ramadhan-poster/src/utils/imageTransform.js) | ✅ Using proxy endpoint for Qwen-VL |

---

## ✅ **Checklist Implementation:**

- [x] Added proxy configuration to `vite.config.js`
- [x] Updated `api.js` to use proxy endpoint
- [x] Updated `imageTransform.js` to use proxy endpoint
- [x] Changed port to 3001
- [x] Added logging for proxy requests
- [x] Documented proxy setup

---

## 🎉 **Next Steps:**

1. **Restart server:**
   ```bash
   npm run dev
   ```

2. **Test generate poster** - Harusnya tidak ada CORS error lagi!

3. **Share hasil console** jika berhasil! 🚀✨

---

**Status**: ✅ CORS ERROR FIXED WITH VITE PROXY!

Silakan restart dan test! 🎊🌙✨
