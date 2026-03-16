import { defineComponent, ref } from 'vue'
import { useSchema } from './composables/useSchema'
import WidgetPalette from './components/WidgetPalette'
import FormPreview from './components/FormPreview'
import SchemaEditor from './components/SchemaEditor'
import TemplateGallery from './components/TemplateGallery'
import AiChat from './components/AiChat'

export default defineComponent({
  name: 'PlaygroundApp',
  setup() {
    const { selectedAdapter, previewMode } = useSchema()
    const aiVisible = ref(false)

    // --- Resizable panels ---
    const leftWidth = ref(220)
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
        leftWidth.value = Math.max(160, Math.min(400, startWidth + dx))
      } else {
        rightWidth.value = Math.max(240, Math.min(600, startWidth - dx))
      }
    }

    function onResizeEnd() {
      resizing = null
      document.removeEventListener('mousemove', onResizeMove)
      document.removeEventListener('mouseup', onResizeEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => (
      <div style="height: 100%; display: flex; flex-direction: column">
        {/* Header */}
        <header class="pg-header">
          <div class="pg-header__logo">v3sf Playground</div>
          <div class="pg-header__actions">
            <select
              value={selectedAdapter.value}
              onChange={(e: Event) => {
                selectedAdapter.value = (e.target as HTMLSelectElement).value as any
              }}
            >
              <option value="vant">Vant</option>
              <option value="element-plus">Element Plus</option>
            </select>

            <button
              class={['pg-header__btn', previewMode.value === 'mobile' && 'pg-header__btn--active']}
              onClick={() => (previewMode.value = 'mobile')}
            >
              手机
            </button>
            <button
              class={[
                'pg-header__btn',
                previewMode.value === 'desktop' && 'pg-header__btn--active',
              ]}
              onClick={() => (previewMode.value = 'desktop')}
            >
              桌面
            </button>

            <button class="pg-header__btn" onClick={() => (aiVisible.value = true)}>
              AI 助手
            </button>
          </div>
        </header>

        {/* Three-panel layout */}
        <div class="pg-layout">
          {/* Left: Widget Palette */}
          <div class="pg-panel pg-panel--left" style={{ width: `${leftWidth.value}px` }}>
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
          <div class="pg-panel pg-panel--right" style={{ width: `${rightWidth.value}px` }}>
            <div class="pg-panel__title">Schema</div>
            <SchemaEditor />
          </div>
        </div>

        {/* Bottom: Template Gallery */}
        <TemplateGallery />

        {/* AI Chat slide-out */}
        <AiChat visible={aiVisible.value} onClose={() => (aiVisible.value = false)} />
      </div>
    )
  },
})
