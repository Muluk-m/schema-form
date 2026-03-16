import { defineComponent, computed } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'ElRadioWidget',
  props: {
    modelValue: { type: [String, Number], default: '' },
    disabled: Boolean,
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
      <ElRadioGroup
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
      >
        {options.value.map((opt) => (
          <ElRadio key={opt.value} value={opt.value}>
            {opt.label}
          </ElRadio>
        ))}
      </ElRadioGroup>
    )
  },
})
