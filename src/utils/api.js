import axios from 'axios';

// Create axios instance with base configuration for text API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header interceptor for text API
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_ALIBABA_API_KEY;
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Transform image using Alibaba Cloud Wan2.1 (Image-to-Image)
 * Uses the correct multimodal-generation endpoint
 * @param {string} originalImageBase64 - Base64 encoded original image
 * @param {string} theme - 'sahur', 'bukapuasa', or 'lebaran'
 * @param {string} gender - 'male' or 'female'
 * @param {string} customPrompt - Optional custom prompt for specific styles
 * @param {string} image2Base64 - Optional second reference image for better resemblance
 * @returns {Promise<object>} Transformation result with image URL
 */
export const transformImage = async (originalImageBase64, theme, gender, customPrompt, image2Base64) => {
  try {
    // Get environment variables
    const API_KEY = import.meta.env.VITE_ALIBABA_API_KEY;
    const WANX_MODEL = import.meta.env.VITE_WANX_MODEL || 'wan2.1-t2i-720p'; // Updated to Wan 2.1 which is stronger

    // Import promptEngine to build smart prompt
    const { buildRamadanPrompt } = await import('./promptEngine.js');
    const engineeredPrompt = customPrompt || buildRamadanPrompt(theme, gender);

    if (import.meta.env.DEV) {
      console.log('🎨 Starting image transformation...');
      console.log('Theme:', theme);
      console.log('Gender:', gender);
      console.log('Prompt:', engineeredPrompt);
    }

    // Use the correct Singapore endpoint for Wan2.1
    const wanxEndpoint = '/api/alibaba/api/v1/services/aigc/multimodal-generation/generation';

    // Configure headers
    const headers = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    };

    // Convert base64 to proper format for Wan2.1
    const cleanBase64 = (b64) => {
      if (!b64) return null;
      return b64.startsWith('data:') ? b64.split(',')[1] : b64;
    };

    const img1 = cleanBase64(originalImageBase64);
    const img2 = cleanBase64(image2Base64);

    // Build content array
    const content = [
      { text: engineeredPrompt },
      { image: `data:image/jpeg;base64,${img1}` }
    ];

    // Add second reference photo if provided (for better resemblance as requested)
    if (img2) {
      if (import.meta.env.DEV) {
        console.log('📸 Adding second reference image for face detail...');
      }
      content.push({ image: `data:image/jpeg;base64,${img2}` });
    }

    // Payload data using Wan2.1 image-to-image format
    const payload = {
      model: WANX_MODEL,
      input: {
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      },
      parameters: {
        negative_prompt: 'low quality, worst quality, deformed, distorted, disfigured, bad anatomy, western clothes, revealing clothes, cartoon, anime, painting, illustration, 3d render, cgi, messy hair, head at the top edge, cropped head, close-up, extreme close-up, forehead at top edge, face filling the frame',
        size: '1K', // 1280*1280
        n: 1,
        seed: Math.floor(Math.random() * 2147483647),
        watermark: false,
        url_expiration: 3600
      }
    };

    if (import.meta.env.DEV) {
      console.log("📡 Mengirim request ke Alibaba Cloud Wan2.6...");
      console.log('Endpoint:', wanxEndpoint);
      console.log('Payload:', JSON.stringify(payload, null, 2).substring(0, 500) + '...');
    }

    const response = await axios.post(wanxEndpoint, payload, {
      headers,
      timeout: 120000 // 2 minutes timeout for image generation
    });

    if (import.meta.env.DEV) {
      console.log('📥 Response received:', response.data);
    }

    // Parse response based on Wan2.6 image-to-image format
    // Structure: output.choices[].message.content[].image
    if (response.data.output &&
      response.data.output.choices &&
      response.data.output.choices.length > 0) {

      const content = response.data.output.choices[0].message?.content;

      if (content && Array.isArray(content)) {
        // Find the image in content array
        const imageObj = content.find(item => item.image);

        if (imageObj && imageObj.image) {
          const imageUrl = imageObj.image;
          console.log('✅ Image transformation successful!');
          console.log('Image URL:', imageUrl);

          return {
            success: true,
            imageUrl: imageUrl,
            theme: theme,
            gender: gender,
            provider: 'Wan2.6-image'
          };
        }
      }
    }

    console.error('❌ No image found in response');
    console.error('Full response:', JSON.stringify(response.data, null, 2));
    throw new Error('No image URL in Wan2.6 response');
  } catch (error) {
    console.error("Gagal mentransformasi gambar:", error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received:', error.request);
      console.error('This might be a network or CORS issue');
    }
    console.error('Error details:', error.code);
    throw error;
  }
};

/**
 * Call Alibaba Cloud Qwen API to generate Ramadan greeting text
 * @param {string} userName - User's name
 * @param {string} greetingType - Type of greeting (formal, funny, casual)
 * @param {string} systemPrompt - System prompt for the AI
 * @returns {Promise<string>} Generated greeting text
 */
export const generateGreetingText = async (userName, greetingType, systemPrompt) => {
  try {
    // Sanitize user name to prevent prompt injection
    const sanitizedName = (userName || 'teman')
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .substring(0, 30) // Limit length
      .trim();

    const userPrompt = `Buat ucapan poster Ramadan singkat (maksimal 15 kata) untuk ${sanitizedName} dengan gaya ${greetingType}.`;

    if (import.meta.env.DEV) {
      console.log('📝 Prompt sent to AI:', userPrompt);
    }
    const response = await apiClient.post('', {
      model: import.meta.env.VITE_MODEL_NAME || 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('No response from API');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default apiClient;
