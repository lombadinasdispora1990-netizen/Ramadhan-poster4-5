import axios from 'axios';
import { supabase } from './supabase';

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
 * Utility to retry API calls with exponential backoff
 */
const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;

    // Only retry on transient errors or rate limits
    const isRetryable = !error.response ||
      error.response.status === 429 ||
      error.response.status >= 500;

    if (!isRetryable) throw error;

    console.warn(`🔄 API failed, retrying in ${delay}ms... (${retries} left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

/**
 * Clean generated text from AI response
 */
export const cleanGeneratedText = (text) => {
  if (!text) return '';

  let cleaned = text.trim();

  // Remove markdown formatting
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');

  // Remove common AI prefixes/suffixes
  cleaned = cleaned.replace(/\*?\(?\d+\s*kata\)?\*?/gi, '');
  cleaned = cleaned.replace(/\(.*?kata.*?\)/gi, '');
  cleaned = cleaned.replace(/^(Tentu!|Here is|Here's|Berikut|Ini adalah|Nah,|Oke,)\s*/i, '');

  // Extract the most likely greeting line
  const lines = cleaned.split('\n');
  const greetingLine = lines.find(line => {
    const lowerLine = line.toLowerCase().trim();
    if (lowerLine.includes('berikut') ||
      lowerLine.includes('ucapan') ||
      lowerLine.includes('singkat') ||
      lowerLine.includes('≤15 kata') ||
      lowerLine.includes('gaya') ||
      lowerLine.includes('maksimal') ||
      lowerLine.includes('contoh') ||
      lowerLine.includes('aturan')) {
      return false;
    }
    return line.trim().length > 0 && line.length < 120;
  });

  if (greetingLine) {
    cleaned = greetingLine.trim();
  }

  // Final cleanup
  cleaned = cleaned.replace(/^["']|["']$/g, '');
  cleaned = cleaned.replace(/\(\d+\)/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Word limit enforcement
  const words = cleaned.split(/\s+/);
  if (words.length > 20) {
    cleaned = words.slice(0, 18).join(' ') + '...';
  }

  return cleaned;
};

/**
 * Transform image using Alibaba Cloud Wan2.1 (Image-to-Image)
 * @param {string} originalImageBase64 - Base64 encoded original image
 * @param {string} theme - 'sahur', 'bukapuasa', or 'lebaran'
 * @param {string} gender - 'male' or 'female'
 * @param {string} customPrompt - Optional custom prompt for specific styles
 * @param {string} image2Base64 - Optional second reference image for better resemblance
 * @returns {Promise<object>} Transformation result with image URL
 */
export const transformImage = async (originalImageBase64, theme, gender, customPrompt, image2Base64) => {
  return withRetry(async () => {
    // Get environment variables
    const API_KEY = import.meta.env.VITE_ALIBABA_API_KEY;
    const WANX_MODEL = import.meta.env.VITE_WANX_MODEL || 'wan2.1-t2i-720p';

    // Import promptEngine to build smart prompt
    const { buildRamadanPrompt } = await import('./promptEngine.js');
    const engineeredPrompt = customPrompt || buildRamadanPrompt(theme, gender);

    if (import.meta.env.DEV) {
      console.log('🎨 Starting image transformation (Wan 2.1)...');
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

    if (img2) {
      content.push({ image: `data:image/jpeg;base64,${img2}` });
    }

    const payload = {
      model: WANX_MODEL,
      input: {
        messages: [{ role: 'user', content: content }]
      },
      parameters: {
        negative_prompt: 'low quality, worst quality, deformed, distorted, disfigured, bad anatomy, western clothes, revealing clothes, cartoon, anime, painting, illustration, 3d render, cgi, messy hair, head at the top edge, cropped head, close-up, extreme close-up, forehead at top edge, face filling the frame',
        size: '1K',
        n: 1,
        seed: Math.floor(Math.random() * 2147483647),
        watermark: false,
        url_expiration: 3600
      }
    };

    const response = await axios.post(wanxEndpoint, payload, {
      headers,
      timeout: 120000
    });

    if (response.data.output && response.data.output.choices && response.data.output.choices.length > 0) {
      const respContent = response.data.output.choices[0].message?.content;
      if (respContent && Array.isArray(respContent)) {
        const imageObj = respContent.find(item => item.image);
        if (imageObj && imageObj.image) {
          return {
            success: true,
            imageUrl: imageObj.image,
            theme: theme,
            gender: gender,
            provider: 'Wan2.1-image'
          };
        }
      }
    }

    throw new Error('No image URL in Wan 2.1 response');
  });
};

/**
 * Call Alibaba Cloud Qwen API to generate Ramadan greeting text
 * @param {string} userName - User's name
 * @param {string} greetingType - Type of greeting (formal, funny, casual)
 * @param {string} systemPrompt - System prompt for the AI
 * @returns {Promise<string>} Generated greeting text
 */
export const generateGreetingText = async (userName, greetingType, systemPrompt) => {
  return withRetry(async () => {
    // Sanitize user name to prevent prompt injection
    const sanitizedName = (userName || 'teman')
      .replace(/[^\w\s.,!?-]/g, '')
      .substring(0, 30)
      .trim();

    const userPrompt = `Buat ucapan poster Ramadan singkat (maksimal 15 kata) untuk ${sanitizedName} dengan gaya ${greetingType}.`;

    const response = await apiClient.post('', {
      model: import.meta.env.VITE_MODEL_NAME || 'qwen-plus',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('No response from AI API');
    }
  });
};

export default apiClient;

/**
 * Save generation to Supabase database
 * @param {object} generationData - Generation data to save
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const saveGenerationToDB = async (generationData) => {
  try {
    console.log('💾 [saveGenerationToDB] Starting save process...');

    // Get current user - use getUser() for more reliability than getSession()
    // as it verifies with the server
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('❌ [saveGenerationToDB] Auth error:', userError);
      return { success: false, error: userError };
    }

    if (!user) {
      console.warn('⚠️ [saveGenerationToDB] No authenticated user, skipping save to database');
      return { success: false, error: new Error('User not authenticated') };
    }

    const userId = user.id;
    console.log('✅ [saveGenerationToDB] User verified:', userId);

    // Prepare data for database
    const dbData = {
      user_id: userId,
      original_image_url: generationData.originalImage || null,
      transformed_image_url: generationData.transformedImage || null,
      uploaded_image2_url: generationData.uploadedImage2 || null,
      user_name: generationData.userName || null,
      greeting_type: generationData.greetingType || 'formal',
      generation_mode: generationData.mode || 'realistic',
      generated_text: generationData.text || '',
      poster_image_url: generationData.posterBase64
    };

    // Save to database
    const { data, error } = await supabase
      .from('generations')
      .insert([dbData]);

    if (error) {
      console.error('❌ [saveGenerationToDB] Database error:', error);
      throw error;
    }

    console.log('✅ [saveGenerationToDB] Generation saved successfully!');
    return { success: true, data };
  } catch (error) {
    console.error('❌ [saveGenerationToDB] Error saving generation:', error.message);
    return { success: false, error };
  }
};

/**
 * Delete generation from database
 * @param {string} generationId - Generation ID to delete
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const deleteGenerationFromDB = async (generationId) => {
  try {
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', generationId);

    if (error) throw error;

    console.log('✅ Generation deleted from database');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting generation:', error.message);
    return { success: false, error };
  }
};

export const createMayarPayment = async (userId, email) => {
  try {
    const MAYAR_API_KEY = import.meta.env.VITE_MAYAR_API_KEY;
    
    // Use the proxy to avoid CORS and potential header issues
    const response = await axios.post('/api/mayar/hl/v1/payment/create', {
      name: 'BarokahGen Pro Subscription',
      amount: 100000,
      description: `Pro Subscription for user ${email}`,
      email: email,
      // Metadata allows us to link the payment back to the user in the webhook
      metadata: {
        user_id: userId,
        plan: 'monthly_100k'
      },
      // Optional: redirect user back after payment
      callback_url: window.location.origin,
      // Fixed amount payment
      redirect_url: window.location.origin
    }, {
      headers: {
        'Authorization': `Bearer ${MAYAR_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data && response.data.data.link) {
      return {
        success: true,
        url: response.data.data.link
      };
    }

    throw new Error('Failed to get payment link from Mayar');
  } catch (error) {
    console.error('Mayar API error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};
