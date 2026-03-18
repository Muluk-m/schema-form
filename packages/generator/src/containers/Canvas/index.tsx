import { defineComponent, computed, ref, inject } from 'vue'
import Draggable from 'vuedraggable'
import { createSchemaForm } from '@v3sf/core'
import type { FieldItem } from '../../types'
import { useGlobalState } from '../../hooks'
import { ADAPTER_KEY } from '../../constants'
import { FieldSlot } from './FieldSlot'

export const FormCanvas = defineComponent({
  name: 'V3sfFormCanvas',

  setup() {
    const state = useGlobalState('FormCanvas')
    const adapter = inject(ADAPTER_KEY)

    const SchemaFormComp = computed(() => {
      return adapter?.value ? createSchemaForm(adapter.value) : null
    })

    const passthroughField = ref<string | null>(null)

    function handleCanvasClick() {
      state.selectField('')
      passthroughField.value = null
    }

    function handleFieldSelect(name: string) {
      state.selectField(name)
      passthroughField.value = null
    }

    function handleFieldDblClick(name: string) {
      passthroughField.value = name
    }

    return () => (
      <div class="v3sf-FormCanvas" onClick={handleCanvasClick}>
        <Draggable
          list={state.fields.value}
          class="v3sf-FormCanvas__list"
          itemKey="name"
          animation={200}
          ghostClass="v3sf-FieldSlot--ghost"
          group={{ name: 'widgets', pull: false, put: true }}
          v-slots={{
            item: ({ element, index }: { element: FieldItem; index: number }) => {
              const isSelected = state.selectedField.value === element.name
              const isPassthrough = passthroughField.value === element.name

              return (
                <FieldSlot
                  field={element}
                  selected={isSelected}
                  passthrough={isPassthrough}
                  index={index}
                  total={state.fields.value.length}
                  schemaForm={SchemaFormComp.value}
                  onSelect={handleFieldSelect}
                  onDblclick={handleFieldDblClick}
                />
              )
            },
          }}
        />
        {state.fields.value.length === 0 && (
          <div class="v3sf-FormCanvas__empty">
            <svg
              class="v3sf-FormCanvas__empty-icon"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              opacity="0.4"
            >
              <rect x="4" y="8" width="40" height="12" rx="3" />
              <rect x="4" y="24" width="28" height="12" rx="3" />
              <line x1="8" y1="14" x2="24" y2="14" />
              <line x1="8" y1="30" x2="20" y2="30" />
            </svg>
            <p class="v3sf-FormCanvas__empty-text">从左侧拖入组件</p>
          </div>
        )}
      </div>
    )
  },
})
