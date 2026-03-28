import { defineComponent, h } from 'vue'
import { Stepper } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantStepper',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    return () =>
      h(Stepper, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (val: number) => emit('update:modelValue', val),
        disabled: addon.value.disabled,
      })
  },
})
