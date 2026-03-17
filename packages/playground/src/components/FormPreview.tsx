import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import { elementPlusAdapter } from '@v3sf/element-plus'
import { useSchema } from '../composables/useSchema'

export default defineComponent({
  name: 'FormPreview',
  setup() {
    const {
      schema,
      formData,
      selectedAdapter,
      previewMode,
      selectedField,
      selectField,
      removeField,
      duplicateField,
      moveField,
    } = useSchema()

    const isDragOver = ref(false)

    const VantForm = createSchemaForm(vantAdapter)
    const ElementForm = createSchemaForm(elementPlusAdapter)

    const CurrentForm = computed(() => {
      return selectedAdapter.value === 'vant' ? VantForm : ElementForm
    })

    const hasFields = computed(() => {
      return Object.keys(schema.value.properties ?? {}).length > 0
    })

    const fieldKeys = computed(() => Object.keys(schema.value.properties ?? {}))

    // Keyboard shortcut: Delete selected field
    function handleKeydown(e: KeyboardEvent) {
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedField.value &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault()
        removeField(selectedField.value)
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    // --- Drop handling ---
    function handleDragOver(e: DragEvent) {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'
      }
      isDragOver.value = true
    }

    function handleDragLeave() {
      isDragOver.value = false
    }

    function handleDrop(e: DragEvent) {
      e.preventDefault()
      isDragOver.value = false
      const data = e.dataTransfer?.getData('application/json')
      if (!data) return
      try {
        const item = JSON.parse(data)
        if (item.widget && item.defaultSchema) {
          const properties = schema.value.properties ?? {}
          let index = 1
          while (`${item.widget}_${index}` in properties) {
            index++
          }
          const { addField } = useSchema()
          addField(`${item.widget}_${index}`, { ...item.defaultSchema })
        }
      } catch {
        // ignore
      }
    }

    // --- SVG icons for status bar ---
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

    // --- Toolbar icons ---
    const DeleteIcon = () => (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      >
        <line x1="3" y1="3" x2="11" y2="11" />
        <line x1="11" y1="3" x2="3" y2="11" />
      </svg>
    )

    const DuplicateIcon = () => (
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3">
        <rect x="1" y="3" width="8" height="8" rx="1" />
        <rect x="5" y="1" width="8" height="8" rx="1" />
      </svg>
    )

    const ArrowUpIcon = () => (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="7" y1="11" x2="7" y2="3" />
        <polyline points="4,6 7,3 10,6" />
      </svg>
    )

    const ArrowDownIcon = () => (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="7" y1="3" x2="7" y2="11" />
        <polyline points="4,8 7,11 10,8" />
      </svg>
    )

    // Ghost widget icon for empty state
    const GhostWidgetIcon = () => (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4">
        <rect x="4" y="8" width="40" height="12" rx="3" />
        <rect x="4" y="24" width="28" height="12" rx="3" />
        <circle cx="38" cy="30" r="6" />
        <line x1="8" y1="14" x2="24" y2="14" />
        <line x1="8" y1="30" x2="20" y2="30" />
      </svg>
    )

    function renderForm() {
      const Form = CurrentForm.value
      return (
        <Form
          schema={schema.value as any}
          modelValue={formData.value}
          onUpdate:modelValue={(val: any) => {
            formData.value = val
          }}
          border={true}
          displayType="column"
        />
      )
    }

    function renderFieldWrappers() {
      const Form = CurrentForm.value
      const keys = fieldKeys.value

      return (
        <div>
          {keys.map((key, index) => (
            <div
              key={key}
              class={['pg-preview__field-wrapper', { 'is-selected': selectedField.value === key }]}
              onClick={(e: MouseEvent) => {
                e.stopPropagation()
                selectField(key)
              }}
            >
              {selectedField.value === key && (
                <div class="pg-preview__field-toolbar">
                  {index > 0 && (
                    <button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                        moveField(key, 'up')
                      }}
                      title="上移"
                    >
                      <ArrowUpIcon />
                    </button>
                  )}
                  {index < keys.length - 1 && (
                    <button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                        moveField(key, 'down')
                      }}
                      title="下移"
                    >
                      <ArrowDownIcon />
                    </button>
                  )}
                  <button
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation()
                      duplicateField(key)
                    }}
                    title="复制"
                  >
                    <DuplicateIcon />
                  </button>
                  <button
                    class="is-danger"
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation()
                      removeField(key)
                    }}
                    title="删除"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
          {/* Render the actual form below field wrappers using a single SchemaForm */}
        </div>
      )
    }

    function renderContent() {
      // Render the form and overlay click areas for field selection
      return <div onClick={() => selectField(null)}>{renderForm()}</div>
    }

    return () => {
      const dropProps = {
        onDragover: handleDragOver,
        onDragleave: handleDragLeave,
        onDrop: handleDrop,
      }

      if (!hasFields.value) {
        return (
          <div
            class={['pg-preview__empty', isDragOver.value && 'pg-preview__drop-active']}
            {...dropProps}
          >
            <GhostWidgetIcon />
            <span class="pg-preview__empty-title">拖拽组件到这里</span>
            <span class="pg-preview__empty-hint">或选择底部模板快速开始</span>
          </div>
        )
      }

      if (previewMode.value === 'mobile') {
        return (
          <div
            class={['pg-preview__mobile-frame', isDragOver.value && 'pg-preview__drop-active']}
            {...dropProps}
          >
            <div class="pg-preview__status-bar">
              <span class="status-time">9:41</span>
              <div class="pg-preview__dynamic-island" />
              <div class="status-icons">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>
            <div class="pg-preview__content">{renderContent()}</div>
            <div class="pg-preview__home-indicator" />
          </div>
        )
      }

      return (
        <div
          class={['pg-preview__desktop-frame', isDragOver.value && 'pg-preview__drop-active']}
          {...dropProps}
        >
          {renderContent()}
        </div>
      )
    }
  },
})
