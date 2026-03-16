import { defineComponent, computed, type PropType } from 'vue'
import { CheckboxGroup, Checkbox } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantCheckbox',

  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const value = computed({
      get: () => props.modelValue,
      set: (val: any[]) => emit('update:modelValue', val),
    })

    const options = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? []),
    )

    return () => (
      <CheckboxGroup
        v-model={value.value}
        direction="horizontal"
        disabled={addon.value.disabled}
        {...addon.value.props}
      >
        {options.value.map(({ label, value: val, props: itemProps }) => (
          <Checkbox key={val} name={val} {...itemProps}>
            {label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    )
  },
})
