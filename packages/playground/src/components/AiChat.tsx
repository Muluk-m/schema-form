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
  {
    label: '📝 注册',
    description: '用户注册表单，包含姓名、邮箱、手机号、密码，带格式校验和必填提示',
    schema: examples[1]?.schema,
  },
  {
    label: '🔐 登录',
    description: '登录表单，包含账号（手机号/邮箱）、密码输入，支持记住登录状态开关',
    schema: examples[0]?.schema,
  },
  {
    label: '💬 反馈',
    description:
      '意见反馈表单，包含反馈类型（缺陷/建议/其他）单选、是否希望被联系开关、反馈内容多行文本',
    schema: examples[7]?.schema,
  },
  {
    label: '📋 问卷',
    description:
      '满意度调查问卷，包含 5 道评分题（服务态度、响应速度、专业程度等），使用 radio 单选',
    schema: examples[4]?.schema,
  },
  {
    label: '📦 订购',
    description: '商品订购表单，包含商品规格选择、数量步进器、收货地址、联系电话，带必填校验',
    schema: examples[5]?.schema,
  },
].filter((t) => t.schema)

const placeholders = [
  '用户满意度调查问卷，包含 5 道评分题（服务态度、响应速度、专业程度等），使用 radio 单选，支持必填校验',
  '实名认证表单，需要姓名、身份证号（18位校验）、手机号，带格式验证和必填提示',
  '员工请假申请表，包含请假类型（年假/事假/病假）、起止日期选择、请假天数自动计算、审批人选择',
  '商品订购表单，包含商品规格选择、数量步进器、收货地址（省市区级联）、联系电话',
  '系统偏好设置页，包含通知开关（邮件/短信/推送）、主题选择（浅色/深色/跟随系统）、语言切换',
]

export default defineComponent({
  name: 'AiChat',
  emits: ['schema-update', 'view-schema'],
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
              <svg class="pg-ai__empty-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
              </svg>
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
                    <button
                      class="pg-ai__schema-link"
                      onClick={() => {
                        applySchema(msg.schema)
                        emit('view-schema')
                      }}
                    >
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
