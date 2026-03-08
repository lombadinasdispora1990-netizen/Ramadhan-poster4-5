# 🔍 Signed URL Expiration Investigation Guide

## 📋 Overview

This guide helps diagnose and fix the Alibaba Cloud OSS signed URL expiration issue that causes the "1022 bytes" error when trying to download/share generated posters.

---

## 🛠️ New Diagnostic Tools Added

### 1. **URL Analysis Utility** (`src/utils/urlDiagnostics.js`)

Provides functions to analyze signed URLs:
- `analyzeSignedURL(url)` - Parse and analyze URL parameters
- `logURLAnalysis(url)` - Log detailed analysis to console
- `diagnoseSignedURL(url)` - Comprehensive test with recommendations

### 2. **Enhanced Logging in PosterPreview**

Automatically analyzes every Alibaba OSS URL before conversion:
```javascript
🔍 Analyzing signed URL...
📊 URL Status: ✅ Valid
⏰ Expires: 3/7/2026, 10:45:16 PM
⏳ Time Remaining: 59m 40s
⚠️ Diagnostics:
  [INFO] URL expires in 59m 40s - acceptable timeframe
```

### 3. **Enhanced Vite Proxy Middleware**

Analyzes URLs server-side before fetching:
```javascript
🔍 Signed URL Analysis:
   Expires: 3/7/2026, 10:45:16 PM
   Time Remaining: 59m 40s
   Has AccessKeyId: ✅
   Has Signature: ✅
```

---

## 🧪 How to Use the Diagnostic Tools

### Method 1: Automatic (During Normal Usage)

Just generate a poster normally and check the console. You'll see:

```
🖼️ PosterPreview - Images: {transformedImage: 'https://dashscope-*.oss-accelerate.aliyuncs.com/...'}

🔍 Analyzing signed URL...
📊 URL Status: ❌ EXPIRED
⏰ Expires: 3/7/2026, 8:30:00 PM
⏳ Time Remaining: EXPIRED
⚠️ Diagnostics:
  [CRITICAL] URL EXPIRED! This signed URL is no longer valid
  [WARNING] Need to regenerate the signed URL with fresh expiration

❌ Blob size is too small: 1022 bytes
   This is likely an error message, not an image
📄 Error response content:
<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>AccessDenied</Code>
  <Message>Request has expired</Message>
</Error>
```

### Method 2: Manual Testing

Open browser console and run:

```javascript
// Import the diagnostic tool
import { diagnoseSignedURL } from './src/utils/urlDiagnostics.js';

// Get a transformed image URL from your app
const testUrl = 'https://dashscope-*.oss-accelerate.aliyuncs.com/...';

// Run comprehensive diagnosis
await diagnoseSignedURL(testUrl);
```

---

## 📊 What to Look For

### ✅ Healthy URL Example:

```
🔍 Analyzing signed URL...
📊 URL Status: ✅ Valid
⏰ Expires: 3/7/2026, 11:45:00 PM
⏳ Time Remaining: 59m 23s
⚠️ Diagnostics:
  [SUCCESS] URL valid for 59m 23s - good
  [INFO] All required parameters present

✅ Successfully fetched image, size: 125000 bytes
✅ Converted to blob URL successfully
```

### ❌ Expired URL Example:

```
🔍 Analyzing signed URL...
📊 URL Status: ❌ EXPIRED
⏰ Expires: 3/7/2026, 8:30:00 PM
⏳ Time Remaining: EXPIRED (-2h 15m ago)
⚠️ Diagnostics:
  [CRITICAL] URL EXPIRED! This signed URL is no longer valid
  [CRITICAL] URL expires in less than 60 seconds - too short

❌ Blob size is too small: 1022 bytes
📄 Error response content:
<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>AccessDenied</Code>
  <Message>Request has expired</Message>
  <Expires>2026-03-07T20:30:00Z</Expires>
</Error>
```

---

## 🔍 Common Issues & Solutions

### Issue 1: **URL Expires Too Quickly** ⏰

**Symptoms:**
```
Time Remaining: 45s
[CRITICAL] URL expires in less than 60 seconds
```

**Cause:**
Alibaba Cloud generates URLs with very short expiration times (e.g., 1 minute).

**Solutions:**

#### A. Increase URL Expiration Time (Recommended)
When generating signed URLs from Alibaba Cloud, specify longer expiration:

```javascript
// In your API call or backend code
const signedUrl = client.signUrl(
  'bucket-name',
  'object-key',
  3600 // 1 hour in seconds (instead of 60)
);
```

#### B. Refresh URLs Before Expiration
Implement automatic URL refresh:

```javascript
// Check URL before use
const analysis = analyzeSignedURL(imageUrl);
if (analysis.expiresInSeconds < 300) { // Less than 5 minutes
  // Request fresh URL
  const freshUrl = await requestFreshURL();
}
```

---

### Issue 2: **URL Already Expired** ❌

**Symptoms:**
```
Time Remaining: EXPIRED
[CRITICAL] URL has already expired!
```

**Cause:**
- Image generation took too long
- User waited too long before downloading
- Server clock skew

**Solutions:**

#### A. Generate URL On-Demand
Don't store URLs - generate them fresh when needed:

```javascript
// Instead of storing URL from initial generation
const storedUrl = response.data.imageUrl;

// Generate fresh URL at download time
const handleDownload = async () => {
  const freshUrl = await getFreshImageUrl(generatedImageId);
  // Use fresh URL immediately
};
```

#### B. Extend Exiration on Generation
Configure Wan2.6 to return URLs with longer validity:

```javascript
// In api.js transformImage function
parameters: {
  // ... other params
  url_expiration: 3600 // 1 hour
}
```

---

### Issue 3: **Missing Signature Parameters** 🔑

**Symptoms:**
```
Has AccessKeyId: ❌
Has Signature: ❌
[ERROR] Missing Signature parameter
```

**Cause:**
- URL parsing lost query parameters
- Proxy didn't preserve full URL
- Incorrect URL encoding

**Solutions:**

#### A. Verify URL Encoding
Ensure URLs are properly encoded when passed:

```javascript
// Correct encoding
const safeUrl = encodeURIComponent(fullImageUrl);
const proxyUrl = `/api/proxy-image?url=${safeUrl}`;
```

#### B. Check Proxy Configuration
Verify vite.config.js preserves parameters:

```javascript
// Current implementation does this correctly:
const targetUrl = decodeURIComponent(urlParam);
// This preserves ALL query params
```

---

### Issue 4: **Invalid Signature for IP** 🌐

**Symptoms:**
```
Time Remaining: 45m 20s (NOT expired)
Has Signature: ✅
But still gets 1022 bytes error

📄 Error content:
<Error>
  <Code>AccessDenied</Code>
  <Message>Signature does not match</Message>
</Error>
```

**Cause:**
- Signature was generated for different IP address
- Network configuration changed
- CORS restrictions

**Solution:**
Use server-side proxy (which we already have!) - the signature should work since request comes from Vite server, not browser.

---

## 📈 Expected URL Lifespan

| Scenario | Typical Expiration | Recommendation |
|----------|-------------------|----------------|
| **Default OSS** | 15 minutes | ✅ Acceptable |
| **Wan2.6 Generation** | 1 hour | ✅ Good |
| **Custom Config** | 24 hours | ✅ Excellent |
| **Too Short** | < 2 minutes | ⚠️ Problematic |
| **Already Expired** | 0 seconds | ❌ Critical |

---

## 🔧 Debugging Workflow

### Step 1: Generate Poster
```bash
npm run dev
# Upload photo, generate poster
```

### Step 2: Check Console Logs
Look for:
```
🔍 Analyzing signed URL...
📊 URL Status: [STATUS]
⏰ Expires: [DATE]
⏳ Time Remaining: [TIME]
```

### Step 3: Identify Issue
Based on logs, determine:
- Is URL expired? → See Issue 2
- Is URL expiring soon? → See Issue 1
- Are parameters missing? → See Issue 3
- Is signature invalid? → See Issue 4

### Step 4: Apply Solution
Follow solutions from above sections

### Step 5: Test Again
Generate new poster and verify fix worked

---

## 💡 Pro Tips

### 1. **Monitor URL Timing**

Add timing to your generation flow:

```javascript
const startTime = Date.now();
const result = await transformImage(...);
const endTime = Date.now();
console.log('Generation took:', (endTime - startTime) / 1000, 'seconds');

// Analyze URL immediately
const analysis = analyzeSignedURL(result.imageUrl);
console.log('URL valid for:', analysis.expiresInSeconds, 'seconds');
```

### 2. **Implement URL Health Check**

Before attempting download:

```javascript
const isURLHealthy = (url) => {
  const analysis = analyzeSignedURL(url);
  return !analysis.isExpired && analysis.expiresInSeconds > 60;
};

// Use before download
if (!isURLHealthy(imageUrl)) {
  alert('Your session is expiring soon. Please regenerate the poster.');
}
```

### 3. **Cache Fresh URLs**

Store URLs with metadata:

```javascript
const urlCache = new Map();

const getCachedURL = async (imageId, getUrlFn) => {
  const cached = urlCache.get(imageId);
  
  if (cached && cached.expiresAt > Date.now() + 300000) { // 5 min buffer
    return cached.url;
  }
  
  // Get fresh URL
  const freshUrl = await getUrlFn(imageId);
  const analysis = analyzeSignedURL(freshUrl);
  
  urlCache.set(imageId, {
    url: freshUrl,
    expiresAt: analysis.expirationDate.getTime()
  });
  
  return freshUrl;
};
```

---

## 🎯 Success Criteria

Your signed URL issue is resolved when you see:

```
✅ Analyzing signed URL...
📊 URL Status: ✅ Valid
⏰ Expires: [Future date/time]
⏳ Time Remaining: [> 5 minutes]
✅ Successfully fetched image, size: 125000 bytes
✅ Converted to blob URL
✅ Share/download works perfectly
```

---

## 🆘 Still Having Issues?

If problems persist after using these diagnostics:

1. **Collect Full Logs**
   - Copy entire console output
   - Include network tab from DevTools
   - Note exact error messages

2. **Check Alibaba Cloud Console**
   - Verify OSS bucket permissions
   - Check CORS configuration
   - Review access logs

3. **Test with Different Networks**
   - Some corporate networks block OSS
   - Try different WiFi/mobile data
   - Check firewall rules

4. **Consider Alternative Hosting**
   - Use CDN instead of direct OSS
   - Implement permanent URLs with CDN signing
   - Cache images on your own server

---

<div align="center">

**🔍 With these diagnostic tools, you can now see exactly what's happening with your signed URLs!**

*Next step: Generate a poster and watch the console logs reveal the issue.*

</div>
