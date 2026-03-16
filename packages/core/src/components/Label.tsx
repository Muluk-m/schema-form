import { defineComponent } from 'vue'
import { createNamespace } from '../utils'

const [name, bem] = createNamespace('form-label')

export default defineComponent({
  name,

  props: {
    title: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },

  setup(props) {
    return () => (
      <div class={bem()}>
        {props.required && <span class={bem('required')}>*</span>}
        <span class={bem('title')}>{props.title}</span>
      </div>
    )
  },
})
