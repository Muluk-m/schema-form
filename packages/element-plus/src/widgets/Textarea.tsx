import { defineComponent } from 'vue'
import { ElInput } from 'element-plus'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'ElTextareaWidget',
  props: {
    modelValue: { type: String, default: '' },
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const addon = useAddon()
    return () => (
      <ElInput
        type="textarea"
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
        readonly={props.readonly}
        placeholder={props.placeholder}
        rows={addon.value.props?.rows ?? 3}
        autosize={addon.value.props?.autosize}
      />
    )
  },
})
