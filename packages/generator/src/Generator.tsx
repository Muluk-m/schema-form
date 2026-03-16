import { defineComponent, onMounted, onBeforeUnmount, type PropType } from 'vue'
import type { WidgetAdapter, SchemaRaw } from '@v3sf/core'
import type { WidgetDef } from './types'
import { createGlobalState, provideGlobalState } from './hooks'
import { Sidebar, Canvas, Settings } from './containers'

export default defineComponent({
  name: 'V3sfGenerator',

  props: {
    schema: { type: Object as PropType<SchemaRaw>, default: undefined },
    adapter: { type: Object as PropType<WidgetAdapter>, required: true },
    widgets: { type: Array as PropType<WidgetDef[]>, required: true },
  },

  setup(props) {
    const state = createGlobalState(props.schema)
    provideGlobalState(state)

    // Keyboard shortcuts
    function handleKeydown(e: KeyboardEvent) {
      const isCtrl = e.ctrlKey || e.metaKey

      // Delete: remove selected field
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only if not inside an input/textarea
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

        if (state.selectedField.value) {
          e.preventDefault()
          state.removeField(state.selectedField.value)
        }
      }

      // Ctrl+Z: undo
      if (isCtrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        state.undo()
      }

      // Ctrl+Shift+Z: redo
      if (isCtrl && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        state.redo()
      }

      // Ctrl+C: copy field
      if (isCtrl && e.key === 'c') {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

        if (state.selectedField.value) {
          e.preventDefault()
          const field = state.fields.value.find((f) => f.name === state.selectedField.value)
          if (field) {
            state.clipboard.value = JSON.parse(JSON.stringify(field))
          }
        }
      }

      // Ctrl+V: paste field
      if (isCtrl && e.key === 'v') {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

        if (state.clipboard.value) {
          e.preventDefault()
          // Use a deferred approach: we need useGlobalAction but it requires inject context
          // Instead, handle paste inline
          const idx = state.selectedField.value
            ? state.fields.value.findIndex((f) => f.name === state.selectedField.value) + 1
            : state.fields.value.length

          const newField = {
            name: `field_${Date.now().toString(36)}_paste`,
            schema: JSON.parse(JSON.stringify(state.clipboard.value.schema)),
          }
          state.addField(newField, idx)
        }
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return () => (
      <div class="v3sf-Generator">
        <div class="v3sf-Generator__container">
          <Sidebar widgets={props.widgets} />
          <Canvas adapter={props.adapter} />
          <Settings />
        </div>
      </div>
    )
  },
})
