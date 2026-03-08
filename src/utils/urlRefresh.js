/**
 * URL Refresh Mechanism for Expired Signed URLs
 * 
 * Problem: Wan2.6 generates signed URLs with short expiration (1-5 minutes)
 * Solution: Generate fresh URLs on-demand before download/share
 */

import { transformImage } from './api.js';

/**
 * Cache for storing transformation parameters
 * Key: imageId, Value: transformation params
 */
const transformationCache = new Map();

/**
 * Store transformation parameters for later URL refresh
 * @param {string} imageId - Unique identifier for the generated image
 * @param {object} params - Transformation parameters
 */
export const cacheTransformationParams = (imageId, params) => {
  transformationCache.set(imageId, {
    ...params,
    cachedAt: Date.now()
  });
  console.log('💾 Cached transformation params for:', imageId);
};

/**
 * Get cached transformation parameters
 * @param {string} imageId - Unique identifier
 * @returns {object|null} Cached params or null
 */
export const getCachedTransformationParams = (imageId) => {
  const cached = transformationCache.get(imageId);
  if (!cached) return null;
  
  // Check if cache is too old (> 30 minutes)
  const age = Date.now() - cached.cachedAt;
  if (age > 30 * 60 * 1000) {
    console.warn('⚠️ Cache expired for image:', imageId);
    transformationCache.delete(imageId);
    return null;
  }
  
  return cached;
};

/**
 * Refresh expired signed URL by re-requesting transformation
 * @param {string} originalImageUrl - The expired URL
 * @param {string} imageId - Image identifier
 * @param {string} mode - Transformation mode (realistic, fantasy, etc.)
 * @param {string} uploadedImageBase64 - Original uploaded image
 * @returns {Promise<string>} Fresh signed URL
 */
export const refreshExpiredURL = async (originalImageUrl, imageId, mode, uploadedImageBase64) => {
  try {
    console.log('🔄 Attempting to refresh expired URL...');
    
    // Try to get cached params first
    const cachedParams = getCachedTransformationParams(imageId);
    
    if (cachedParams) {
      console.log('✅ Found cached params, re-using transformation settings');
      
      // Re-transform with same parameters
      const result = await transformImage(
        uploadedImageBase64,
        cachedParams.theme || 'lebaran',
        cachedParams.gender || 'male',
        cachedParams.customPrompt
      );
      
      if (result.success && result.imageUrl) {
        console.log('✅ Successfully refreshed URL');
        return result.imageUrl;
      }
    }
    
    // If no cache, try to extract info from original URL
    console.warn('⚠️ No cache found, cannot auto-refresh URL');
    console.warn('   User may need to regenerate poster');
    
    return null; // Cannot refresh
    
  } catch (error) {
    console.error('❌ Failed to refresh URL:', error.message);
    return null;
  }
};

/**
 * Check if URL is about to expire and refresh proactively
 * @param {string} imageUrl - Current signed URL
 * @param {number} thresholdSeconds - Refresh if expires in less than this many seconds
 * @returns {Promise<string|null>} New URL if refreshed, null otherwise
 */
export const proactiveURLRefresh = async (imageUrl, thresholdSeconds = 300) => {
  try {
    // Import analysis tool
    const { analyzeSignedURL } = await import('./urlDiagnostics.js');
    const analysis = analyzeSignedURL(imageUrl);
    
    if (analysis.error) {
      console.warn('⚠️ Cannot analyze URL for refresh:', analysis.error);
      return null;
    }
    
    // Check if URL is expiring soon
    if (analysis.expiresInSeconds !== null && analysis.expiresInSeconds < thresholdSeconds) {
      console.log(`⏰ URL expires in ${analysis.expiresInSeconds}s (< ${thresholdSeconds}s threshold)`);
      console.log('   Proactive refresh recommended');
      
      // Note: This would require storing transformation params
      // For now, just warn the user
      return null;
    }
    
    return null; // No refresh needed
    
  } catch (error) {
    console.error('Proactive refresh failed:', error.message);
    return null;
  }
};

/**
 * Get best available URL - either current or refreshed
 * @param {string} currentUrl - Current signed URL
 * @param {string} imageId - Image identifier  
 * @param {string} mode - Transformation mode
 * @param {string} uploadedImageBase64 - Original image
 * @returns {Promise<string>} Best available URL
 */
export const getBestAvailableURL = async (currentUrl, imageId, mode, uploadedImageBase64) => {
  // First, check if current URL is still valid
  try {
    const { analyzeSignedURL } = await import('./urlDiagnostics.js');
    const analysis = analyzeSignedURL(currentUrl);
    
    if (!analysis.error && !analysis.isExpired && analysis.expiresInSeconds > 60) {
      console.log('✅ Current URL still valid for', analysis.expiresInSeconds, 'seconds');
      return currentUrl; // Use current URL
    }
    
    // URL is expired or expiring soon, try to refresh
    console.warn('⚠️ Current URL expired/expiring, attempting refresh...');
    const freshUrl = await refreshExpiredURL(currentUrl, imageId, mode, uploadedImageBase64);
    
    if (freshUrl) {
      console.log('✅ Got fresh URL, using instead of expired one');
      return freshUrl;
    }
    
    // Refresh failed, fall back to current URL (might still work via proxy)
    console.warn('⚠️ Refresh failed, will try with expired URL');
    return currentUrl;
    
  } catch (error) {
    console.error('Failed to get best URL:', error.message);
    return currentUrl;
  }
};

/**
 * Clear transformation cache
 */
export const clearTransformationCache = () => {
  transformationCache.clear();
  console.log('🗑️ Transformation cache cleared');
};

export default {
  cacheTransformationParams,
  getCachedTransformationParams,
  refreshExpiredURL,
  proactiveURLRefresh,
  getBestAvailableURL,
  clearTransformationCache
};
