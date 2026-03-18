import { defineComponent, computed, onMounted, ref } from 'vue'
import { vantAdapter } from '@v3sf/vant'
import { elementPlusAdapter } from '@v3sf/element-plus'
import {
  GeneratorProvider,
  WidgetPalette,
  FormCanvas,
  FieldSettings,
  useGenerator,
} from '@v3sf/generator'
import { widgets } from './widgets'
import { usePlayground } from './composables/usePlayground'
import SchemaEditor from './components/SchemaEditor'
import TemplateGallery from './components/TemplateGallery'
import AiChat from './components/AiChat'

const PlaygroundInner = defineComponent({
  name: 'PlaygroundInner',
  setup() {
    const { buildSchema, loadSchema } = useGenerator()
    const { selectedAdapter, previewMode } = usePlayground()

    const rightTab = ref<'settings' | 'schema'>('settings')
    const aiVisible = ref(false)
    const showToast = ref(false)
    const toastText = ref('')

    // --- Resizable panels ---
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
      if (resizing === 'left') {
        leftWidth.value = Math.max(180, Math.min(400, startWidth + dx))
      } else {
        rightWidth.value = Math.max(280, Math.min(600, startWidth - dx))
      }
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
        const parsed = JSON.parse(json)
        loadSchema(parsed)
        return true
      } catch {
        return false
      }
    }

    function handleShare() {
      const url = exportSchemaUrl()
      navigator.clipboard.writeText(url).then(() => {
        toastText.value = '链接已复制到剪贴板'
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 2000)
      })
    }

    onMounted(() => {
      importSchemaFromUrl()
    })

    // --- SVG Icons ---
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

    function renderCanvas() {
      if (previewMode.value === 'mobile') {
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
            <div class="pg-preview__content">
              <FormCanvas />
            </div>
            <div class="pg-preview__home-indicator" />
          </div>
        )
      }
      return (
        <div class="pg-preview__desktop-frame">
          <FormCanvas />
        </div>
      )
    }

    return () => (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '--left-w': `${leftWidth.value}px`,
          '--right-w': `${rightWidth.value}px`,
        }}
      >
        {/* Header */}
        <header class="pg-header">
          <div class="pg-header__logo">
            <span class="logo-mark">v3sf</span>
            <span class="logo-label">Playground</span>
          </div>
          <div class="pg-header__actions">
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
            <div class="pg-header__mode-group">
              <button
                class={{ 'is-active': previewMode.value === 'mobile' }}
                onClick={() => (previewMode.value = 'mobile')}
                title="手机预览"
              >
                <PhoneIcon />
              </button>
              <button
                class={{ 'is-active': previewMode.value === 'desktop' }}
                onClick={() => (previewMode.value = 'desktop')}
                title="桌面预览"
              >
                <MonitorIcon />
              </button>
            </div>
            <button class="pg-header__btn pg-header__btn--share" onClick={handleShare}>
              <ShareIcon />
              分享
            </button>
            <button
              class="pg-header__btn pg-header__btn--ai"
              onClick={() => (aiVisible.value = true)}
            >
              <SparkleIcon />
              AI 助手
            </button>
          </div>
        </header>

        {/* Three-panel layout */}
        <div class="pg-layout">
          {/* Left: Widget Palette from Generator SDK */}
          <div class="pg-panel pg-panel--left">
            <WidgetPalette />
          </div>

          <div class="pg-resize-handle" onMousedown={(e: MouseEvent) => onResizeStart('left', e)} />

          {/* Center: Canvas with viewport simulation */}
          <div class="pg-panel pg-panel--center">{renderCanvas()}</div>

          <div
            class="pg-resize-handle"
            onMousedown={(e: MouseEvent) => onResizeStart('right', e)}
          />

          {/* Right: Tabs (Settings / Schema) */}
          <div class="pg-panel pg-panel--right">
            <div class="pg-right-tabs">
              <button
                class={['pg-right-tabs__tab', rightTab.value === 'settings' && 'is-active']}
                onClick={() => (rightTab.value = 'settings')}
              >
                属性
              </button>
              <button
                class={['pg-right-tabs__tab', rightTab.value === 'schema' && 'is-active']}
                onClick={() => (rightTab.value = 'schema')}
              >
                Schema
              </button>
            </div>
            <div class="pg-right-tabs__content">
              {rightTab.value === 'settings' ? <FieldSettings /> : <SchemaEditor />}
            </div>
          </div>
        </div>

        {/* Bottom: Template Gallery */}
        <TemplateGallery />

        {/* AI Chat */}
        <AiChat visible={aiVisible.value} onClose={() => (aiVisible.value = false)} />

        {/* Toast */}
        {showToast.value && <div class="pg-toast">{toastText.value}</div>}
      </div>
    )
  },
})

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const { selectedAdapter } = usePlayground()

    const currentAdapter = computed(() => {
      return selectedAdapter.value === 'vant' ? vantAdapter : elementPlusAdapter
    })

    return () => (
      <GeneratorProvider adapter={currentAdapter.value} widgets={widgets}>
        <PlaygroundInner />
      </GeneratorProvider>
    )
  },
})
