import { defineComponent, computed } from 'vue'
import { RadioGroup, Radio } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantRadio',

  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const value = computed({
      get: () => props.modelValue,
      set: (val: string | number) => emit('update:modelValue', val),
    })

    const options = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? []),
    )

    return () => (
      <RadioGroup
        v-model={value.value}
        direction="horizontal"
        disabled={addon.value.disabled}
        {...addon.value.props}
      >
        {options.value.map(({ label, value: val, props: itemProps }) => (
          <Radio key={val} name={val} {...itemProps}>
            {label}
          </Radio>
        ))}
      </RadioGroup>
    )
  },
})
