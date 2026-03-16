import { ref, watch } from 'vue'

export type AiProvider = 'openai' | 'claude' | 'deepseek' | 'qwen'

export interface AiConfig {
  provider: AiProvider
  apiKey: string
  endpoint: string
  model: string
}

const STORAGE_KEY = 'v3sf-playground-ai-config'

const providerDefaults: Record<AiProvider, { endpoint: string; model: string }> = {
  openai: {
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o',
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
    model: 'qwen-max',
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
  return {
    provider: 'openai',
    apiKey: '',
    endpoint: providerDefaults.openai.endpoint,
    model: providerDefaults.openai.model,
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
