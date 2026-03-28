import { defineComponent, ref, nextTick } from 'vue'
import { useAiConfig } from '../composables/useAiConfig'
import { createGenerator } from '@v3sf/ai'
import { examples } from '@v3sf/ai'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  schema?: any
}

/** Pre-stored template schemas for cold start (no API key needed) */
const quickTemplates = [
  { label: '📝 注册', description: '用户注册表单', schema: examples[1]?.schema },
  { label: '🔐 登录', description: '登录表单', schema: examples[0]?.schema },
  { label: '💬 反馈', description: '意见反馈表单', schema: examples[7]?.schema },
  { label: '📋 问卷', description: '问卷调查', schema: examples[4]?.schema },
  { label: '📦 订购', description: '商品订购', schema: examples[5]?.schema },
].filter((t) => t.schema)

const placeholders = [
  '一个 5 道题的满意度调查问卷',
  '带身份证号校验的实名认证表单',
  '员工请假申请，选类型和日期',
  '商品订购，包含数量和收货地址',
  '系统设置页面，通知开关和主题选择',
]

export default defineComponent({
  name: 'AiChat',
  emits: ['schema-update'],
  setup(_, { emit }) {
    const { config } = useAiConfig()
    const inputText = ref('')
    const generating = ref(false)
    const messages = ref<ChatMessage[]>([])
    const messagesEl = ref<HTMLElement>()
    const showSettings = ref(false)
    const currentSchema = ref<any>(null)
    const placeholderIndex = ref(Math.floor(Math.random() * placeholders.length))

    function scrollToBottom() {
      nextTick(() => {
        if (messagesEl.value) {
          messagesEl.value.scrollTop = messagesEl.value.scrollHeight
        }
      })
    }

    function applySchema(schema: any) {
      currentSchema.value = schema
      emit('schema-update', schema)
    }

    function handleTemplateClick(template: (typeof quickTemplates)[0]) {
      // Fill input with template description, let user send manually
      inputText.value = template.description
    }

    async function handleGenerate() {
      const text = inputText.value.trim()
      if (!text || generating.value) return

      // Check API key (free tier doesn't need one)
      if (!config.value.apiKey && config.value.provider !== 'free') {
        showSettings.value = true
        messages.value.push({
          role: 'assistant',
          content: '⚠️ 请先在设置中配置 API Key，或切换到「免费体验」模式',
        })
        scrollToBottom()
        return
      }

      messages.value.push({ role: 'user', content: text })
      inputText.value = ''
      generating.value = true
      scrollToBottom()

      try {
        const generator = createGenerator({
          apiKey: config.value.apiKey,
          baseUrl: config.value.endpoint,
          model: config.value.model,
        })

        const isModify =
          currentSchema.value && messages.value.filter((m) => m.role === 'user').length > 1
        const result = isModify
          ? await generator.modify(currentSchema.value, text)
          : await generator.generate(text)

        const fieldCount = Object.keys(result.schema?.properties ?? {}).length

        if (result.success) {
          messages.value.push({
            role: 'assistant',
            content: `✅ 已生成 ${fieldCount} 个字段的表单。${result.repairs.length > 0 ? `（自动修复了 ${result.repairs.length} 个问题）` : ''}[查看 Schema →]`,
            schema: result.schema,
          })
          applySchema(result.schema)
        } else {
          const errorSummary = result.errors.slice(0, 3).join('；')
          messages.value.push({
            role: 'assistant',
            content: `⚠️ 生成了 ${fieldCount} 个字段，但有 ${result.errors.length} 个问题：${errorSummary}。${result.suggestions[0] ?? ''}`,
            schema: result.schema,
          })
          applySchema(result.schema)
        }
      } catch (err: any) {
        let errorMsg = `❌ 生成失败：${err.message}`
        if (err.status === 401) errorMsg += '\nAPI Key 无效或已过期，请检查设置'
        messages.value.push({ role: 'assistant', content: errorMsg })
      } finally {
        generating.value = false
        scrollToBottom()
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleGenerate()
      }
    }

    // SVG Icons
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

    return () => (
      <div class="pg-ai">
        {/* Settings panel */}
        {showSettings.value && (
          <div class="pg-ai__settings">
            <div class="setting-row">
              <label>API Key</label>
              <input
                type="password"
                value={config.value.apiKey}
                placeholder="sk-..."
                onInput={(e: Event) => {
                  config.value = { ...config.value, apiKey: (e.target as HTMLInputElement).value }
                }}
              />
            </div>
            <div class="setting-row">
              <label>Endpoint</label>
              <input
                type="text"
                value={config.value.endpoint}
                onInput={(e: Event) => {
                  config.value = { ...config.value, endpoint: (e.target as HTMLInputElement).value }
                }}
              />
            </div>
            <div class="setting-row">
              <label>Model</label>
              <input
                type="text"
                value={config.value.model}
                onInput={(e: Event) => {
                  config.value = { ...config.value, model: (e.target as HTMLInputElement).value }
                }}
              />
            </div>
          </div>
        )}

        {/* Messages */}
        <div class="pg-ai__messages" ref={messagesEl}>
          {messages.value.length === 0 ? (
            <div class="pg-ai__empty">
              <div class="pg-ai__empty-title">描述你想要的表单</div>
              <div class="pg-ai__empty-subtitle">或选一个模板开始</div>
              <div class="pg-ai__templates">
                {quickTemplates.map((t) => (
                  <button
                    key={t.label}
                    class="pg-ai__template-chip"
                    onClick={() => handleTemplateClick(t)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.value.map((msg, i) => (
                <div key={i} class={`pg-ai__message pg-ai__message--${msg.role}`}>
                  {msg.content}
                  {msg.schema && (
                    <button class="pg-ai__schema-link" onClick={() => applySchema(msg.schema)}>
                      查看 Schema →
                    </button>
                  )}
                </div>
              ))}
              {generating.value && (
                <div class="pg-ai__generating">
                  <span class="dot" />
                  <span class="dot" />
                  <span class="dot" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Input area */}
        <div class="pg-ai__input-area">
          <button
            class="pg-ai__settings-btn"
            onClick={() => (showSettings.value = !showSettings.value)}
            title="AI 设置"
          >
            <SettingsIcon />
          </button>
          <textarea
            value={inputText.value}
            onInput={(e: Event) => (inputText.value = (e.target as HTMLTextAreaElement).value)}
            onKeydown={handleKeydown}
            placeholder={placeholders[placeholderIndex.value]}
            rows={1}
          />
          <button
            class="pg-ai__send-btn"
            onClick={handleGenerate}
            disabled={generating.value || !inputText.value.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    )
  },
})
