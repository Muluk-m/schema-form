import { defineComponent } from 'vue'
import { ElInput } from 'element-plus'

export default defineComponent({
  name: 'ElInputWidget',
  props: {
    modelValue: { type: [String, Number], default: '' },
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <ElInput
        modelValue={String(props.modelValue ?? '')}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
        readonly={props.readonly}
        placeholder={props.placeholder}
      />
    )
  },
})
