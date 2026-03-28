/**
 * CF Pages Function — AI proxy using Cloudflare Workers AI
 *
 * Route: /v1/chat/completions (OpenAI-compatible format)
 * Uses CF Workers AI (built-in, no external API key needed)
 *
 * Bindings needed:
 *   AI — Workers AI binding
 *   RATE_KV — KV namespace for rate limiting
 */

const DAILY_LIMIT = 30
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

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

  // Check AI binding
  if (!env.AI) {
    return json({ error: { message: 'AI binding not configured' } }, 500)
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
          error: {
            message: `每日免费额度已用完 (${DAILY_LIMIT} 次/天)，请在设置中配置自己的 API Key`,
          },
        },
        429,
      )
    }
    await env.RATE_KV.put(rateKey, String(count + 1), { expirationTtl: 86400 })
  }

  try {
    const body = await request.json()
    let messages = body.messages || []

    // Enforce JSON-only output since Workers AI doesn't support response_format
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.role === 'user' && !lastMsg.content.includes('只输出 JSON')) {
      messages = messages.map((m, i) =>
        i === messages.length - 1
          ? { ...m, content: m.content + '\n\n重要：只输出纯 JSON，不要包含任何解释文字或 markdown 代码块标记。' }
          : m,
      )
    }

    // Call CF Workers AI
    const result = await env.AI.run(MODEL, {
      messages,
      max_tokens: 4096,
      temperature: 0.3,
    })

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
            content: result.response || '',
          },
          finish_reason: 'stop',
        },
      ],
    })
  } catch (err) {
    return json(
      { error: { message: 'AI 服务暂时不可用: ' + (err.message || String(err)) } },
      502,
    )
  }
}
