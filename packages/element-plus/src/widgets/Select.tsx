import { defineComponent, computed } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'ElSelectWidget',
  props: {
    modelValue: { type: [String, Number], default: '' },
    disabled: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const addon = useAddon()
    const options = computed(() => {
      const schema = addon.value.schema
      const values = schema.enum ?? []
      const labels = schema.enumNames ?? values
      return values.map((val, i) => ({ label: String(labels[i] ?? val), value: val }))
    })

    return () => (
      <ElSelect
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
        placeholder={props.placeholder}
      >
        {options.value.map((opt) => (
          <ElOption key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </ElSelect>
    )
  },
})
