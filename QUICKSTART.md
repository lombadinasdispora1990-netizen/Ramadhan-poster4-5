# 🚀 Quick Setup Guide - BarokahGen

## Step 1: Get Your Alibaba Cloud API Key

1. Visit: https://dashscope.console.aliyun.com/
2. Login or create account
3. Go to "API Keys" section
4. Click "Create New API Key"
5. Copy the generated key

## Step 2: Configure API Key

Open `.env` file in the project root and replace:

```env
VITE_ALIBABA_API_KEY=your_api_key_here
```

With your actual API key:

```env
VITE_ALIBABA_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Run the Application

In the terminal, run:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Step 4: Create Your First Poster

1. **Upload Photo**: Click browse or drag-drop your photo
2. **Add Name** (optional): Enter your name
3. **Select Style**: Choose greeting style (e.g., Formal, Lucu, etc.)
4. **Generate**: Click "Generate Poster" button
5. **Download**: Click "Download Poster" to save

## 🎉 That's it! You're ready to create amazing Ramadan posters!

---

## Troubleshooting

### App tidak muncul?
- Check terminal for errors
- Make sure all dependencies installed: `npm install`
- Try refresh browser (Ctrl+R)

### Generate error?
- Verify API key is correct in `.env`
- Check internet connection
- Restart dev server after changing `.env`

### Download tidak jalan?
- Disable popup blocker
- Use Chrome/Edge browser
- Wait until poster fully generated

## 💡 Pro Tips

- Use photos with good lighting for best results
- Try different greeting styles for variety
- Add personal names to make it more meaningful
- Share with family and friends!

---

**Happy Creating! 🌙✨**
