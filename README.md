# 🌙 BarokahGen - The Ultimate AI Ramadan Poster Generator

<div align="center">

![Ramadan Theme](https://img.shields.io/badge/Ramadan-2026-green?style=for-the-badge&logo=moon)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=for-the-badge&logo=tailwindcss)
![AI Powered](https://img.shields.io/badge/AI-Qwen_Plus-orange?style=for-the-badge)

**Generate beautiful Ramadan posters with AI in seconds!**

</div>

---

## ✨ Features

- 🤖 **AI-Powered**: Generates creative Ramadan greetings using Alibaba Cloud Qwen Plus model
- 📸 **Photo Upload**: Upload your own photos for personalized posters
- 🕌 **NEW - Islamic Attire Transformation**: AI-powered transformation to Islamic clothing (pria: koko + kupiah, wanita: gamis + jilbab)
- 🎨 **Multiple Styles**: Choose from 6 different greeting styles (Formal, Funny, Casual, Sahur, Buka, Lebaran)
- 📱 **Instagram Ready**: Posters are generated in 4:5 aspect ratio, perfect for Instagram
- 💾 **Instant Download**: Download posters directly as high-quality PNG images
- 🎭 **Beautiful UI**: Modern, responsive design with smooth animations
- ⚡ **Fast & Easy**: Generate posters in seconds

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Image Processing**: html2canvas
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AI API**: Alibaba Cloud Model Studio (Qwen Plus)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Alibaba Cloud API Key (get it from [Alibaba Cloud Console](https://dashscope.console.aliyun.com/))
- **Replicate API Key** (get it from [Replicate](https://replicate.com/account/api-tokens)) - For AI image transformation

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Ramadhan-poster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit the `.env` file and add BOTH API keys:
   ```env
   # Alibaba Cloud API for Text Generation
   VITE_ALIBABA_API_KEY=your_alibaba_api_key_here
   VITE_API_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions
   VITE_MODEL_NAME=qwen-plus
   
   # Replicate API for Image Transformation
   VITE_REPLICATE_API_KEY=your_replicate_api_key_here
   ```
   
   📖 **Get your Replicate API key**: See [REPLICATE_SETUP.md](REPLICATE_SETUP.md) for detailed guide

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   The app will be available at `http://localhost:3000`

## 📖 How to Use

### Basic Usage:

1. **Upload Photo**: Drag & drop or browse to upload your photo
2. **Enter Name** (Optional): Add your name or sender name
3. **Choose Style**: Select from 6 greeting styles:
   - 🕌 **Formal/Religius**: Puitis dan penuh doa
   - 😂 **Lucu/Ngakak**: Slang Gen Z yang humoris
   - ☕ **Santai/Hangat**: Akrab dan hangat
   - 🌙 **Sahur**: Semangat bangun sahur
   - 🍽️ **Buka Puasa**: Menunggu berbuka
   - 🎉 **Lebaran**: Idul Fitri
4. **Generate Poster**: Click "Generate Poster" button
5. **Download**: Click "Download Poster" to save as PNG

### ✨ AI Islamic Attire Transformation:

Fitur baru! Transformasi foto Anda dengan busana Islami secara otomatis:

1. Upload foto wajah/potret yang jelas
2. Klik "Generate Poster"
3. AI akan otomatis:
   - Menganalisis gender (pria/wanita)
   - Mengaplikasikan busana Islami yang sesuai:
     - **Pria**: Baju koko + kupiah
     - **Wanita**: Gamis syar'i + jilbab
4. Download poster dengan foto yang sudah ditransformasi

📖 **Read more**: See [ISLAMIC_ATTIRE_TRANSFORMATION.md](ISLAMIC_ATTIRE_TRANSFORMATION.md) for detailed guide

## 🎨 Greeting Styles Explained

### Formal/Religius
Gaya puitis dan penuh doa, cocok untuk keluarga besar atau rekan kerja.

**Example Output:**
> "Selamat menunaikan ibadah puasa. Semoga amal ibadah kita diterima di sisi-Nya."

### Lucu/Ngakak
Menggunakan slang Gen Z yang lucu dan menghibur.

**Example Output:**
> "Puasi dong, biar auto masuk surga tanpa antri! Gaspol!"

### Santai/Hangat
Gaya akrab dan hangat untuk teman dekat.

**Example Output:**
> "Ramadan udah depan mata. Siap-siap ngabuburit seru bareng temen!"

## 🔧 Configuration

### Getting Alibaba Cloud API Key

1. Visit [Alibaba Cloud DashScope](https://dashscope.console.aliyun.com/)
2. Sign up or login to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in `.env` file

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ALIBABA_API_KEY` | Your Alibaba Cloud API key | Required |
| `VITE_API_BASE_URL` | API endpoint URL | Singapore region |
| `VITE_MODEL_NAME` | Model to use | `qwen-plus` |

## 📁 Project Structure

```
Ramadhan-poster/
├── public/
│   └── ramadan-icon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation with logo
│   │   ├── HeroSection.jsx     # Upload & form inputs
│   │   ├── PosterPreview.jsx   # Poster preview & download
│   │   └── ActionButtons.jsx   # Generate button & actions
│   ├── store/
│   │   └── useAppStore.js      # Zustand state management
│   ├── utils/
│   │   ├── api.js              # API integration
│   │   └── promptEngine.js     # Prompt engineering
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── .env.example                # Example env file
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Features Detail

### Upload Functionality
- Support JPG, PNG, WebP formats
- Drag & drop interface
- Image preview before generation
- Automatic file validation

### Poster Design
- **Aspect Ratio**: 4:5 (Instagram Portrait)
- **Overlay**: Dark gradient for text readability
- **Typography**: Bold, centered text with drop shadow
- **Decoration**: Ramadan-themed decorative elements
- **Footer**: Custom sender name and hashtags

### Download Feature
- High-quality PNG export (2x scale)
- CORS support for external images
- Automatic file naming with timestamp
- Direct browser download

## 🔐 Security Notes

- **Never commit `.env` file** to version control
- Keep your API key confidential
- API calls are made client-side (for demo purposes)
- For production, consider moving API calls to server-side

## 🐛 Troubleshooting

### "API key tidak valid"
- Make sure you've added the correct API key in `.env`
- Restart the development server after changing `.env`
- Check if there are extra spaces in the API key

### "Tidak ada respon dari server"
- Check your internet connection
- Verify the API base URL is correct
- Try refreshing the page

### Download tidak berfungsi
- Ensure popup blocker is disabled
- Try a different browser (Chrome recommended)
- Check if the image is fully loaded

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🚀 Build for Production

```bash
npm run build
```

The optimized build files will be in the `dist/` folder.

## 📄 License

This project is created for educational purposes during Ramadan.

## 🙏 Credits

- **AI Model**: Alibaba Cloud Qwen Plus
- **Icons**: Lucide React
- **UI Components**: Built with React, Tailwind CSS, Framer Motion

## 💡 Tips for Best Results

1. **Use high-quality photos** with good lighting
2. **Choose contrasting images** so text is readable
3. **Select appropriate style** for your audience
4. **Add personal touch** with custom sender names
5. **Test different styles** to see which works best

## 🎨 Future Enhancements

- [ ] Multiple language support
- [ ] More greeting styles
- [ ] Custom color themes
- [ ] Text font selection
- [ ] Filter effects for photos
- [ ] Batch poster generation
- [ ] Social media direct sharing

---

<div align="center">

**Made with ❤️ for the Muslim Community**

*BarokahGen - Making Ramadan greetings more beautiful*

🌙✨🕌

</div>
