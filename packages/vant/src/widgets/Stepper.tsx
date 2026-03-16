import { defineComponent, computed } from 'vue'
import { Stepper } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantStepper',

  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const value = computed({
      get: () => props.modelValue,
      set: (val: number) => emit('update:modelValue', val),
    })

    return () => (
      <Stepper v-model={value.value} disabled={addon.value.disabled} {...addon.value.props} />
    )
  },
})
