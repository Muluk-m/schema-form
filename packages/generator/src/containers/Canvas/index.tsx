import { defineComponent, type PropType } from 'vue'
import Draggable from 'vuedraggable'
import type { WidgetAdapter } from '@v3sf/core'
import type { FieldItem } from '../../types'
import { useGlobalState } from '../../hooks'
import { MobileSimulator } from '../../simulators'
import FieldMask from './FieldMask'

export const Canvas = defineComponent({
  name: 'V3sfCanvas',

  props: {
    adapter: { type: Object as PropType<WidgetAdapter>, required: true },
  },

  setup(_props) {
    const state = useGlobalState()

    function handleFieldClick(e: MouseEvent, fieldName: string) {
      e.stopPropagation()
      state.selectField(fieldName)
    }

    function handleCanvasClick() {
      state.selectField('')
    }

    return () => (
      <div class="v3sf-Canvas" onClick={handleCanvasClick}>
        <MobileSimulator>
          <div class="v3sf-Canvas__panel">
            <Draggable
              list={state.fields.value}
              class="v3sf-Canvas__panel-setting"
              itemKey="name"
              animation={200}
              ghostClass="v3sf-Canvas-FieldWrapper--put"
              group={{ name: 'widgets', pull: false, put: true }}
              v-slots={{
                item: ({ element }: { element: FieldItem }) => {
                  const isSelected = state.selectedField.value === element.name
                  return (
                    <div
                      class={[
                        'v3sf-Canvas-FieldWrapper',
                        isSelected && 'v3sf-Canvas-FieldWrapper--selected',
                      ]}
                      onMousedown={(e: MouseEvent) => handleFieldClick(e, element.name)}
                    >
                      <FieldMask show={isSelected} name={element.name}>
                        <div class="v3sf-Canvas-FieldWrapper__content">
                          <span>{element.schema.title || element.name}</span>
                          {element.schema.type && (
                            <span class="v3sf-Canvas-FieldWrapper__type">
                              {element.schema.widget || element.schema.type}
                            </span>
                          )}
                        </div>
                      </FieldMask>
                    </div>
                  )
                },
              }}
            />
            {state.fields.value.length === 0 && (
              <div class="v3sf-Canvas-Empty">
                <p>Drag widgets from the left panel to add fields</p>
              </div>
            )}
          </div>
        </MobileSimulator>
      </div>
    )
  },
})
