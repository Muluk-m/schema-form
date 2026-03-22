/**
 * Cloudflare Worker — v3sf AI proxy
 *
 * Proxies requests to DeepSeek API with rate limiting.
 * Users get free AI form generation without needing their own API key.
 *
 * Deploy:
 *   1. Create a CF Worker named "v3sf-ai"
 *   2. Set environment variable: DEEPSEEK_API_KEY
 *   3. Paste this code
 *   4. Add custom domain: v3sf-ai.nainma.online
 *
 * Rate limit: 20 requests per IP per day (stored in CF KV)
 */

const UPSTREAM = 'https://api.deepseek.com/v1/chat/completions'
const DAILY_LIMIT = 20
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405)
    }

    const url = new URL(request.url)
    if (url.pathname !== '/v1/chat/completions') {
      return json({ error: 'Not found' }, 404)
    }

    // Rate limit by IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const today = new Date().toISOString().slice(0, 10)
    const rateKey = `rate:${ip}:${today}`

    if (env.RATE_KV) {
      const count = parseInt((await env.RATE_KV.get(rateKey)) || '0')
      if (count >= DAILY_LIMIT) {
        return json(
          {
            error: `每日免费额度已用完 (${DAILY_LIMIT} 次/天)，请配置自己的 API Key`,
            limit: DAILY_LIMIT,
            used: count,
          },
          429,
        )
      }
      await env.RATE_KV.put(rateKey, String(count + 1), {
        expirationTtl: 86400,
      })
    }

    // Proxy to DeepSeek
    try {
      const body = await request.json()

      // Force model to deepseek-chat and limit tokens
      body.model = 'deepseek-chat'
      body.max_tokens = body.max_tokens || 2048
      body.temperature = body.temperature ?? 0.3

      const upstream = await fetch(UPSTREAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(body),
      })

      const data = await upstream.json()
      return json(data, upstream.status)
    } catch (err) {
      return json({ error: 'Proxy error: ' + err.message }, 502)
    }
  },
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  })
}
