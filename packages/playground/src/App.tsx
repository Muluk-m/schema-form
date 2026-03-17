import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useSchema } from './composables/useSchema'
import WidgetPalette from './components/WidgetPalette'
import FormPreview from './components/FormPreview'
import SchemaEditor from './components/SchemaEditor'
import TemplateGallery from './components/TemplateGallery'
import AiChat from './components/AiChat'

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const { selectedAdapter, previewMode, exportSchemaUrl, importSchemaFromUrl } = useSchema()
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

    // --- Keyboard shortcuts ---
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Handled in FormPreview
      }
    }

    // --- Share ---
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

    // --- Import from URL on mount ---
    onMounted(() => {
      importSchemaFromUrl()
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
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

            {/* Preview mode */}
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

            {/* Share */}
            <button class="pg-header__btn pg-header__btn--share" onClick={handleShare}>
              <ShareIcon />
              分享
            </button>

            {/* AI */}
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
          {/* Left: Widget Palette */}
          <div class="pg-panel pg-panel--left">
            <div class="pg-panel__title">组件</div>
            <div class="pg-panel__body">
              <WidgetPalette />
            </div>
          </div>

          <div class="pg-resize-handle" onMousedown={(e: MouseEvent) => onResizeStart('left', e)} />

          {/* Center: Form Preview */}
          <div class="pg-panel pg-panel--center">
            <FormPreview />
          </div>

          <div
            class="pg-resize-handle"
            onMousedown={(e: MouseEvent) => onResizeStart('right', e)}
          />

          {/* Right: Schema Editor */}
          <div class="pg-panel pg-panel--right">
            <SchemaEditor />
          </div>
        </div>

        {/* Bottom: Template Gallery */}
        <TemplateGallery />

        {/* AI Chat slide-out */}
        <AiChat visible={aiVisible.value} onClose={() => (aiVisible.value = false)} />

        {/* Toast */}
        {showToast.value && <div class="pg-toast">{toastText.value}</div>}
      </div>
    )
  },
})
