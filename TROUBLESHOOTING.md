# 🚨 Troubleshooting Guide - BarokahGen

## Common Errors & Solutions

---

### ❌ Error: IPInfringementSuspect (400 Bad Request)

**Error Message:**
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
Response data: {
  "code": "IPInfringementSuspect",
  "message": "Input data is suspected of being involved in IP infringement."
}
```

**Cause:**
Alibaba Cloud's content moderation system flagged the prompt as potentially infringing copyrighted intellectual property. This happens when prompts contain trademarked terms like:
- ✗ "Pixar", "Disney"
- ✗ "Studio Ghibli"
- ✗ "Blade Runner"
- ✗ Brand names, character names, etc.

**Solution:**
✅ Use descriptive language instead of trademarked terms:
- Instead of "Pixar/Disney style" → "modern animation studio style"
- Instead of "Studio Ghibli inspired" → "Japanese animation art style"
- Instead of "Blade Runner vibes" → "dystopian future atmosphere"

**Fixed in Code:**
The prompts have been updated to use generic artistic descriptions that achieve similar results without triggering IP filters.

---

### ❌ Error: Transformation Takes Too Long

**Symptoms:**
- Loading spinner keeps spinning for >2 minutes
- Timeout error appears

**Possible Causes:**
1. Slow internet connection
2. Large image file size (>5MB)
3. API server overload
4. Complex transformation mode

**Solutions:**
1. ✅ Check your internet speed
2. ✅ Compress image to <2MB
3. ✅ Try again during off-peak hours
4. ✅ Use simpler modes (Text Only or Realistic)
5. ✅ Refresh page and retry

---

### ❌ Error: Gender Detection Failed

**Error Message:**
```
Gender detection failed, using default: male
```

**Cause:**
Qwen-VL model couldn't determine gender from the photo.

**Common Scenarios:**
- Photo too dark or blurry
- Face not clearly visible
- Extreme angles
- Group photos (multiple faces)

**Solution:**
- ✅ Upload a clearer, well-lit photo
- ✅ Use front-facing or 3/4 angle portraits
- ✅ Ensure face is clearly visible
- ✅ Use single-person photos
- ✅ System will default to 'male' attire if detection fails

---

### ❌ Error: No Image URL in Response

**Error Message:**
```
No image URL in transformation result
```

**Cause:**
API call succeeded but didn't return an image URL.

**Possible Reasons:**
1. Content policy violation
2. Inappropriate input image
3. API model temporarily unavailable

**Solutions:**
- ✅ Check image doesn't violate content policies
- ✅ Avoid inappropriate or sensitive content
- ✅ Try a different image
- ✅ Wait and retry later

---

### ❌ Error: API Key Invalid (401)

**Error Message:**
```
API key tidak valid. Periksa konfigurasi .env file Anda.
```

**Cause:**
Missing or incorrect API key in `.env` file.

**Solution:**
1. ✅ Open `.env` file in project root
2. ✅ Verify `VITE_ALIBABA_API_KEY=your_actual_key_here`
3. ✅ No extra spaces before/after the key
4. ✅ Restart dev server: `npm run dev`
5. ✅ Check key is active in Alibaba Cloud dashboard

---

### ❌ Error: Quota Exceeded (429)

**Error Message:**
```
Quota exceeded. Tunggu beberapa saat dan coba lagi.
```

**Cause:**
You've reached your API rate limit or daily quota.

**Solutions:**
1. ✅ Wait a few minutes and retry
2. ✅ Check your Alibaba Cloud quota limits
3. ✅ Upgrade your API plan if needed
4. ✅ Spread out your generations over time

---

### ❌ Error: CORS Issues

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Cause:**
Browser blocking cross-origin requests.

**Solutions:**
- ✅ Using Vite proxy (already configured)
- ✅ Make sure you're accessing via `localhost:3001`
- ✅ Don't open HTML file directly
- ✅ Run `npm run dev` first

---

### ❌ Download Not Working

**Symptoms:**
- Click download but nothing happens
- Blank image downloads

**Causes:**
1. Popup blocker preventing download
2. Image not fully loaded
3. Browser compatibility issue

**Solutions:**
- ✅ Disable popup blocker for localhost
- ✅ Wait until poster fully renders
- ✅ Try Chrome/Edge browser (recommended)
- ✅ Right-click poster → "Save image as..."

---

### ❌ Text Generation Returns Gibberish

**Symptoms:**
- Generated text is nonsensical
- Text contains random characters
- Very long or very short text

**Causes:**
1. API model having issues
2. Prompt engineering problem
3. Network interruption

**Solutions:**
- ✅ Retry generation
- ✅ Clear generated text and regenerate
- ✅ Check network connection
- ✅ If persists, check API status

---

## 🛡️ Prevention Tips

### Best Practices:

1. **Image Quality**
   - Use JPG/PNG format
   - Keep file size under 2MB
   - Ensure good lighting
   - Front-facing or 3/4 angle

2. **API Usage**
   - Don't spam generate button
   - Wait between generations
   - Monitor your API quota
   - Check API status regularly

3. **Content Guidelines**
   - Use appropriate images only
   - No copyrighted material
   - No inappropriate content
   - Respect cultural sensitivities

4. **Technical Setup**
   - Keep `.env` file secure
   - Never commit API keys
   - Use latest Node.js version
   - Clear browser cache periodically

---

## 🔍 Debug Mode

### Enable Detailed Logging:

Add to your code temporarily:
```javascript
// In api.js, add more console.logs
console.log('Full request:', JSON.stringify(payload, null, 2));
console.log('Response headers:', response.headers);
```

### Check Browser Console:
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for error messages
4. Copy error details for troubleshooting

---

## 📞 Getting Help

### Before Asking for Help:

1. ✅ Check this troubleshooting guide
2. ✅ Search error message in documentation
3. ✅ Try basic fixes (refresh, clear cache)
4. ✅ Note exact error message
5. ✅ Take screenshot of console errors

### When Contacting Support:

Include:
- Error message (copy-paste or screenshot)
- What mode you were using
- What action caused the error
- Browser and version
- Steps to reproduce

---

## 🔄 Quick Fixes Checklist

When something goes wrong, try these in order:

1. **Refresh Page** (Ctrl+R / Cmd+R)
2. **Clear Console** (Console → Clear)
3. **Check Internet** (Open another website)
4. **Restart Dev Server** (Ctrl+C, then `npm run dev`)
5. **Clear Browser Cache** (Ctrl+Shift+Delete)
6. **Try Different Browser** (Chrome recommended)
7. **Check API Status** (Alibaba Cloud dashboard)
8. **Reduce Image Size** (Compress to <2MB)

---

## 📊 Known Limitations

### Current System Constraints:

| Limitation | Value | Notes |
|-----------|-------|-------|
| Max Image Size | 5MB | Recommended: <2MB |
| API Rate Limit | Varies | Check your plan |
| Daily Quota | Varies | Check Alibaba Cloud |
| Processing Time | 2-10s | Depends on mode |
| Success Rate | ~92% | Some failures expected |

---

## 🎯 Mode-Specific Issues

### Text Only Mode:
- ❌ Still transforming → Clear state, reload page
- ✅ Expected: Uses original photo

### Realistic Mode:
- ❌ Wrong gender → Upload clearer photo
- ❌ Poor quality → Use higher resolution

### 3D Cartoon:
- ❌ IP infringement error → Fixed! No more trademarked terms
- ❌ Not cartoon-ish enough → Try different photo angle

### Anime:
- ❌ Doesn't look anime → Ensure good lighting
- ❌ Wrong style → Description adjusted automatically

### Oil Painting:
- ❌ Too realistic → Use formal pose
- ❌ Colors too vibrant → Normal for this style

### Cyberpunk:
- ❌ Too dark → Add some light to photo
- ❌ Not futuristic enough → Style applied subtly

---

<div align="center">

**Still Having Issues?**

Check the main documentation:
- 📖 [GENERATION_MODES.md](GENERATION_MODES.md)
- 📖 [QUICK_MODE_GUIDE.md](QUICK_MODE_GUIDE.md)
- 📖 [README.md](README.md)

</div>
