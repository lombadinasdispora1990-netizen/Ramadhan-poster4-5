# 🐛 Debugging Network Error - Wan2.6-T2I

## ❌ Masalah: "Network Error"

Ketika transformasi gagal dengan error "Network Error", kemungkinan penyebabnya:

---

## 🔍 Kemungkinan Penyebab & Solusi

### 1. **Wrong Endpoint URL** ⚠️

**Masalah:**
Wan2.6-T2I menggunakan endpoint yang berbeda dengan model lainnya.

**Solusi:**
```javascript
// ✅ CORRECT for Wan2.6-T2I (Async API)
https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation

// ❌ WRONG (ini untuk synchronous API)
https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation
```

**Update sudah dilakukan di imageTransform.js!** ✓

---

### 2. **Missing Async Header** ⚠️

**Masalah:**
Wan2.6-T2I WAJIB menggunakan async API dengan header khusus.

**Solusi:**
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'X-DashScope-Async': 'enable' // ← WAJIB ADA!
}
```

**Update sudah dilakukan!** ✓

---

### 3. **CORS Issue** ⚠️

**Masalah:**
Browser memblokir request cross-origin.

**Solusi:**

#### Option A: Disable CORS (Development only)
Install Chrome extension "Allow CORS" temporarily for testing.

#### Option B: Use Proxy
Create `vite.config.js` proxy:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dashscope-intl.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

Kemudian gunakan `/api/...` sebagai base URL.

---

### 4. **API Key Issues** ⚠️

**Check:**
```bash
# Verify API key in .env
cat .env | grep VITE_ALIBABA_API_KEY

# Should be exactly:
VITE_ALIBABA_API_KEY=sk-945226a6372043ae9d8db21a68e7ff37
```

**Common mistakes:**
- Extra spaces: `VITE_ALIBABA_API_KEY = sk-...` ❌
- Missing `VITE_` prefix
- Wrong variable name

---

### 5. **Model Not Enabled** ⚠️

**Check:**
1. Login ke https://dashscope.console.aliyun.com/
2. Go ke Model Studio
3. Cari "Wan2.6" atau "Wanx"
4. Pastikan model enabled untuk region Singapore

---

### 6. **Insufficient Credits/Quota** ⚠️

**Check:**
1. Login ke Alibaba Cloud Console
2. Billing → Usage
3. Check apakah credits masih ada

**Solution:**
Add credits to account ($5 minimum recommended)

---

## 🧪 Testing Manual

### Test 1: Direct API Call (Postman/curl)

```bash
curl -X POST 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer sk-945226a6372043ae9d8db21a68e7ff37' \
-H 'X-DashScope-Async: enable' \
-d '{
  "model": "Wan2.6-T2I",
  "input": {
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "text": "A beautiful flower"
          }
        ]
      }
    ]
  },
  "parameters": {
    "size": "1280*1280",
    "n": 1
  }
}'
```

**Expected response:**
```json
{
  "output": {
    "task_id": "abc123..."
  },
  "request_id": "xyz789..."
}
```

Jika dapat task_id → API works! ✓

---

### Test 2: Browser Console

Buka browser console (F12) dan lihat:

```javascript
// Check if env variables loaded
console.log(import.meta.env.VITE_ALIBABA_API_KEY);
// Should print: sk-945226a6372043ae9d8db21a68e7ff37

console.log(import.meta.env.VITE_WANX_API_URL);
// Should print: undefined (karena kita hardcode endpoint)
```

---

## 📊 Expected Flow with Logs

When working correctly, console should show:

```
🔍 Step 1: Analyzing image for gender detection...
✓ Gender detected: pria
🎨 Step 2: Transforming image with Wanx AI...
📡 Calling Wan2.6-T2I API...
Endpoint: https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation
Gender: pria
📥 Task created: { output: { task_id: "abc123..." } }
⏳ Polling for task completion... abc123...
Attempt 1: Status = PENDING
Attempt 2: Status = RUNNING
Attempt 3: Status = RUNNING
Attempt 4: Status = SUCCEEDED
✅ Image generation successful!
Transformation complete!
```

---

## 🔧 Troubleshooting Steps

### Step 1: Check Environment Variables

```bash
# In project root
cat .env
```

Should show:
```env
VITE_ALIBABA_API_KEY=sk-945226a6372043ae9d8db21a68e7ff37
VITE_WANX_API_URL=https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image-generation/generation
VITE_WANX_MODEL=Wan2.6-T2I
```

### Step 2: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 3: Clear Browser Cache

Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Generate Poster"
4. Look for failed request
5. Check:
   - Request URL
   - Request headers
   - Response (if any)
   - Status code

### Step 5: Test with Simple Prompt

Modify code temporarily to test with simple prompt first:

```javascript
const prompt = 'A red apple on white background';
```

If this works → Complex prompt issue
If this fails → API/Network issue

---

## 💡 Alternative: Use Synchronous API

If async keeps failing, try synchronous endpoint (if supported):

```javascript
const wanxEndpoint = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

// Remove X-DashScope-Async header
// Get result directly from response
```

**Note:** Wan2.6-T2I might not support sync API.

---

## 🎯 Quick Fix Checklist

- [ ] `.env` file has correct API key
- [ ] Server restarted after .env change
- [ ] Using correct endpoint URL
- [ ] Using `X-DashScope-Async: enable` header
- [ ] No CORS errors in console
- [ ] API key is valid and active
- [ ] Model is enabled in console
- [ ] Sufficient credits available

---

## 📞 Next Steps

If still failing after all checks:

1. **Share browser console logs** (full error message)
2. **Share network tab screenshot** (request/response details)
3. **Test API manually** with Postman/curl
4. **Check Alibaba Cloud status page** for outages

---

<div align="center">

**Debug mode activated! 🔍**

*Let's find and fix that network error!*

</div>
