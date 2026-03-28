import { defineComponent, computed, h } from 'vue'
import { RadioGroup, Radio } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantRadio',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const options = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? []),
    )

    return () =>
      h(
        RadioGroup,
        {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (val: string | number) => emit('update:modelValue', val),
          direction: 'horizontal',
          disabled: addon.value.disabled,
        },
        () =>
          options.value.map(({ label, value: val }) =>
            h(Radio, { key: val, name: val }, () => label),
          ),
      )
  },
})
