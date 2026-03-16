import { defineComponent } from 'vue'
import { ElSwitch } from 'element-plus'

export default defineComponent({
  name: 'ElSwitchWidget',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <ElSwitch
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
      />
    )
  },
})
