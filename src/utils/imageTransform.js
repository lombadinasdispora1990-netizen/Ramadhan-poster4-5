import { transformImage } from './api.js';
import axios from 'axios';

/**
 * Analyze photo and detect gender using Alibaba Cloud Qwen-VL model (Singapore region)
 * This is step 1: Vision analysis
 */
export const analyzeImageForGender = async (imageUrl) => {
  try {
    const apiKey = import.meta.env.VITE_ALIBABA_API_KEY;

    const response = await axios.post(
      '/api/alibaba/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'system',
            content: `You are an AI that detects gender from facial photos. Answer ONLY with "male" or "female" without any explanation.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              },
              {
                type: 'text',
                text: 'Is the person in this photo male or female? Answer only with one word: "male" or "female".'
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content.trim().toLowerCase();
      return content.includes('female') ? 'female' : 'male';
    }

    return 'male'; // Default fallback
  } catch (error) {
    console.warn('Gender detection failed, using default:', error);
    return 'male';
  }
};

/**
 * Main transformation function - combines analysis and transformation
 * Uses the new Wan2.1 multimodal API from api.js
 */
export const transformToIslamicAttire = async (imageUrl, imageUrl2) => {
  try {
    if (import.meta.env.DEV) {
      console.log('🔍 Step 1: Analyzing image for gender detection...');
    }

    // Step 1: Detect gender (using Singapore API)
    const gender = await analyzeImageForGender(imageUrl);
    if (import.meta.env.DEV) {
      console.log(`✓ Gender detected: ${gender}`);
    }

    // Step 2: Transform image using new Wan2.1 multimodal API
    if (import.meta.env.DEV) {
      console.log('🎨 Step 2: Transforming image with Wanx AI...');
    }
    const result = await transformImage(imageUrl, 'lebaran', gender, null, imageUrl2);

    if (import.meta.env.DEV) {
      console.log('✅ Transformation complete!');
    }
    return result;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Full transformation process failed:', error);
    }
    throw error;
  }
};

export default {
  analyzeImageForGender,
  transformToIslamicAttire,
};
