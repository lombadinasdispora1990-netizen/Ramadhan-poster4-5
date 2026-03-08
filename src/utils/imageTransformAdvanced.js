import { transformImage } from './api.js';
import axios from 'axios';

/**
 * Advanced Image Transformation Modes
 * Supports multiple artistic styles beyond Islamic attire
 */

/**
 * Transform image to 3D Pixar/Disney style
 */
export const transformTo3D = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to 3D style...');

    // Detect gender first
    const gender = await analyzeImageForStyle(imageUrl);

    // Avoid trademarked terms - use descriptive language instead
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';
    const prompt = `Transform this person into a cute 3D animated character, ${gender === 'male' ? 'young boy' : 'young girl'}, wearing traditional Indonesian Muslim clothing for Ramadan, ${gender === 'male' ? 'baju koko and peci cap' : 'colorful gamis and hijab'}, big expressive eyes, smooth 3D render, cute chibi proportions, warm lighting, festive Ramadan background with lanterns and crescent moon, vibrant colors, modern animation studio style, 3D character design, family-friendly animated film aesthetic${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('3D transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Anime/Manga style
 */
export const transformToAnime = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Anime style...');

    const gender = await analyzeImageForStyle(imageUrl);

    // Avoid trademarked terms - use descriptive language instead
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';
    const prompt = `Transform this person into an anime-style character, ${gender === 'male' ? 'handsome young man' : 'beautiful young woman'}, wearing Islamic attire for Ramadan, ${gender === 'male' ? 'modern baju koko' : 'elegant gamis with flowing hijab'}, detailed expressive eyes, soft cel shading, Japanese animation art style, warm sunset lighting, peaceful expression, high quality anime illustration, contemporary manga aesthetic${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Anime transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Oil Painting style
 */
export const transformToPainting = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Oil Painting style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';
    const prompt = `Transform this portrait into a classical oil painting, person wearing traditional Islamic clothing for Ramadan, ${gender === 'male' ? 'baju koko and songkok' : 'gamis syar\'i and hijab'}, renaissance painting style, visible brush strokes, rich warm colors, dramatic lighting, artistic masterpiece, museum quality, elegant and dignified${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Painting transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Watercolor style
 */
export const transformToWatercolor = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Watercolor style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';
    const prompt = `Transform this into a beautiful watercolor painting, person in Islamic attire for Ramadan, ${gender === 'male' ? 'white baju koko and black peci' : 'pastel gamis and colorful hijab'}, soft watercolor washes, dreamy atmosphere, light and airy, artistic splashes, gentle colors, ethereal quality${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Watercolor transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Cyberpunk style
 */
export const transformToCyberpunk = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Cyberpunk style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    // Avoid trademarked terms - use descriptive language instead
    const prompt = `Medium shot of this person, centered and positioned lower in the frame with massive empty space at the top, transform this into a futuristic sci-fi portrait, person wearing modern Islamic tech-wear for Ramadan 2077, ${gender === 'male' ? 'neon-lit baju koko with LED patterns' : 'high-tech gamis with holographic hijab'}, neon lights, dark background with purple and blue glow, science fiction aesthetic, digital art, dystopian future atmosphere, cybernetic enhancements, empty space at the top half of the image, character head must be well below the top edge${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Cyberpunk transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Free Fire style
 */
export const transformToFreeFire = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Free Fire style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The person\'s real face must remain 100% photorealistic and unaltered — preserve exact eye shape, nose bridge, jawline, skin tone, and every facial feature from the reference photo. Only the outfit, background, and body proportions should be stylized';
    const prompt = `This person as an elite Free Fire battle royale character, medium-full shot positioned in the lower two-thirds of the frame with dramatic sky above, ${gender === 'male' ? 'wearing a legendary Free Fire EVO bundle outfit reimagined as tactical Islamic attire — black-and-gold military baju koko with kevlar vest, tactical peci helmet with HUD visor, combat boots and utility belt' : 'wearing a premium Free Fire female bundle outfit reimagined as tactical Islamic combat gamis with body armor accents, a sleek armored hijab with built-in tactical headset, combat gloves and knee-high boots'}, holding an iconic Free Fire weapon (golden AK or M1887 shotgun with custom Ramadan skin), intense action pose, background of the Free Fire Bermuda map with an airdrop descending and Booyah fireworks in the sky, Garena Free Fire official character art quality, vibrant mobile game 3D render, cinematic battle royale atmosphere${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Free Fire transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Roblox style
 */
export const transformToRoblox = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Roblox style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';
    const prompt = `Transform this person into a Roblox-style 3D blocky avatar character, cute proportional blocky body with simple geometric shapes, ${gender === 'male' ? 'wearing a white baju koko outfit and peci cap' : 'wearing a colorful gamis outfit and hijab'}, Roblox game aesthetic, blocky hands and legs, standing in a colorful Ramadan-themed Roblox game world with mosques and lanterns, vibrant saturated colors, playful and fun atmosphere, 3D rendered game character, family-friendly${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Roblox transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Sketch/Pencil Drawing style
 */
export const transformToSketch = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Sketch style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';
    const prompt = `Transform this into a detailed pencil sketch drawing, person wearing Islamic clothing for Ramadan, ${gender === 'male' ? 'baju koko and peci' : 'gamis and hijab'}, hand-drawn illustration, graphite pencil on paper, fine line work, shading and hatching, artistic sketch, monochrome charcoal effect, classical drawing technique, portfolio-quality artwork${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Sketch transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Fantasy/RPG Character style
 */
export const transformToFantasy = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Fantasy RPG style...');

    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    const prompt = `Cinematic photorealistic portrait of this person as an epic fantasy RPG protagonist, character centered and positioned in the lower two-thirds of the frame with large empty space at the top, the person's face must be a 100% photorealistic human face with ZERO artistic distortion, wearing ornate Islamic fantasy attire for Ramadan, ${gender === 'male' ? 'embroidered ceremonial baju koko with golden accents and decorative peci' : 'elegant royal gamis with intricate patterns and embellished hijab'}, magical glowing effects, mystical atmosphere, high-end movie character design, dramatic lighting, heroic pose, enchanted armor elements, otherworldly beauty, cinematic fantasy aesthetic, character's head is far from the top edge, massive head room${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Fantasy transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Mobile Legends Hero style
 */
export const transformToMobileLegend = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Mobile Legend style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The person\'s real face must remain 100% photorealistic and unaltered — preserve exact eye shape, nose bridge, jawline, skin tone, and every facial feature from the reference photo. Only the outfit, background, and body proportions should be stylized';

    const prompt = `Cinematic photorealistic masterpiece portrait of this person reimagined as a legendary hero on the hero selection screen, medium-full shot positioned in the lower two-thirds of the frame with dramatic empty sky above, the person's face must be a 100% photorealistic human face with ZERO artistic distortion, ${gender === 'male' ? 'wearing ornate white-and-gold celestial battle armor inspired by Zilong and Yu Zhong, intricate Islamic geometric engravings on shoulder plates, a regal golden peci crown with glowing crescent emblem, flowing cape with Arabic calligraphy patterns' : 'wearing an elegant crystalline battle dress inspired by Lunox and Pharsa, shimmering silk gamis armor with diamond-shaped Islamic lattice patterns, a majestic flowing hijab made of luminous magical energy with gold trim'}, wielding a legendary weapon wreathed in golden crescent-moon energy, blue-and-gold UI skill effects swirling around (crescents, stars, geometric fractals), epic mythic glory rank aura, background of a hero selection arena with dramatic volumetric god-rays, official premium splash art quality, ultra-detailed photorealistic render, cinematic composition${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Mobile Legend transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to China Drama (Wuxia/Xianxia) style
 */
export const transformToChinaDrama = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to China Drama style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    const prompt = `Medium shot of this person in a China Drama (Wuxia/Xianxia) aesthetic, centered and positioned lower in the frame with massive empty space at the top, ${gender === 'male' ? 'wearing a noble white Baju Koko blended with traditional Chinese Hanfu elements, black songkok with jade ornament' : 'wearing an elegant flowing silk Gamis blended with Hanfu layers, premium silk hijab decorated with delicate Chinese floral hairpins'}, background of a peaceful bamboo forest and traditional Chinese pavilion with Ramadan lanterns (Fanous) hanging, soft ethereal lighting, scholarly and graceful atmosphere, peaceful expression, massive head room${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('China Drama transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Palm Oil Plantation style
 */
export const transformToPalmOil = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Palm Oil Plantation style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    const prompt = `Medium shot of this person standing in a beautiful lush green palm oil plantation in Indonesia, character centered and positioned lower in frame with space for the sky at the top, ${gender === 'male' ? 'wearing a neat Baju Koko and peci' : 'wearing a colorful modest Gamis and Hijab'}, natural golden hour sunlight filtering through palm fronds, peaceful countryside atmosphere, "Mudik" or "Leberan" vibe, realistic photography, sharp focus, massive head room${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Palm Oil transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Kamen Rider style
 */
export const transformToKamenRider = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Kamen Rider style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    const prompt = `Medium shot of this person as a Kamen Rider style armored hero, character positioned lower in the frame with massive empty space at the top, high-tech metallic armor suite with ${gender === 'male' ? 'green and gold Islamic geometric patterns (Arabesque)' : 'purple and gold patterns and a stylized metallic hijab-helmet design'}, glowing crescent moon emblem on chest, dynamic action lighting, tokusatsu aesthetic, metallic textures, cinematic lighting, dramatic background with Ramadan lanterns, massive head room${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Kamen Rider transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to "Greeting with CR7" style
 */
export const transformToCR7 = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to CR7 style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    const prompt = `Medium shot of this person standing next to Cristiano Ronaldo (CR7), both centered and positioned lower in the frame with massive empty space at the top, both wearing elegant traditional Indonesian Islamic attire, ${gender === 'male' ? 'the person wearing a white baju koko and peci' : 'the person wearing a silk gamis and elegant hijab'}, Cristiano Ronaldo wearing a matching premium white Thobe/Jubba and a friendly smile, Ronaldo has his arm around the person's shoulder in a friendly pose, background of a festive Ramadan hall with lanterns and "Marhaban ya Ramadan" decorations, cinematic lighting, photorealistic masterpiece, massive head room${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('CR7 transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Kpop Demon Slayer style
 */
export const transformToKpopDemonHunter = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Kpop Demon Slayer style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The person\'s real face must remain 100% photorealistic and unaltered — preserve exact eye shape, nose bridge, jawline, skin tone, and every facial feature from the reference photo. Only the outfit, background, and body proportions should be stylized';

    const prompt = `This person as a K-pop idol who is also a Demon Slayer Corps Hashira-level warrior, medium shot positioned lower in the frame with dramatic dark sky above, ${gender === 'male' ? 'wearing a sleek black-and-crimson haori (demon slayer uniform) reimagined as an Islamic techwear baju koko with geometric breathing-technique patterns glowing in teal and gold, dark leather tactical straps, black peci with Demon Slayer Corp emblem' : 'wearing an elegant dark violet haori-style gamis with flowing butterfly-wing accents inspired by Shinobu Kocho, intricate Islamic geometric patterns woven into the fabric glowing with magical energy, a stylish combat-ready hijab with flowing tails and golden ornaments'}, gripping a luminous Nichirin blade with a crescent-moon tsuba guard, visible breathing technique aura (total concentration — water or flame style swirling effects) around the body, background of a moonlit battlefield with wisteria flowers and Ramadan lanterns floating, authentic Demon Slayer anime atmosphere combined with K-pop idol charisma (perfect skin, dramatic eye-light, idol stage lighting), ufotable animation studio quality, ultra-detailed cinematic illustration${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Kpop Demon Slayer transformation failed:', error);
    throw error;
  }
};

/**
 * Transform image to Free Palestine solidarity style
 */
export const transformToPalestine = async (imageUrl, imageUrl2) => {
  try {
    console.log('🎨 Transforming to Palestine style...');
    const gender = await analyzeImageForStyle(imageUrl);
    const identityPreservation = ', CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos, 0% artistic alteration to the face, maintain identical eye shape, eyebrow thickness and shape, nose structure, and lip contour';

    const prompt = `Medium shot of this person in solidarity with Palestine, character positioned lower in the frame with massive empty space at the top, ${gender === 'male' ? 'wearing a white baju koko with a Palestinian Keffiyeh scarf around the neck' : 'wearing a modest gamis and hijab with a Palestinian Keffiyeh pattern'}, background of the majestic Al-Aqsa Mosque at sunset, waving Palestinian flags in the background, theme of peace and hope, cinematic photography, emotional and powerful atmosphere, massive head room${identityPreservation}`;

    const result = await transformImage(imageUrl, 'lebaran', gender, prompt, imageUrl2);
    return result;
  } catch (error) {
    console.error('Palestine transformation failed:', error);
    throw error;
  }
};

/**
 * Analyze image for style-appropriate gender detection
 */
const analyzeImageForStyle = async (imageUrl) => {
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

    return 'male';
  } catch (error) {
    console.warn('Gender detection failed, using default:', error);
    return 'male';
  }
};

/**
 * Universal transformation function that accepts mode parameter
 */
export const transformWithMode = async (imageUrl, mode, imageUrl2) => {
  const transformers = {
    'text-only': () => {
      // Text-only mode: don't transform, return original
      return Promise.resolve({ success: true, imageUrl: imageUrl, mode: 'text-only' });
    },
    'realistic': () => {
      // Import the original transformer
      return import('./imageTransform.js').then(mod =>
        mod.transformToIslamicAttire(imageUrl, imageUrl2)
      );
    },
    '3d': () => transformTo3D(imageUrl, imageUrl2),
    'anime': () => transformToAnime(imageUrl, imageUrl2),
    'painting': () => transformToPainting(imageUrl, imageUrl2),
    'watercolor': () => transformToWatercolor(imageUrl, imageUrl2),
    'cyberpunk': () => transformToCyberpunk(imageUrl, imageUrl2),
    'freefire': () => transformToFreeFire(imageUrl, imageUrl2),
    'roblox': () => transformToRoblox(imageUrl, imageUrl2),
    'sketch': () => transformToSketch(imageUrl, imageUrl2),
    'fantasy': () => transformToFantasy(imageUrl, imageUrl2),
    'ml': () => transformToMobileLegend(imageUrl, imageUrl2),
    'chinadrama': () => transformToChinaDrama(imageUrl, imageUrl2),
    'oilpalm': () => transformToPalmOil(imageUrl, imageUrl2),
    'kamenrider': () => transformToKamenRider(imageUrl, imageUrl2),
    'cr7': () => transformToCR7(imageUrl, imageUrl2),
    'kpop': () => transformToKpopDemonHunter(imageUrl, imageUrl2),
    'palestine': () => transformToPalestine(imageUrl, imageUrl2),
  };

  const transformer = transformers[mode];
  if (!transformer) {
    throw new Error(`Unknown transformation mode: ${mode}`);
  }

  return await transformer();
};

export default {
  transformTo3D,
  transformToAnime,
  transformToPainting,
  transformToWatercolor,
  transformToCyberpunk,
  transformToFreeFire,
  transformToRoblox,
  transformToSketch,
  transformToFantasy,
  transformToMobileLegend,
  transformToChinaDrama,
  transformToPalmOil,
  transformToKamenRider,
  transformToCR7,
  transformToKpopDemonHunter,
  transformToPalestine,
  transformWithMode,
};
