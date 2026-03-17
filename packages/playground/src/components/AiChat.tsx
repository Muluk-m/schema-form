import { defineComponent, ref } from 'vue'
import { useAiConfig, type AiProvider } from '../composables/useAiConfig'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default defineComponent({
  name: 'AiChat',
  props: {
    visible: { type: Boolean, default: false },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { config, setProvider, setApiKey, setEndpoint, setModel } = useAiConfig()
    const showSettings = ref(false)
    const inputText = ref('')
    const generating = ref(false)
    const messages = ref<ChatMessage[]>([])

    const providerOptions: { value: AiProvider; label: string }[] = [
      { value: 'openai', label: 'OpenAI' },
      { value: 'claude', label: 'Claude' },
      { value: 'deepseek', label: 'DeepSeek' },
      { value: 'qwen', label: '通义千问' },
    ]

    function handleGenerate() {
      if (!inputText.value.trim()) return

      messages.value.push({ role: 'user', content: inputText.value.trim() })
      inputText.value = ''
      generating.value = true

      // Placeholder: AI functionality is not yet implemented
      setTimeout(() => {
        generating.value = false
        messages.value.push({
          role: 'assistant',
          content: 'AI 功能开发中，敬请期待...',
        })
      }, 800)
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleGenerate()
      }
    }

    function handleClose() {
      emit('close')
    }

    // --- SVG Icons ---
    const SparkleIcon = () => (
      <svg viewBox="0 0 18 18" fill="currentColor">
        <path d="M9 1l1.8 5.2L16 8l-5.2 1.8L9 15l-1.8-5.2L2 8l5.2-1.8z" />
      </svg>
    )

    const CloseIcon = () => (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <line x1="4" y1="4" x2="12" y2="12" />
        <line x1="12" y1="4" x2="4" y2="12" />
      </svg>
    )

    const SettingsIcon = () => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4" />
      </svg>
    )

    const SendIcon = () => (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2L7 9" />
        <path d="M14 2l-5 12-2-5-5-2z" />
      </svg>
    )

    return () => {
      if (!props.visible) return null

      return (
        <div class="pg-ai-overlay" onClick={handleClose}>
          <div class="pg-ai" onClick={(e: Event) => e.stopPropagation()}>
            {/* Header */}
            <div class="pg-ai__header">
              <div class="ai-title">
                <SparkleIcon />
                AI 助手
              </div>
              <div class="ai-header-actions">
                <button
                  class="pg-ai__icon-btn"
                  onClick={() => (showSettings.value = !showSettings.value)}
                  title="设置"
                >
                  <SettingsIcon />
                </button>
                <button class="pg-ai__icon-btn" onClick={handleClose}>
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Body */}
            <div class="pg-ai__body">
              {/* Settings */}
              {showSettings.value && (
                <div class="pg-ai__settings">
                  <div class="setting-row">
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
                  <div class="setting-row">
                    <label>API Key</label>
                    <input
                      type="password"
                      value={config.value.apiKey}
                      placeholder="输入 API Key"
                      onInput={(e: Event) => setApiKey((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div class="setting-row">
                    <label>Endpoint</label>
                    <input
                      type="text"
                      value={config.value.endpoint}
                      onInput={(e: Event) => setEndpoint((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div class="setting-row">
                    <label>Model</label>
                    <input
                      type="text"
                      value={config.value.model}
                      onInput={(e: Event) => setModel((e.target as HTMLInputElement).value)}
                    />
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.value.length > 0 ? (
                <div class="pg-ai__messages">
                  {messages.value.map((msg, i) => (
                    <div key={i} class={`pg-ai__message pg-ai__message--${msg.role}`}>
                      {msg.content}
                    </div>
                  ))}
                  {generating.value && (
                    <div class="pg-ai__generating">
                      <span class="dot" />
                      <span class="dot" />
                      <span class="dot" />
                    </div>
                  )}
                </div>
              ) : (
                <div class="pg-ai__placeholder">描述你的表单，AI 将为你生成 Schema</div>
              )}
            </div>

            {/* Input area */}
            <div class="pg-ai__input-area">
              <textarea
                value={inputText.value}
                onInput={(e: Event) => (inputText.value = (e.target as HTMLTextAreaElement).value)}
                onKeydown={handleKeydown}
                placeholder="描述你的表单..."
              />
              <div class="input-actions">
                <button
                  class="pg-ai__send"
                  onClick={handleGenerate}
                  disabled={generating.value || !inputText.value.trim()}
                >
                  <SendIcon />
                  生成
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})
