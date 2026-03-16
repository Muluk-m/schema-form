import { defineComponent, computed, type PropType } from 'vue'
import Draggable from 'vuedraggable'
import type { WidgetDef, FieldItem } from '../../types'
import { useGlobalState } from '../../hooks'

let uidCounter = 0
function uid(): string {
  return `field_${Date.now().toString(36)}_${(++uidCounter).toString(36)}`
}

export const Sidebar = defineComponent({
  name: 'V3sfSidebar',

  props: {
    widgets: { type: Array as PropType<WidgetDef[]>, required: true },
  },

  setup(props) {
    const state = useGlobalState()

    const grouped = computed(() => {
      const map = new Map<string, WidgetDef[]>()
      for (const w of props.widgets) {
        const cat = w.category || 'Basic'
        if (!map.has(cat)) map.set(cat, [])
        map.get(cat)!.push(w)
      }
      return map
    })

    function handleAdd(widget: WidgetDef) {
      const field: FieldItem = {
        name: uid(),
        schema: { ...widget.defaultSchema } as any,
      }
      state.addField(field)
    }

    return () => (
      <div class="v3sf-Sidebar">
        <div class="v3sf-Sidebar__header">Widgets</div>
        <div class="v3sf-Sidebar__body">
          {Array.from(grouped.value.entries()).map(([category, widgets]) => (
            <div class="v3sf-WidgetGroup" key={category}>
              <div class="v3sf-WidgetGroup__header">
                <span class="v3sf-WidgetGroup__title">{category}</span>
              </div>
              <div class="v3sf-WidgetGroup__content">
                <Draggable
                  list={widgets}
                  class="v3sf-WidgetGroup__content-wrapper"
                  itemKey="type"
                  sort={false}
                  animation={200}
                  ghostClass="v3sf-WidgetItem--put"
                  group={{ name: 'widgets', pull: 'clone', put: false }}
                  clone={(widget: WidgetDef) => ({
                    name: uid(),
                    schema: { ...widget.defaultSchema },
                  })}
                  v-slots={{
                    item: ({ element }: { element: WidgetDef }) => (
                      <div class="v3sf-WidgetItem" onClick={() => handleAdd(element)}>
                        <span class="v3sf-WidgetItem__title">{element.label}</span>
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
})
