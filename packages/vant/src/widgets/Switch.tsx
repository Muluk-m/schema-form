import { defineComponent, h } from 'vue'
import { Switch } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantSwitch',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    return () =>
      h(Switch, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (val: boolean) => emit('update:modelValue', val),
        disabled: addon.value.disabled,
      })
  },
})
