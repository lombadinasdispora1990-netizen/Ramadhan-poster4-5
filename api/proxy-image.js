// Vercel Serverless Function to proxy Alibaba OSS images.
// This handles CORS issues in production (Vercel deployments).

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        const targetUrl = decodeURIComponent(url);
        const parsedUrl = new URL(targetUrl);
        const hostname = parsedUrl.hostname.toLowerCase();

        // Safety: only allow Alibaba Cloud and DashScope domains to prevent SSRF
        if (!hostname.endsWith('.aliyuncs.com') && 
            !hostname.endsWith('.dashscope.com') && 
            !hostname.endsWith('.supabase.co') &&
            hostname !== 'aliyuncs.com' && 
            hostname !== 'dashscope.com') {
            return res.status(400).json({ error: 'Only Alibaba Cloud or Supabase URLs allowed' });
        }

        if (parsedUrl.protocol !== 'https:') {
            return res.status(400).json({ error: 'Only HTTPS URLs allowed' });
        }

        // Fetch the image
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; BarokahGen/1.0)',
                'Accept': 'image/*,*/*;q=0.8',
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            return res.status(502).json({
                error: 'Upstream image fetch failed',
                status: response.status
            });
        }

        // Get the content type and binary data
        const contentType = response.headers.get('content-type') || 'image/png';
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Set CORS and response headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        // Send the binary data
        return res.status(200).send(buffer);

    } catch (error) {
        console.error('❌ [api/proxy-image] Proxy error:', error.message);
        return res.status(500).json({
            error: 'Proxy internal error',
            message: error.message
        });
    }
}
