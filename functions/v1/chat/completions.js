/**
 * CF Pages Function — AI proxy using Cloudflare Workers AI
 *
 * Route: /v1/chat/completions (OpenAI-compatible format)
 * Uses CF Workers AI (built-in, no external API key needed)
 * Free tier: 10,000 neurons/day
 *
 * Bindings needed (CF Dashboard → Pages → Settings):
 *   AI — Workers AI binding (enable in Settings → AI)
 *   RATE_KV — KV namespace for rate limiting
 */

const DAILY_LIMIT = 30
const MODEL = '@cf/meta/llama-3.1-8b-instruct'

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

  try {
    const body = await request.json()
    const messages = body.messages || []

    // Call CF Workers AI
    const result = await env.AI.run(MODEL, { messages })

    // Return OpenAI-compatible response format
    return json({
      id: 'cf-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: MODEL,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.response,
          },
          finish_reason: 'stop',
        },
      ],
    })
  } catch (err) {
    return json(
      { error: { message: 'AI 服务暂时不可用: ' + err.message } },
      502,
    )
  }
}
