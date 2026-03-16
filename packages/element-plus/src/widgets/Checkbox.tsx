import { defineComponent, computed } from 'vue'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'ElCheckboxWidget',
  props: {
    modelValue: { type: Array, default: () => [] },
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
      <ElCheckboxGroup
        modelValue={props.modelValue as any[]}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        disabled={props.disabled}
      >
        {options.value.map((opt) => (
          <ElCheckbox key={opt.value} value={opt.value}>
            {opt.label}
          </ElCheckbox>
        ))}
      </ElCheckboxGroup>
    )
  },
})
