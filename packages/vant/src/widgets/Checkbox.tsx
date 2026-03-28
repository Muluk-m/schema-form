import { defineComponent, computed, h, type PropType } from 'vue'
import { CheckboxGroup, Checkbox } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantCheckbox',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
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
        CheckboxGroup,
        {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (val: any[]) => emit('update:modelValue', val),
          direction: 'horizontal',
          disabled: addon.value.disabled,
        },
        () =>
          options.value.map(({ label, value: val }) =>
            h(Checkbox, { key: val, name: val }, () => label),
          ),
      )
  },
})
