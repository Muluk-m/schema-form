import { defineComponent, computed, h, onMounted, ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import { elementPlusAdapter } from '@v3sf/element-plus'
import {
  GeneratorProvider,
  WidgetPalette,
  FormCanvas,
  FieldSettings,
  useGenerator,
} from '@v3sf/generator'
// WidgetPalette & FormCanvas used in build mode only
import { widgets } from './widgets'
import { usePlayground } from './composables/usePlayground'
import SchemaEditor from './components/SchemaEditor'
import TemplateGallery from './components/TemplateGallery'
import AiChat from './components/AiChat'

// ---- SVG Icons ----
const PhoneIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="4" y="1" width="8" height="14" rx="2" />
    <line x1="7" y1="12" x2="9" y2="12" />
  </svg>
)
const MonitorIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="1" y="2" width="14" height="10" rx="1.5" />
    <line x1="5" y1="14" x2="11" y2="14" />
    <line x1="8" y1="12" x2="8" y2="14" />
  </svg>
)
const ShareIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M6 9l4-4M5 5h1V4M10 11v1h1" />
    <path d="M6 4H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1v-2" />
  </svg>
)
const SparkleIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)
const PuzzleIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.3"
    stroke-linejoin="round"
  >
    <path d="M6 2h4v3a2 2 0 110 4v3H6v-3a2 2 0 110-4V2z" />
  </svg>
)
const SignalIcon = () => (
  <svg viewBox="0 0 16 12" fill="currentColor">
    <rect x="0" y="8" width="3" height="4" rx="0.5" />
    <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
    <rect x="9" y="2" width="3" height="10" rx="0.5" />
    <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
  </svg>
)
const WifiIcon = () => (
  <svg
    viewBox="0 0 16 12"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
  >
    <path d="M1 3.5a11 11 0 0114 0" />
    <path d="M3.5 6.5a7 7 0 019 0" />
    <path d="M6 9.5a3.5 3.5 0 014 0" />
    <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
  </svg>
)
const BatteryIcon = () => (
  <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.2">
    <rect x="0.5" y="1" width="16" height="10" rx="2" />
    <rect
      x="2"
      y="2.5"
      width="12"
      height="7"
      rx="1"
      fill="currentColor"
      stroke="none"
      opacity="0.8"
    />
    <path d="M17.5 4.5v3a1 1 0 001-1v-1a1 1 0 00-1-1z" fill="currentColor" stroke="none" />
  </svg>
)

const PlaygroundInner = defineComponent({
  name: 'PlaygroundInner',
  setup() {
    const { schema, buildSchema, loadSchema } = useGenerator()
    const { selectedAdapter, viewportMode, playgroundMode, interactionMode } = usePlayground()

    const rightTab = ref<'preview' | 'edit' | 'schema'>('preview')
    const showToast = ref(false)
    const toastText = ref('')
    const formData = ref<Record<string, any>>({})

    // SchemaForm instances for preview
    const VantForm = createSchemaForm(vantAdapter)
    const ElementForm = createSchemaForm(elementPlusAdapter)
    const CurrentForm = computed(() => (selectedAdapter.value === 'vant' ? VantForm : ElementForm))

    // --- Build mode resizable panels ---
    const leftWidth = ref(232)
    const rightWidth = ref(380)
    let resizing: 'left' | 'right' | null = null
    let startX = 0
    let startWidth = 0

    function onResizeStart(panel: 'left' | 'right', e: MouseEvent) {
      resizing = panel
      startX = e.clientX
      startWidth = panel === 'left' ? leftWidth.value : rightWidth.value
      document.addEventListener('mousemove', onResizeMove)
      document.addEventListener('mouseup', onResizeEnd)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }
    function onResizeMove(e: MouseEvent) {
      if (!resizing) return
      const dx = e.clientX - startX
      if (resizing === 'left') leftWidth.value = Math.max(180, Math.min(400, startWidth + dx))
      else rightWidth.value = Math.max(280, Math.min(600, startWidth - dx))
    }
    function onResizeEnd() {
      resizing = null
      document.removeEventListener('mousemove', onResizeMove)
      document.removeEventListener('mouseup', onResizeEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    // --- Share ---
    function exportSchemaUrl(): string {
      const json = JSON.stringify(buildSchema())
      const encoded = btoa(encodeURIComponent(json))
      return `${window.location.origin}${window.location.pathname}#schema=${encoded}`
    }
    function importSchemaFromUrl(): boolean {
      try {
        const hash = window.location.hash
        if (!hash.startsWith('#schema=')) return false
        const encoded = hash.slice('#schema='.length)
        const json = decodeURIComponent(atob(encoded))
        loadSchema(JSON.parse(json))
        return true
      } catch {
        return false
      }
    }
    function handleShare() {
      navigator.clipboard.writeText(exportSchemaUrl()).then(() => {
        toastText.value = '链接已复制到剪贴板'
        showToast.value = true
        setTimeout(() => (showToast.value = false), 2000)
      })
    }

    onMounted(() => importSchemaFromUrl())

    // --- AI schema update ---
    function handleAiSchemaUpdate(newSchema: any) {
      loadSchema(newSchema)
      rightTab.value = 'preview'
    }

    // --- Render helpers ---
    function renderPreviewForm() {
      const Form = CurrentForm.value
      const hasFields = Object.keys(schema.value?.properties ?? {}).length > 0
      return (
        <>
          {h(Form, {
            schema: schema.value,
            modelValue: formData.value,
            'onUpdate:modelValue': (val: any) => (formData.value = val),
          })}
          {hasFields && (
            <button
              class="pg-preview__submit-btn"
              onClick={() => {
                toastText.value = '表单数据：' + JSON.stringify(formData.value, null, 2)
                showToast.value = true
                setTimeout(() => (showToast.value = false), 3000)
              }}
            >
              提交
            </button>
          )}
        </>
      )
    }

    function renderMobileFrame(content: any) {
      return (
        <div class="pg-preview__mobile-frame">
          <div class="pg-preview__status-bar">
            <span class="status-time">9:41</span>
            <div class="pg-preview__dynamic-island" />
            <div class="status-icons">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>
          <div class="pg-preview__content">{content}</div>
          <div class="pg-preview__home-indicator" />
        </div>
      )
    }

    function renderPreviewPanel() {
      const form = renderPreviewForm()
      const previewContent =
        viewportMode.value === 'mobile' ? (
          renderMobileFrame(form)
        ) : (
          <div class="pg-preview__desktop-frame">{form}</div>
        )

      return (
        <div class="pg-preview-panel">
          <div class="pg-preview-panel__tabs">
            <button
              class={['pg-tab', rightTab.value !== 'schema' && 'is-active']}
              onClick={() => (rightTab.value = 'preview')}
            >
              预览
            </button>
            <button
              class={['pg-tab', rightTab.value === 'schema' && 'is-active']}
              onClick={() => (rightTab.value = 'schema')}
            >
              Schema
            </button>
          </div>
          <div class="pg-preview-panel__body">
            {rightTab.value === 'schema' ? <SchemaEditor /> : previewContent}
          </div>
        </div>
      )
    }

    return () => {
      const isAiMode = playgroundMode.value === 'ai'
      const isPreview = interactionMode.value === 'preview'

      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            '--left-w': isAiMode || isPreview ? '0px' : `${leftWidth.value}px`,
            '--right-w': isAiMode ? '0px' : `${rightWidth.value}px`,
          }}
        >
          {/* Header */}
          <header class="pg-header">
            <div class="pg-header__logo">
              <svg class="logo-icon" width="22" height="22" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="var(--accent)" />
                <path d="M9 10h14v3H9zM9 15.5h10v3H9zM9 21h7v3H9z" fill="#fff" rx="1.5" />
              </svg>
              <span class="logo-mark">v3sf</span>
              <span class="logo-label">Playground</span>
            </div>
            <div class="pg-header__actions">
              {/* Mode switcher: AI / Build */}
              <div class="pg-header__mode-group">
                <button
                  class={{ 'is-active': playgroundMode.value === 'ai' }}
                  onClick={() => (playgroundMode.value = 'ai')}
                  title="AI 模式"
                >
                  <SparkleIcon />
                  <span class="btn-label">AI</span>
                </button>
                <button
                  class={{ 'is-active': playgroundMode.value === 'build' }}
                  onClick={() => (playgroundMode.value = 'build')}
                  title="搭建模式"
                >
                  <PuzzleIcon />
                  <span class="btn-label">搭建</span>
                </button>
              </div>

              <div class="pg-header__separator" />

              {/* Adapter switcher */}
              <div class="pg-header__adapter-switcher">
                <button
                  class={{ 'is-active': selectedAdapter.value === 'vant' }}
                  onClick={() => (selectedAdapter.value = 'vant')}
                >
                  Vant
                </button>
                <button
                  class={{ 'is-active': selectedAdapter.value === 'element-plus' }}
                  onClick={() => (selectedAdapter.value = 'element-plus')}
                >
                  Element Plus
                </button>
              </div>

              {/* Viewport mode */}
              <div class="pg-header__mode-group">
                <button
                  class={{ 'is-active': viewportMode.value === 'mobile' }}
                  onClick={() => (viewportMode.value = 'mobile')}
                  title="手机视口"
                >
                  <PhoneIcon />
                </button>
                <button
                  class={{ 'is-active': viewportMode.value === 'desktop' }}
                  onClick={() => (viewportMode.value = 'desktop')}
                  title="桌面视口"
                >
                  <MonitorIcon />
                </button>
              </div>

              <button class="pg-header__btn pg-header__btn--share" onClick={handleShare}>
                <ShareIcon />
                分享
              </button>
            </div>
          </header>

          {/* Main layout */}
          {isAiMode ? (
            /* ===== AI MODE: left chat + right preview ===== */
            <div class="pg-layout pg-layout--ai">
              <div class="pg-panel pg-panel--ai-chat">
                <AiChat
                  onSchemaUpdate={handleAiSchemaUpdate}
                  onViewSchema={() => (rightTab.value = 'schema')}
                />
              </div>
              <div class="pg-panel pg-panel--ai-preview">{renderPreviewPanel()}</div>
            </div>
          ) : (
            /* ===== BUILD MODE: existing 3-panel layout ===== */
            <div class={['pg-layout pg-layout--build', isPreview && 'pg-layout--preview']}>
              {!isPreview && (
                <>
                  <div class="pg-panel pg-panel--left">
                    <WidgetPalette />
                  </div>
                  <div
                    class="pg-resize-handle"
                    onMousedown={(e: MouseEvent) => onResizeStart('left', e)}
                  />
                </>
              )}
              <div class="pg-panel pg-panel--center">
                {isPreview ? (
                  viewportMode.value === 'mobile' ? (
                    renderMobileFrame(renderPreviewForm())
                  ) : (
                    <div class="pg-preview__desktop-frame">{renderPreviewForm()}</div>
                  )
                ) : (
                  <FormCanvas />
                )}
              </div>
              <div
                class="pg-resize-handle"
                onMousedown={(e: MouseEvent) => onResizeStart('right', e)}
              />
              <div class="pg-panel pg-panel--right">
                <div class="pg-right-tabs">
                  {!isPreview && (
                    <button
                      class={['pg-right-tabs__tab', rightTab.value === 'preview' && 'is-active']}
                      onClick={() => (rightTab.value = 'preview')}
                    >
                      属性
                    </button>
                  )}
                  <button
                    class={[
                      'pg-right-tabs__tab',
                      (rightTab.value === 'schema' || isPreview) && 'is-active',
                    ]}
                    onClick={() => (rightTab.value = 'schema')}
                  >
                    Schema
                  </button>
                </div>
                <div class="pg-right-tabs__content">
                  {!isPreview && rightTab.value === 'preview' ? (
                    <FieldSettings />
                  ) : (
                    <SchemaEditor />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Template Gallery (build mode only) */}
          {!isAiMode && <TemplateGallery />}

          {/* Toast */}
          {showToast.value && <div class="pg-toast">{toastText.value}</div>}
        </div>
      )
    }
  },
})

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const { selectedAdapter } = usePlayground()
    const currentAdapter = computed(() =>
      selectedAdapter.value === 'vant' ? vantAdapter : elementPlusAdapter,
    )

    return () => (
      <GeneratorProvider adapter={currentAdapter.value} widgets={widgets}>
        <PlaygroundInner />
      </GeneratorProvider>
    )
  },
})
