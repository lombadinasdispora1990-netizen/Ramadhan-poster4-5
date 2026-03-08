# 🔌 API Reference - BarokahGen

## Alibaba Cloud Model Studio Integration

### Base Configuration

**Endpoint**: Singapore Region (International)
```
https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions
```

**Model**: Qwen Plus
```
qwen-plus
```

### Authentication

Header format:
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Request Format

```javascript
{
  model: "qwen-plus",
  messages: [
    {
      role: "system",
      content: "Kamu adalah pakar Copywriter Kreatif asal Indonesia yang ahli dalam budaya Ramadan..."
    },
    {
      role: "user",
      content: "Buat ucapan poster Ramadan singkat (maksimal 15 kata) untuk Ahmad dengan gaya Formal/Religius..."
    }
  ],
  temperature: 0.7,
  max_tokens: 50
}
```

### System Prompt

The core of our prompt engineering:

```
Kamu adalah pakar Copywriter Kreatif asal Indonesia yang ahli dalam budaya Ramadan. Tugasmu adalah membuat ucapan poster singkat (maksimal 15 kata) berdasarkan input pengguna. Gunakan gaya bahasa yang sesuai pilihan user: 'Lucu/Ngakak' (pakai slang Gen Z), 'Formal/Religius' (puitis dan penuh doa), atau 'Santai/Hangat'. Pastikan teks tersebut pas untuk diletakkan di poster digital.
```

### Greeting Types

| Type | Description | Style |
|------|-------------|-------|
| `formal` | Formal/Religius | Puitis dan penuh doa |
| `funny` | Lucu/Ngakak | Slang Gen Z, humor |
| `casual` | Santai/Hangat | Akrab dan hangat |
| `sahur` | Sahur | Semangat bangun sahur |
| `buka` | Buka Puasa | Menunggu berbuka |
| `lebaran` | Lebaran | Idul Fitri celebration |

### Response Format

Successful response:
```json
{
  "id": "chatcmpl-xxx",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Selamat menunaikan ibadah puasa. Semoga amal ibadah kita diterima di sisi-Nya."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 20,
    "total_tokens": 70
  }
}
```

### Error Handling

#### 401 Unauthorized
```
API key tidak valid. Periksa konfigurasi .env file Anda.
```

#### 429 Too Many Requests
```
Quota exceeded. Tunggu beberapa saat dan coba lagi.
```

#### 500 Server Error
```
Server error. Coba lagi nanti.
```

### Implementation Example

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization
apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.VITE_ALIBABA_API_KEY}`;
  return config;
});

// Call API
const response = await apiClient.post('', {
  model: 'qwen-plus',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  temperature: 0.7,
  max_tokens: 50,
});

const generatedText = response.data.choices[0].message.content;
```

### Rate Limits

Check your plan at [Alibaba Cloud Console](https://dashscope.console.aliyun.com/)

Typical limits:
- **Free Tier**: Limited requests per day
- **Paid Tier**: Higher limits based on pricing

### Best Practices

1. **Keep prompts concise**: Max 15 words output
2. **Use temperature 0.7**: Balanced creativity
3. **Handle errors gracefully**: User-friendly messages
4. **Cache responses**: Avoid duplicate API calls
5. **Validate inputs**: Check user data before sending

### Security Notes

⚠️ **Important**:
- Never expose API key in client-side code for production
- Use environment variables
- Consider server-side proxy for production apps
- Monitor API usage regularly

### Testing

Test your API key with curl:

```bash
curl -X POST https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "qwen-plus",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Resources

- [Alibaba Cloud Documentation](https://www.alibabacloud.com/help/en/model-studio)
- [Qwen Model Documentation](https://help.aliyun.com/zh/dashscope/developer-reference/)
- [API Pricing](https://www.alibabacloud.com/en/product/pricing/model-studio)

---

**Last Updated**: March 2026
**API Version**: v1 (Singapore Region)
