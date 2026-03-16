import { defineComponent } from 'vue'
import { ElInputNumber } from 'element-plus'

export default defineComponent({
  name: 'ElNumberWidget',
  props: {
    modelValue: { type: Number, default: 0 },
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <ElInputNumber
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
        controlsPosition="right"
      />
    )
  },
})
