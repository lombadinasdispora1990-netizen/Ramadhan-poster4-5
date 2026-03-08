/**
 * Convert an external image URL to a base64 data URL.
 * Must be called immediately after receiving the URL (while signed URL is still valid).
 * Uses the Vite proxy middleware to bypass CORS.
 */

/**
 * Convert image URL to base64 data URL via server proxy
 * @param {string} imageUrl - The external image URL (e.g. Alibaba OSS signed URL)
 * @returns {Promise<string>} Base64 data URL (data:image/png;base64,...)
 */
export const convertImageUrlToBase64 = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error('No image URL provided');
  }

  // Already a data URL — return as-is
  if (imageUrl.startsWith('data:')) {
    console.log('✅ Image is already a data URL, using directly');
    return imageUrl;
  }

  // Already a blob URL — convert blob to data URL
  if (imageUrl.startsWith('blob:')) {
    console.log('🔄 Converting blob URL to data URL...');
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blobToDataUrl(blob);
  }

  console.log('🔄 Converting external image to base64...');
  console.log('   Source URL:', imageUrl.substring(0, 100) + '...');

  // Use the Vite proxy middleware to fetch the image server-side
  const safeUrl = encodeURIComponent(imageUrl);
  const proxyUrl = `/api/proxy-image?url=${safeUrl}`;

  console.log('📡 Fetching via proxy...');

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Proxy fetch failed with status: ${response.status}`);
  }

  const blob = await response.blob();

  // Validate: must be at least 5KB to be a real image
  if (blob.size < 5000) {
    // Try to read as text to diagnose
    const text = await blob.text();
    if (text.toLowerCase().includes('<!doctype html>') || text.toLowerCase().includes('<html')) {
      throw new Error('Proxy returned HTML instead of image — signed URL likely expired');
    }
    throw new Error(`Image too small (${blob.size} bytes) — likely not a valid image`);
  }

  // Validate content type
  if (!blob.type.startsWith('image/')) {
    console.warn('⚠️ Unexpected content type:', blob.type, '— attempting conversion anyway');
  }

  const dataUrl = await blobToDataUrl(blob);

  console.log('✅ Converted to base64 data URL, size:', Math.round(blob.size / 1024), 'KB');

  return dataUrl;
};

/**
 * Convert a Blob to a data URL string
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read blob as data URL'));
    reader.readAsDataURL(blob);
  });
};

export default { convertImageUrlToBase64 };
