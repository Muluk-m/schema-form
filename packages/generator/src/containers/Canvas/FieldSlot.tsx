import { defineComponent, ref, h, type PropType, type Component } from 'vue'
import type { FieldItem } from '../../types'
import { useGlobalState } from '../../hooks'
import { useGlobalAction } from '../../hooks'

export const FieldSlot = defineComponent({
  name: 'V3sfFieldSlot',

  props: {
    field: { type: Object as PropType<FieldItem>, required: true },
    selected: { type: Boolean, default: false },
    passthrough: { type: Boolean, default: false },
    index: { type: Number, required: true },
    total: { type: Number, required: true },
    schemaForm: { type: [Object, Function, null] as PropType<Component | null>, default: null },
  },

  emits: ['select', 'dblclick'],

  setup(props, { emit }) {
    const state = useGlobalState()
    const { duplicateField } = useGlobalAction()
    const hovered = ref(false)

    function handleClick(e: MouseEvent) {
      e.stopPropagation()
      emit('select', props.field.name)
    }

    function handleDblClick(e: MouseEvent) {
      e.stopPropagation()
      emit('dblclick', props.field.name)
    }

    function handleMoveUp(e: MouseEvent) {
      e.stopPropagation()
      if (props.index > 0) {
        state.moveField(props.index, props.index - 1)
      }
    }

    function handleMoveDown(e: MouseEvent) {
      e.stopPropagation()
      if (props.index < props.total - 1) {
        state.moveField(props.index, props.index + 1)
      }
    }

    function handleDuplicate(e: MouseEvent) {
      e.stopPropagation()
      duplicateField(props.field.name)
    }

    function handleDelete(e: MouseEvent) {
      e.stopPropagation()
      state.removeField(props.field.name)
    }

    return () => {
      const singleFieldSchema = {
        type: 'object',
        properties: { [props.field.name]: props.field.schema },
      }

      return (
        <div
          class={[
            'v3sf-FieldSlot',
            hovered.value && !props.selected && 'v3sf-FieldSlot--hovered',
            props.selected && 'v3sf-FieldSlot--selected',
            props.passthrough && 'v3sf-FieldSlot--passthrough',
          ]}
          onMouseenter={() => {
            if (!props.passthrough) hovered.value = true
          }}
          onMouseleave={() => {
            hovered.value = false
          }}
        >
          {/* Layer 1: Real component rendering */}
          <div class="v3sf-FieldSlot__content">
            {props.schemaForm ? (
              h(props.schemaForm, { schema: singleFieldSchema, modelValue: {} })
            ) : (
              <div class="v3sf-FieldSlot__fallback">
                <span>{props.field.schema.title || props.field.name}</span>
                <span class="v3sf-FieldSlot__type">
                  {(props.field.schema as any).widget || (props.field.schema as any).type}
                </span>
              </div>
            )}
          </div>

          {/* Layer 2: Interaction overlay */}
          {!props.passthrough && (
            <div
              class="v3sf-FieldSlot__overlay"
              onClick={handleClick}
              onDblclick={handleDblClick}
            />
          )}

          {/* Toolbar (bottom, only when selected) */}
          {props.selected && !props.passthrough && (
            <div class="v3sf-FieldToolbar">
              <button
                class="v3sf-FieldToolbar__btn"
                onClick={handleMoveUp}
                disabled={props.index === 0}
                title="上移"
              >
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="7" y1="11" x2="7" y2="3" />
                  <polyline points="4,6 7,3 10,6" />
                </svg>
              </button>
              <button
                class="v3sf-FieldToolbar__btn"
                onClick={handleMoveDown}
                disabled={props.index >= props.total - 1}
                title="下移"
              >
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="7" y1="3" x2="7" y2="11" />
                  <polyline points="4,8 7,11 10,8" />
                </svg>
              </button>
              <button class="v3sf-FieldToolbar__btn" onClick={handleDuplicate} title="复制">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4">
                  <rect x="1" y="3" width="8" height="8" rx="1" />
                  <rect x="5" y="1" width="8" height="8" rx="1" />
                </svg>
              </button>
              <button
                class="v3sf-FieldToolbar__btn v3sf-FieldToolbar__btn--danger"
                onClick={handleDelete}
                title="删除"
              >
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                >
                  <line x1="3" y1="3" x2="11" y2="11" />
                  <line x1="11" y1="3" x2="3" y2="11" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )
    }
  },
})
