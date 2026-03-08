/**
 * URL Expiration Diagnostic Tool for Alibaba Cloud OSS
 * Helps investigate signed URL expiration issues
 */

/**
 * Parse and analyze an Alibaba Cloud OSS signed URL
 * @param {string} url - The signed OSS URL
 * @returns {object} Parsed URL information including expiration
 */
export const analyzeSignedURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { error: 'Invalid URL provided' };
  }

  try {
    // First, decode the URL if it's encoded
    let decodedUrl = url;
    try {
      // Try to decode if it's encoded
      decodedUrl = decodeURIComponent(url);
    } catch (e) {
      // If decoding fails, use original URL
      console.warn('URL decode failed, using original:', e.message);
    }
    
    // Parse URL parameters
    let urlObj;
    try {
      urlObj = new URL(decodedUrl);
    } catch (e) {
      console.error('Failed to create URL object:', e.message);
      console.error('URL being parsed:', decodedUrl.substring(0, 200));
      return {
        error: 'Failed to parse URL structure',
        message: e.message,
        url: url
      };
    }
    
    const params = new URLSearchParams(urlObj.search);

    // Extract key parameters
    const expires = params.get('Expires');
    const ossAccessKeyId = params.get('OSSAccessKeyId');
    const signature = params.get('Signature');

    // Convert Expires timestamp to Date
    let expirationDate = null;
    let isExpired = false;
    let timeRemaining = null;
    let expiresInSeconds = null;

    if (expires) {
      const expiresTimestamp = parseInt(expires);
      expirationDate = new Date(expiresTimestamp * 1000); // Convert to milliseconds
      const now = new Date();
      timeRemaining = expirationDate.getTime() - now.getTime();
      expiresInSeconds = Math.floor(timeRemaining / 1000);
      isExpired = timeRemaining <= 0;
    }

    return {
      fullUrl: url,
      baseUrl: urlObj.origin + urlObj.pathname,
      hasExpires: !!expires,
      expiresTimestamp: expires,
      expirationDate: expirationDate,
      expirationDateFormatted: expirationDate ? expirationDate.toLocaleString() : null,
      isExpired: isExpired,
      timeRemainingMs: timeRemaining,
      expiresInSecondss: expiresInSeconds,
      expiresInFormatted: formatTimeRemaining(timeRemaining),
      hasAccessKeyId: !!ossAccessKeyId,
      accessKeyId: ossAccessKeyId,
      hasSignature: !!signature,
      signature: signature,
      allParams: Array.from(params.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}),
      diagnostics: generateDiagnostics({
        expires,
        ossAccessKeyId,
        signature,
        isExpired,
        expiresInSeconds
      })
    };
  } catch (error) {
    return {
      error: 'Failed to parse URL',
      message: error.message,
      url: url
    };
  }
};

/**
 * Format time remaining in human-readable format
 */
const formatTimeRemaining = (ms) => {
  if (ms === null) return 'Unknown';
  if (ms <= 0) return 'EXPIRED';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Generate diagnostic messages based on URL analysis
 */
const generateDiagnostics = ({ expires, ossAccessKeyId, signature, isExpired, expiresInSeconds }) => {
  const diagnostics = [];

  // Check if URL has required parameters
  if (!expires) {
    diagnostics.push({
      level: 'error',
      message: 'Missing Expires parameter - URL may not be properly signed'
    });
  }

  if (!ossAccessKeyId) {
    diagnostics.push({
      level: 'error',
      message: 'Missing OSSAccessKeyId parameter - authentication will fail'
    });
  }

  if (!signature) {
    diagnostics.push({
      level: 'error',
      message: 'Missing Signature parameter - request will be rejected'
    });
  }

  // Check expiration status
  if (isExpired) {
    diagnostics.push({
      level: 'critical',
      message: `URL EXPIRED! This signed URL is no longer valid`
    });
    diagnostics.push({
      level: 'warning',
      message: 'Need to regenerate the signed URL with fresh expiration'
    });
  } else if (expiresInSeconds !== null) {
    if (expiresInSeconds < 60) { // Less than 1 minute
      diagnostics.push({
        level: 'critical',
        message: `URL expires in ${expiresInSeconds} seconds - too short for reliable usage`
      });
    } else if (expiresInSeconds < 300) { // Less than 5 minutes
      diagnostics.push({
        level: 'warning',
        message: `URL expires in ${expiresInSeconds} seconds - consider regenerating soon`
      });
    } else if (expiresInSeconds < 3600) { // Less than 1 hour
      diagnostics.push({
        level: 'info',
        message: `URL expires in ${formatTimeRemaining(expiresInSeconds * 1000)} - acceptable timeframe`
      });
    } else {
      diagnostics.push({
        level: 'success',
        message: `URL valid for ${formatTimeRemaining(expiresInSeconds * 1000)} - good`
      });
    }
  }

  return diagnostics;
};

/**
 * Log URL analysis to console in a formatted way
 * @param {string} url - The signed URL to analyze
 */
export const logURLAnalysis = (url) => {
  console.group('🔍 Signed URL Analysis');
  
  const analysis = analyzeSignedURL(url);
  
  if (analysis.error) {
    console.error('❌ Error:', analysis.error);
    if (analysis.message) {
      console.error('Details:', analysis.message);
    }
  } else {
    console.log('📊 URL Information:');
    console.table({
      'Base URL': analysis.baseUrl,
      'Has Expires': analysis.hasExpires ? '✅' : '❌',
      'Expiration Date': analysis.expirationDateFormatted || 'N/A',
      'Time Remaining': analysis.expiresInFormatted,
      'Status': analysis.isExpired ? '❌ EXPIRED' : '✅ Valid',
      'Access Key ID': analysis.accessKeyId || 'Missing',
      'Has Signature': analysis.hasSignature ? '✅' : '❌'
    });

    if (analysis.diagnostics && analysis.diagnostics.length > 0) {
      console.log('\n⚠️ Diagnostics:');
      analysis.diagnostics.forEach(diag => {
        const icon = diag.level === 'error' || diag.level === 'critical' ? '❌' :
                     diag.level === 'warning' ? '⚠️' :
                     diag.level === 'success' ? '✅' : 'ℹ️';
        console.log(`${icon} [${diag.level.toUpperCase()}] ${diag.message}`);
      });
    }

    console.log('\n📋 All Parameters:');
    Object.entries(analysis.allParams).forEach(([key, value]) => {
      const maskedValue = key === 'Signature' ? value.substring(0, 20) + '...' : value;
      console.log(`  ${key}: ${maskedValue}`);
    });
  }
  
  console.groupEnd();
  
  return analysis;
};

/**
 * Test if a signed URL is still accessible
 * @param {string} url - The signed URL to test
 * @returns {Promise<boolean>} True if accessible, false otherwise
 */
export const testURLAccessibility = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('URL accessibility test failed:', error.message);
    return false;
  }
};

/**
 * Comprehensive URL test with analysis and accessibility check
 * @param {string} url - The signed URL to test
 */
export const diagnoseSignedURL = async (url) => {
  console.log('\n🔬 Starting comprehensive URL diagnosis...\n');
  
  // Step 1: Analyze URL structure
  const analysis = logURLAnalysis(url);
  
  // Step 2: Test actual accessibility
  console.log('\n🧪 Testing URL accessibility...');
  const isAccessible = await testURLAccessibility(url);
  console.log(isAccessible ? '✅ URL is accessible' : '❌ URL is NOT accessible');
  
  // Step 3: Provide recommendations
  console.log('\n💡 Recommendations:');
  if (analysis.isExpired || !isAccessible) {
    console.log('  1. Request a fresh signed URL from Alibaba Cloud');
    console.log('  2. Ensure your proxy preserves all query parameters');
    console.log('  3. Consider implementing URL refresh before expiration');
    console.log('  4. Check if OSS bucket CORS settings allow access');
  } else {
    console.log('  ✅ URL appears healthy - no action needed');
  }
  
  return {
    analysis,
    isAccessible,
    needsRefresh: analysis.isExpired || !isAccessible
  };
};

export default {
  analyzeSignedURL,
  logURLAnalysis,
  testURLAccessibility,
  diagnoseSignedURL
};
