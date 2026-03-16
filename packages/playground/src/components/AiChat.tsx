import { defineComponent, ref } from 'vue'
import { useAiConfig, type AiProvider } from '../composables/useAiConfig'

export default defineComponent({
  name: 'AiChat',
  props: {
    visible: { type: Boolean, default: false },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { config, setProvider, setApiKey, setEndpoint, setModel } = useAiConfig()
    const showSettings = ref(true)
    const inputText = ref('')
    const generating = ref(false)
    const message = ref('')

    const providerOptions: { value: AiProvider; label: string }[] = [
      { value: 'openai', label: 'OpenAI' },
      { value: 'claude', label: 'Claude' },
      { value: 'deepseek', label: 'DeepSeek' },
      { value: 'qwen', label: '通义千问' },
    ]

    function handleGenerate() {
      if (!inputText.value.trim()) return
      generating.value = true
      message.value = ''

      // Placeholder: AI functionality is not yet implemented
      setTimeout(() => {
        generating.value = false
        message.value = 'AI 功能开发中...'
      }, 800)
    }

    function handleClose() {
      emit('close')
    }

    return () => {
      if (!props.visible) return null

      return (
        <div class="pg-ai-overlay" onClick={handleClose}>
          <div class="pg-ai" onClick={(e: Event) => e.stopPropagation()}>
            <div class="pg-ai__header">
              <h3>AI 助手</h3>
              <div style="display: flex; gap: 8px; align-items: center">
                <button
                  class="pg-ai__toggle-settings"
                  onClick={() => (showSettings.value = !showSettings.value)}
                  title="设置"
                >
                  ⚙
                </button>
                <button class="pg-ai__close" onClick={handleClose}>
                  ✕
                </button>
              </div>
            </div>

            <div class="pg-ai__body">
              {showSettings.value && (
                <div class="pg-ai__settings">
                  <div>
                    <label>模型服务</label>
                    <select
                      value={config.value.provider}
                      onChange={(e: Event) =>
                        setProvider((e.target as HTMLSelectElement).value as AiProvider)
                      }
                    >
                      {providerOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>API Key</label>
                    <input
                      type="password"
                      value={config.value.apiKey}
                      placeholder="输入 API Key"
                      onInput={(e: Event) => setApiKey((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div>
                    <label>Endpoint</label>
                    <input
                      type="text"
                      value={config.value.endpoint}
                      onInput={(e: Event) => setEndpoint((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div>
                    <label>Model</label>
                    <input
                      type="text"
                      value={config.value.model}
                      onInput={(e: Event) => setModel((e.target as HTMLInputElement).value)}
                    />
                  </div>
                </div>
              )}

              {message.value ? (
                <div style="padding: 12px; background: #f0f7ff; border-radius: 8px; font-size: 13px; color: #1976d2">
                  {message.value}
                </div>
              ) : (
                <div class="pg-ai__placeholder">输入描述，AI 将为您生成表单 Schema</div>
              )}
            </div>

            <div class="pg-ai__input-area">
              <textarea
                value={inputText.value}
                onInput={(e: Event) => (inputText.value = (e.target as HTMLTextAreaElement).value)}
                placeholder="描述你需要的表单，例如：创建一个用户注册表单..."
              />
              <button
                class="pg-ai__send"
                onClick={handleGenerate}
                disabled={generating.value || !inputText.value.trim()}
              >
                {generating.value ? '生成中...' : '生成'}
              </button>
            </div>
          </div>
        </div>
      )
    }
  },
})
