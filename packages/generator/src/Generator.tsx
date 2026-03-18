import { defineComponent, onMounted, onBeforeUnmount, watch, type PropType } from 'vue'
import type { WidgetAdapter, SchemaRaw } from '@v3sf/core'
import type { WidgetDef } from './types'
import { GeneratorProvider } from './GeneratorProvider'
import { WidgetPalette, FormCanvas, FieldSettings } from './containers'
import { useGlobalState } from './hooks'

const GeneratorInner = defineComponent({
  name: 'V3sfGeneratorInner',

  emits: ['change', 'select'],

  setup(_, { slots, emit, expose }) {
    const state = useGlobalState()

    // Watch for field changes and emit @change
    watch(
      () => JSON.stringify(state.fields.value),
      () => {
        emit('change', state.buildSchema())
      },
    )

    // Watch for selection changes and emit @select
    watch(
      () => state.selectedField.value,
      (name) => {
        emit('select', name || null)
      },
    )

    // Expose methods
    expose({
      getSchema: () => state.buildSchema(),
      loadSchema: (schema: SchemaRaw) => state.loadSchema(schema),
      undo: () => state.undo(),
      redo: () => state.redo(),
    })

    // Keyboard shortcuts
    function handleKeydown(e: KeyboardEvent) {
      const isCtrl = e.ctrlKey || e.metaKey
      const tag = (e.target as HTMLElement).tagName
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (state.selectedField.value) {
          e.preventDefault()
          state.removeField(state.selectedField.value)
        }
      }

      if (isCtrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        state.undo()
      }

      if (isCtrl && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        state.redo()
      }

      if (isCtrl && e.key === 'c' && !isInput) {
        if (state.selectedField.value) {
          e.preventDefault()
          const field = state.fields.value.find((f) => f.name === state.selectedField.value)
          if (field) {
            state.clipboard.value = JSON.parse(JSON.stringify(field))
          }
        }
      }

      if (isCtrl && e.key === 'v' && !isInput) {
        if (state.clipboard.value) {
          e.preventDefault()
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
          {slots.sidebar?.() ?? <WidgetPalette />}
          {slots.canvas?.() ?? <FormCanvas />}
          {slots.settings?.() ?? <FieldSettings />}
        </div>
      </div>
    )
  },
})

export default defineComponent({
  name: 'V3sfGenerator',

  props: {
    schema: { type: Object as PropType<SchemaRaw>, default: undefined },
    adapter: { type: Object as PropType<WidgetAdapter>, required: true },
    widgets: { type: Array as PropType<WidgetDef[]>, required: true },
  },

  emits: ['change', 'select'],

  setup(props, { slots, emit, expose }) {
    let innerRef: any = null

    expose({
      getSchema: () => innerRef?.getSchema(),
      loadSchema: (schema: SchemaRaw) => innerRef?.loadSchema(schema),
      undo: () => innerRef?.undo(),
      redo: () => innerRef?.redo(),
    })

    return () => (
      <GeneratorProvider schema={props.schema} adapter={props.adapter} widgets={props.widgets}>
        <GeneratorInner
          ref={(el: any) => {
            innerRef = el
          }}
          onChange={(schema: SchemaRaw) => emit('change', schema)}
          onSelect={(name: string | null) => emit('select', name)}
          v-slots={slots}
        />
      </GeneratorProvider>
    )
  },
})
