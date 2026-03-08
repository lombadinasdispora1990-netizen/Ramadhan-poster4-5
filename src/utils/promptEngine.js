/**
 * Prompt Engineering for BarokahGen - Ramadan Theme Transformation
 * Creates detailed prompts for AI image transformation with Islamic attire
 */

/**
 * Build Ramadan-themed prompt for image transformation
 * @param {string} theme - 'sahur', 'bukapuasa', or 'lebaran'
 * @param {string} gender - 'male' or 'female'
 * @returns {string} Engineered prompt for AI image generation
 */
export const buildRamadanPrompt = (theme, gender) => {
  // 1. Menentukan Pakaian & Riasan berdasarkan Gender
  const attire = gender === 'male'
    ? "wearing a highly detailed traditional Indonesian Baju Koko (Islamic shirt) in white or cream color, wearing a black Peci/Songkok cap on head, neat and handsome appearance, peaceful Islamic expression"
    : "8k photorealistic portrait, wearing a beautiful elegant modest Islamic silk gamis and premium hijab covering hair and neck gracefully, natural soft Ramadan makeup, serene and graceful expression, MUST keep identical facial features, same face shape, eye color, and nose structure from the original reference photos to ensure high resemblance";

  // 2. Menentukan Latar Belakang (Background) berdasarkan Tema
  let background = "";
  if (theme === 'sahur') {
    background = "warm pre-dawn sahur lighting, dining table with traditional Indonesian Suhoor meal, softly glowing Fanous (Ramadan lantern), cozy early morning atmosphere, warm golden hour lighting";
  } else if (theme === 'bukapuasa') {
    background = "beautiful sunset lighting for breaking fast, a table full of dates (kurma) and sweet drinks, vibrant and warm atmosphere, breaking fast scene, golden hour glow";
  } else { // lebaran
    background = "festive Eid al-Fitr celebration background, golden crescent moon in night sky, twinkling stars, traditional Ketupat decorations, sparkling lights, celebratory atmosphere, Eid Mubarak";
  }

  // 3. CRITICAL: Emphasize facial feature preservation for both genders
  const facialPreservation = "CRITICAL IDENTITY PRESERVATION: The face must be an EXACT photographic replica of the person in the reference photos. 0% artistic alteration to the face itself. Maintain identical eye shape, eyebrow thickness and shape, nose structure, lip contour, and cheekbones. Every unique facial detail must be preserved with 100% fidelity to ensure maximum resemblance. The person should be instantly recognizable as a real-world person, even if the surrounding environment is artistic.";

  // 4. Quality & Composition boosters
  const qualityBoost = "Medium shot, centered portrait with massive overhead space, head positioned well below the top edge of the frame, professional photography, photorealistic masterpiece, ultra high quality, sharp focus, studio lighting, 8k resolution, highly detailed, realistic skin texture, natural colors";


  // 5. Combine all elements
  return `A highly realistic professional portrait photograph of a person, ${attire}. The person is placed in a ${background}. ${facialPreservation}. ${qualityBoost}. Ramadan aesthetic, cinematic lighting.`;
};

/**
 * Get greeting type description for text generation
 * @param {string} type - greeting type
 * @returns {string} description
 */
export const getGreetingTypeDescription = (type) => {
  const descriptions = {
    formal: 'Formal/Religius (puitis dan penuh doa)',
    funny: 'Lucu/Ngakak (pakai slang Gen Z)',
    casual: 'Santai/Hangat (akrab dan hangat)',
    sahur: 'Sahur (semangat bangun sahur)',
    buka: 'Buka Puasa (menunggu berbuka)',
    mudik: 'Mudik (perjalanan pulang kampung)',
    lebaran: 'Lebaran (Idul Fitri)',
  };

  return descriptions[type] || descriptions.formal;
};

/**
 * Get system prompt for text generation
 * @returns {string} System prompt
 */
export const getSystemPrompt = () => {
  return `Kamu adalah pakar Copywriter Kreatif Ramadan profesional. Tugasmu adalah membuat SATU kalimat ucapan poster Ramadan yang indah dan bermakna.

ATURAN PENTING:
1. Buat HANYA 1 kalimat pendek (maksimal 15 kata)
2. JANGAN tambahkan penjelasan, komentar, atau catatan apapun
3. JANGAN gunakan format markdown (bold, italic, dll)
4. JANGAN tulis "Tentu!", "Berikut", atau preamble lainnya
5. LANGSUNG berikan kalimat ucapan saja
6. Jangan hitung jumlah kata di akhir
7. Fokus pada keindahan bahasa dan makna yang dalam

CONTOH YANG BENAR:
✅ "Selamat menunaikan ibadah puasa, mohon maaf lahir dan batin."
✅ "Ramadan مبارك, semoga keberkahan menyertai kita semua."
✅ "Taqabbalallahu minna wa minkum, selamat Hari Raya Idul Fitri."

CONTOH YANG SALAH:
❌ "Tentu! Berikut ucapan: Selamat berpuasa" (ada preamble)
❌ "Selamat berpuasa **(12 kata)**" (ada catatan jumlah kata)
❌ "**Selamat** berpuasa" (format markdown)`;
};

/**
 * Build complete prompt for text API call
 * @param {string} userName 
 * @param {string} greetingType 
 * @returns {object} Prompt configuration
 */
export const buildPrompt = (userName, greetingType) => {
  const systemPrompt = getSystemPrompt();
  const typeDescription = getGreetingTypeDescription(greetingType);

  const sanitizedName = (userName || 'teman')
    .replace(/[^\w\s.,!?-]/g, '')
    .substring(0, 30)
    .trim();

  return {
    system: systemPrompt,
    user: `Buat ucapan poster Ramadan singkat (maksimal 15 kata) untuk "${sanitizedName}" dengan gaya ${typeDescription}. Fokus pada keindahan bahasa dan makna yang dalam.`
  };
};

export default {
  buildRamadanPrompt,
  getGreetingTypeDescription,
  getSystemPrompt,
  buildPrompt,
};
