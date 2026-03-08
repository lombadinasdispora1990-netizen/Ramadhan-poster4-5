# 🔑 Setup Replicate API untuk Transformasi Gambar

## 📋 Apa itu Replicate?

**Replicate** adalah platform yang menyediakan akses ke berbagai model AI open-source, termasuk **Stable Diffusion XL (SDXL)** dengan **ControlNet** untuk image-to-image transformation.

---

## 🚀 Cara Mendapatkan Replicate API Key

### Step 1: Buat Akun Replicate

1. Kunjungi: **https://replicate.com/**
2. Klik **"Sign Up"** atau **"Log In"**
3. Login dengan GitHub atau Google account
4. Lengkapi profil Anda

### Step 2: Dapatkan API Token

1. Setelah login, buka: **https://replicate.com/account/api-tokens**
2. Atau klik avatar Anda → **"Account Settings"** → **"API Tokens"**
3. Anda akan melihat API token Anda
4. **Copy** token tersebut (dimulai dengan `r8_...`)

### Step 3: Tambahkan ke .env File

Buka file `.env` di project BarokahGen dan tambahkan:

```env
# Replicate API Key (for AI Image Transformation)
VITE_REPLICATE_API_KEY=r8_YOUR_ACTUAL_TOKEN_HERE
```

**Contoh:**
```env
VITE_REPLICATE_API_KEY=r8_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789
```

---

## 💰 Pricing & Free Tier

### Free Trial
- **5 menit** komputasi gratis untuk testing
- Cukup untuk ~10-20 transformasi gambar

### Paid Plans
- $0.05 - $0.50 per transformasi (tergantung model)
- Pay-as-you-go (hanya bayar yang dipakai)

### Cara Menghindari Biaya Tak Terduga:
1. Monitor usage di: https://replicate.com/account/billing
2. Set spending limits
3. Gunakan free trial dulu untuk testing

---

## 🎯 Model yang Digunakan

Kami menggunakan **SDXL-Lightning-4step** dari ByteDance:

**Model URL:** https://replicate.com/bytedance/sdxl-lightning-4step

### Kenapa Model Ini?
- ⚡ **Cepat**: Hanya 4 inference steps
- 🎨 **Kualitas Tinggi**: Photorealistic results
- 🖼️ **Image-to-Image**: Bisa transform foto existing
- 💪 **ControlNet Support**: Maintain facial features

---

## 🔧 Testing API Key

Setelah menambahkan API key ke `.env`, test dengan cara:

### 1. Restart Development Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Test Transformasi

1. Buka aplikasi di browser
2. Upload foto wajah yang jelas
3. Klik "Generate Poster"
4. Lihat console browser (F12) untuk logs

### Expected Console Output:
```
🔍 Step 1: Analyzing image for gender detection...
✓ Gender detected: pria
🎨 Step 2: Transforming image with AI...
✅ Transformation complete!
```

---

## 🐛 Troubleshooting

### Error: "Replicate API key not configured"

**Solusi:**
- Pastikan `VITE_REPLICATE_API_KEY` ada di `.env`
- Restart development server setelah edit `.env`
- Cek tidak ada typo di API key

### Error: "Invalid token"

**Solusi:**
- Copy ulang API key dari replicate.com
- Pastikan tidak ada spasi di awal/akhir
- Cek token masih aktif di dashboard

### Error: "Insufficient credits"

**Solusi:**
- Login ke replicate.com
- Tambahkan credits (min $5)
- Atau tunggu free trial reset

### Transformasi Gagal / Timeout

**Kemungkinan Penyebab:**
- Jaringan internet lambat
- Server Replicate sedang busy
- Gambar terlalu besar (> 5MB)

**Solusi:**
- Compress gambar dulu (< 2MB ideal)
- Coba lagi beberapa saat kemudian
- Gunakan koneksi internet lebih cepat

---

## 📊 Monitoring Usage

### Cara Cek API Usage:

1. Login ke https://replicate.com/
2. Klik avatar → **"Account Settings"**
3. Pilih tab **"Usage"**
4. Lihat:
   - Total predictions
   - Compute time used
   - Current balance

### Set Spending Limits:

1. Buka **"Billing"** settings
2. Scroll ke **"Spending Limits"**
3. Set monthly limit (misal: $10/month)
4. Save changes

---

## 🔐 Security Best Practices

### ✅ DO:
- Simpan API key di `.env` file
- Add `.env` ke `.gitignore`
- Rotate API key secara berkala
- Monitor usage regularly

### ❌ DON'T:
- Commit `.env` ke Git
- Share API key di public forum
- Hardcode API key di source code
- Leave API key exposed in client-side code

---

## 🎨 Alternative Models

Selain SDXL-Lightning, bisa coba model lain:

### 1. **Realistic Vision V5**
```javascript
model: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea351df4979778f7e9332fd5ab"
```

### 2. **Absolute Reality**
```javascript
model: "physton/absolute-reality-v1-8-1:MODEL_VERSION_HASH"
```

### 3. **Flux Schnell** (Faster)
```javascript
model: "black-forest-labs/flux-schnell:MODEL_VERSION_HASH"
```

Untuk ganti model, edit `imageTransform.js` bagian endpoint URL.

---

## 📈 Performance Optimization

### Tips untuk Hasil Terbaik:

1. **Input Image Quality:**
   - Resolution: 800x1000px - 1024x1024px
   - Format: JPG atau PNG
   - Size: < 2MB
   - Lighting: Good, natural light

2. **Prompt Tuning:**
   - Adjust `prompt_strength` (0.7 - 0.9)
   - Increase `guidance_scale` (7 - 9)
   - Fine-tune negative prompts

3. **Speed vs Quality:**
   - Faster: Use fewer inference steps (4 steps)
   - Better quality: More steps (20-30 steps)

---

## 💡 Example: Manual API Call

Untuk testing manual tanpa UI:

```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': 'Token r8_YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    version: "28119c63e1da04f76d9e7e5e8e3b8b8b8b8b8b8b",
    input: {
      prompt: "Indonesian Muslim man wearing white baju koko",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      prompt_strength: 0.8,
      num_inference_steps: 4
    }
  })
});

const result = await response.json();
console.log(result);
```

---

## 📞 Support Resources

### Official Documentation:
- Replicate Docs: https://replicate.com/docs
- SDXL Model: https://replicate.com/bytedance/sdxl-lightning-4step
- API Reference: https://replicate.com/docs/reference/http

### Community:
- Discord: https://discord.gg/replicate
- GitHub: https://github.com/replicate

---

## ✅ Checklist Setup

- [ ] Buat akun Replicate
- [ ] Dapatkan API token dari dashboard
- [ ] Tambahkan ke `.env` file
- [ ] Restart development server
- [ ] Test dengan upload foto
- [ ] Verify transformed image muncul
- [ ] Monitor usage di dashboard
- [ ] Set spending limit (optional)

---

<div align="center">

**🎉 Selamat! Anda siap melakukan transformasi gambar dengan AI!**

*From photo to Islamic attire in seconds*

🌙✨🕌

</div>
