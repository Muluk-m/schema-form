/**
 * CF Pages Function — AI proxy for v3sf Playground
 *
 * Route: /v1/chat/completions (matches OpenAI-compatible API format)
 * Proxies to DeepSeek with rate limiting via KV.
 *
 * Env vars needed:
 *   DEEPSEEK_API_KEY — set in CF Pages > Settings > Environment Variables
 *
 * KV binding needed:
 *   RATE_KV — create in CF dashboard, bind in Pages > Settings > KV bindings
 */

const UPSTREAM = 'https://api.deepseek.com/v1/chat/completions'
const DAILY_LIMIT = 20

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestPost(context) {
  const { request, env } = context

  // Rate limit by IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const today = new Date().toISOString().slice(0, 10)
  const rateKey = `rate:${ip}:${today}`

  if (env.RATE_KV) {
    const count = parseInt((await env.RATE_KV.get(rateKey)) || '0')
    if (count >= DAILY_LIMIT) {
      return json(
        {
          error: {
            message: `每日免费额度已用完 (${DAILY_LIMIT} 次/天)，请在设置中配置自己的 API Key`,
            type: 'rate_limit',
            code: 'daily_limit_exceeded',
          },
        },
        429,
      )
    }
    await env.RATE_KV.put(rateKey, String(count + 1), { expirationTtl: 86400 })
  }

  // Proxy to DeepSeek
  try {
    const body = await request.json()
    body.model = 'deepseek-chat'
    body.max_tokens = Math.min(body.max_tokens || 2048, 4096)
    body.temperature = body.temperature ?? 0.3

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await upstream.text()
    return new Response(data, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  } catch (err) {
    return json({ error: { message: 'AI 服务暂时不可用: ' + err.message } }, 502)
  }
}
