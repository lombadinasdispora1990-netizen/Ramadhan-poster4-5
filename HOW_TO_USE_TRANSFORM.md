# ⚡ Quick Start - Real AI Image Transformation

## 🎯 Cara Menggunakan Fitur Transformasi Busana Islami

### ✅ Prerequisites (WAJIB!)

Sebelum bisa menggunakan transformasi gambar, Anda HARUS memiliki:

1. **Alibaba Cloud API Key** ✓ (Sudah ada: `sk-db28ec22c3614f7db992432f5dd62840`)
2. **Replicate API Key** ⚠️ (Belum ada - perlu daftar dulu)

---

## 📋 Step-by-Step Setup

### Step 1: Dapatkan Replicate API Key (5 menit)

1. **Buka**: https://replicate.com/
2. **Sign Up**: Login dengan GitHub/Google
3. **Buka API Tokens**: https://replicate.com/account/api-tokens
4. **Copy Token**: Anda akan dapat token seperti `r8_aBcDeFgHiJkLmNo...`

### Step 2: Tambahkan ke .env File

Buka file `.env` di project ini, lalu tambahkan:

```env
VITE_REPLICATE_API_KEY=r8_YOUR_TOKEN_HERE
```

**Contoh lengkap .env:**
```env
# Alibaba Cloud API (Already configured ✓)
VITE_ALIBABA_API_KEY=sk-db28ec22c3614f7db992432f5dd62840
VITE_API_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions
VITE_MODEL_NAME=qwen-plus

# Replicate API (ADD YOURS HERE)
VITE_REPLICATE_API_KEY=r8_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789
```

### Step 3: Restart Server

Stop server yang sedang berjalan (Ctrl+C), lalu jalankan ulang:

```bash
npm run dev
```

### Step 4: Test Transformasi! 🧪

1. **Buka browser**: http://localhost:3000
2. **Upload foto** wajah yang jelas
3. **Klik "Generate Poster"**
4. **Tunggu 5-10 detik** untuk transformasi
5. **Lihat hasilnya!** Foto Anda akan berubah dengan busana Islami ✨

---

## 🎨 Contoh Hasil Transformasi

### Untuk Pria:
- Input: Foto pria biasa
- Output: Pria dengan baju koko putih + pecchi hitam
- Style: Formal Islamic wear

### Untuk Wanita:
- Input: Foto wanita biasa  
- Output: Wanita dengan gamis syar'i + jilbab rapi
- Style: Elegant pastel colors

---

## 💡 Tips untuk Hasil Terbaik

### ✅ DO (Lakukan):
- Upload foto wajah yang jelas (frontal atau 3/4 angle)
- Gunakan foto dengan lighting bagus
- Background netral/polos lebih baik
- Resolusi min 800x1000px
- Size file < 2MB

### ❌ DON'T (Hindari):
- Foto grup (banyak orang)
- Foto gelap/blur
- Angle ekstrem (dari bawah/samping)
- Filter berlebihan
- Aksesori besar (topi, kacamata hitam)

---

## ⚠️ Troubleshooting

### Error: "Replicate API key not configured"
**Solusi:**
- Pastikan sudah add `VITE_REPLICATE_API_KEY` di `.env`
- Restart server setelah edit `.env`
- Cek tidak ada typo

### Error: "Invalid token"
**Solusi:**
- Copy ulang dari replicate.com
- Pastikan tidak ada spasi
- Cek token masih aktif

### Error: "Insufficient credits"
**Solusi:**
- Free trial habis? Tambah credits ($5 min)
- Atau tunggu reset next month

### Transformasi Lama / Timeout
**Solusi:**
- Cek koneksi internet
- Compress gambar (< 2MB)
- Coba lagi nanti (server busy)

---

## 💰 Biaya & Pricing

### Free Tier:
- ✅ **5 menit** komputasi gratis
- ≈ 10-20 transformasi gratis

### Paid:
- 💵 $0.05 - $0.50 per transformasi
- Pay-as-you-go (hanya bayar yang dipakai)

### Tips Hemat:
- Gunakan free trial dulu untuk testing
- Set spending limit di dashboard
- Monitor usage di: https://replicate.com/account/billing

---

## 🔍 Cara Cek Apakah Berhasil?

Setelah generate, cek:

1. **Console Browser** (F12):
   ```
   🔍 Step 1: Analyzing image for gender detection...
   ✓ Gender detected: pria
   🎨 Step 2: Transforming image with AI...
   ✅ Transformation complete!
   ```

2. **UI Changes**:
   - Muncul badge "AI Islamic Attire Transformation Applied"
   - Foto di poster BERUBAH (bukan foto asli lagi)
   - Ada perbedaan jelas (busana Islami)

3. **Download Result**:
   - Download poster
   - Lihat foto yang sudah ditransformasi
   - Compare dengan foto asli

---

## 📊 Expected Timeline

| Step | Duration |
|------|----------|
| Gender Detection | ~2-3 detik |
| Image Transformation | ~5-10 detik |
| Text Generation | ~3-5 detik |
| **Total** | **~10-18 detik** |

---

## 🎉 Success Criteria

Transformasi dianggap berhasil jika:

✅ Foto di poster BERBEDA dari foto asli  
✅ Terlihat busana Islami (koko/gamis)  
✅ Wajah masih mirip (facial features maintained)  
✅ Kualitas bagus (tidak blur/artefak)  
✅ Proses < 20 detik  

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:

1. Baca: [REPLICATE_SETUP.md](REPLICATE_SETUP.md) untuk detail lengkap
2. Cek console browser untuk error messages
3. Verify API key di replicate.com dashboard
4. Test dengan foto berbeda

---

## 🚀 Ready to Transform!

Setelah setup selesai, Anda bisa:

✨ Transform foto jadi busana Islami  
✨ Generate ucapan Ramadan otomatis  
✨ Download poster berkualitas tinggi  
✨ Share ke media sosial  

**Selamat mencoba! 🌙✨🕌**
