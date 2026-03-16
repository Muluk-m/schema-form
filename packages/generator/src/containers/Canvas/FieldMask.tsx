import { defineComponent } from 'vue'
import { useGlobalState } from '../../hooks'
import { useGlobalAction } from '../../hooks'

export default defineComponent({
  name: 'V3sfCanvasFieldMask',

  props: {
    show: { type: Boolean, default: false },
    name: { type: String, default: '' },
  },

  setup(props, { slots }) {
    const state = useGlobalState()
    const { duplicateField } = useGlobalAction()

    function handleDelete(e: Event) {
      e.stopPropagation()
      state.removeField(props.name)
    }

    function handleCopy(e: Event) {
      e.stopPropagation()
      duplicateField(props.name)
    }

    return () => {
      if (!props.show) {
        return <div>{slots.default?.()}</div>
      }

      return (
        <div class="v3sf-Canvas-FieldMask">
          <div class="v3sf-Canvas-FieldMask__helper">
            <span class="v3sf-Canvas-FieldMask__btn" onClick={handleCopy} title="Duplicate">
              &#x2398;
            </span>
            <span class="v3sf-Canvas-FieldMask__btn" onClick={handleDelete} title="Delete">
              &#x2716;
            </span>
          </div>
          <div class="v3sf-Canvas-FieldMask__slot">{slots.default?.()}</div>
        </div>
      )
    }
  },
})
