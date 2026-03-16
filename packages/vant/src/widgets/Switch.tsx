import { defineComponent, computed } from 'vue'
import { Switch } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantSwitch',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const value = computed({
      get: () => props.modelValue,
      set: (val: boolean) => emit('update:modelValue', val),
    })

    return () => (
      <Switch v-model={value.value} disabled={addon.value.disabled} {...addon.value.props} />
    )
  },
})
