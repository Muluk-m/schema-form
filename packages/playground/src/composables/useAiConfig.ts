import { ref, watch } from 'vue'

export type AiProvider = 'free' | 'openai' | 'claude' | 'deepseek' | 'qwen' | 'gemini'

export interface AiConfig {
  provider: AiProvider
  apiKey: string
  endpoint: string
  model: string
}

const STORAGE_KEY = 'v3sf-playground-ai-config'

/** Free tier proxy — no API key needed */
const FREE_ENDPOINT = 'https://v3sf-ai.nainma.online'

const providerDefaults: Record<AiProvider, { endpoint: string; model: string }> = {
  free: {
    endpoint: FREE_ENDPOINT,
    model: 'deepseek-chat',
  },
  openai: {
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4.1-mini',
  },
  claude: {
    endpoint: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  qwen: {
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus-latest',
  },
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
  },
}

function loadConfig(): AiConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  // Default to free tier — no API key needed
  return {
    provider: 'free',
    apiKey: 'free',
    endpoint: providerDefaults.free.endpoint,
    model: providerDefaults.free.model,
  }
}

const config = ref<AiConfig>(loadConfig())

watch(
  config,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

export function useAiConfig() {
  function setProvider(provider: AiProvider) {
    const defaults = providerDefaults[provider]
    config.value = {
      ...config.value,
      provider,
      endpoint: defaults.endpoint,
      model: defaults.model,
    }
  }

  function setApiKey(key: string) {
    config.value = { ...config.value, apiKey: key }
  }

  function setEndpoint(endpoint: string) {
    config.value = { ...config.value, endpoint }
  }

  function setModel(model: string) {
    config.value = { ...config.value, model }
  }

  return {
    config,
    providerDefaults,
    setProvider,
    setApiKey,
    setEndpoint,
    setModel,
  }
}
