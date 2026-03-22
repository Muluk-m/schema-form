# v3sf AI Proxy Worker

Cloudflare Worker that proxies AI requests to DeepSeek API, providing free form generation for Playground visitors.

## Setup

1. Create a KV namespace in CF dashboard, name it `RATE_KV`
2. Create a Worker named `v3sf-ai`
3. Bind the KV namespace to the worker as `RATE_KV`
4. Set environment variable: `DEEPSEEK_API_KEY`
5. Paste `worker.js` content into the Worker editor
6. Add custom domain: `v3sf-ai.nainma.online`

## Rate Limiting

- 20 requests per IP per day
- Stored in CF KV with 24h TTL
- Returns 429 with helpful message when exceeded

## Cost

DeepSeek Chat: ~¥0.001/request. At 1000 requests/day = ~¥1/day ≈ ¥30/month.
