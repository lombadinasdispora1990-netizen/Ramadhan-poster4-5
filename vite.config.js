import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Custom Vite plugin to proxy Alibaba OSS images server-side.
 * This avoids CORS issues when fetching signed URLs from Alibaba Cloud.
 */
function imageProxyPlugin() {
  return {
    name: 'image-proxy',
    configureServer(server) {
      // Register BEFORE Vite's own middleware so it doesn't fall through to SPA
      server.middlewares.use('/api/proxy-image', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        let response;
        let targetUrl = '';

        try {
          // Extract URL from query parameter
          const urlQueryIndex = req.url.indexOf('?url=');
          const urlParam = urlQueryIndex !== -1
            ? req.url.substring(urlQueryIndex + 5)
            : '';

          if (!urlParam) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Missing url parameter' }));
          }

          targetUrl = decodeURIComponent(urlParam);
          console.log('📡 [image-proxy] Fetching:', targetUrl.substring(0, 120) + '...');

          // Validate: only allow Alibaba OSS URLs (strict origin check to prevent SSRF)
          try {
            const parsedUrl = new URL(targetUrl);
            const hostname = parsedUrl.hostname.toLowerCase();
            if (!hostname.endsWith('.aliyuncs.com') && !hostname.endsWith('.dashscope.com') && hostname !== 'aliyuncs.com' && hostname !== 'dashscope.com') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Only Alibaba Cloud OSS URLs allowed' }));
            }
            if (parsedUrl.protocol !== 'https:') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Only HTTPS URLs allowed' }));
            }
          } catch (urlParseError) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Invalid URL format' }));
          }

          // Fetch the image from Alibaba OSS (server-side, no CORS restrictions)
          response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; BarokahGen/1.0)',
              'Accept': 'image/*,*/*;q=0.8',
            },
            redirect: 'follow',
          });

          if (!response.ok) {
            console.error('❌ [image-proxy] OSS returned:', response.status, response.statusText);
            throw new Error(`OSS returned HTTP ${response.status}`);
          }

          const contentType = response.headers.get('content-type') || 'image/png';
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          console.log('✅ [image-proxy] Success! Size:', buffer.length, 'bytes, Type:', contentType);

          // Sanity check: ensure we got an image, not HTML/XML error
          const head = buffer.toString('utf8', 0, 50).toLowerCase();
          if (head.includes('<!doctype') || head.includes('<html') || head.includes('<?xml')) {
            console.error('❌ [image-proxy] Got HTML/XML instead of image');
            throw new Error('OSS returned error page instead of image');
          }

          // Send the image back with CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Length', buffer.length);
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.statusCode = 200;
          res.end(buffer);

        } catch (error) {
          console.error('❌ [image-proxy] Error:', error.message);
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: 'Image proxy failed',
            message: error.message,
            url: targetUrl.substring(0, 150),
          }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imageProxyPlugin(),
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // API proxy for Alibaba Cloud text/image generation
      '/api/alibaba': {
        target: 'https://dashscope-intl.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/alibaba/, ''),
      },
      // Compatibility mode endpoints
      '/compatible-mode': {
        target: 'https://dashscope-intl.aliyuncs.com',
        changeOrigin: true,
      },
      // Supabase API proxy to bypass CORS during development
      '/api/supabase': {
        target: 'https://ceuvbpnozyqhrpjsdnjq.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/supabase/, ''),
      },
    }
  }
})
