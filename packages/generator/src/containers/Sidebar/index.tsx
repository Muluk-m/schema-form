import { defineComponent, computed, inject } from 'vue'
import Draggable from 'vuedraggable'
import type { WidgetDef, FieldItem } from '../../types'
import { useGlobalState } from '../../hooks'
import { WIDGETS_KEY } from '../../constants'

let uidCounter = 0
function uid(): string {
  return `field_${Date.now().toString(36)}_${(++uidCounter).toString(36)}`
}

export const WidgetPalette = defineComponent({
  name: 'V3sfWidgetPalette',

  setup() {
    const state = useGlobalState('WidgetPalette')
    const widgets = inject(WIDGETS_KEY)

    if (!widgets) {
      throw new Error('<WidgetPalette> must be used inside <GeneratorProvider>')
    }

    const grouped = computed(() => {
      const map = new Map<string, WidgetDef[]>()
      for (const w of widgets.value) {
        const cat = w.category || '基础'
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
      <div class="v3sf-WidgetPalette">
        <div class="v3sf-WidgetPalette__header">组件</div>
        <div class="v3sf-WidgetPalette__body">
          {Array.from(grouped.value.entries()).map(([category, categoryWidgets]) => (
            <div class="v3sf-WidgetGroup" key={category}>
              <div class="v3sf-WidgetGroup__header">
                <span class="v3sf-WidgetGroup__title">{category}</span>
              </div>
              <div class="v3sf-WidgetGroup__content">
                <Draggable
                  list={categoryWidgets}
                  class="v3sf-WidgetGroup__content-wrapper"
                  itemKey="type"
                  sort={false}
                  animation={200}
                  ghostClass="v3sf-WidgetItem--ghost"
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
