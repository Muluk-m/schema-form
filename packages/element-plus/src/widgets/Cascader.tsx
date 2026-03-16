import { defineComponent } from 'vue'
import { ElCascader } from 'element-plus'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'ElCascaderWidget',
  props: {
    modelValue: { type: Array, default: () => [] },
    disabled: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const addon = useAddon()

    return () => (
      <ElCascader
        modelValue={props.modelValue as any[]}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        options={addon.value.props?.options ?? []}
      />
    )
  },
})
