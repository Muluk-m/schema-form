import { defineComponent, h } from 'vue'
import { Field } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantInput',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    return () =>
      h(Field, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (val: string) => emit('update:modelValue', val),
        border: false,
        inputAlign: 'left',
        disabled: addon.value.disabled,
        readonly: addon.value.readonly,
        placeholder: addon.value.placeholder,
        ...(addon.value.props?.type ? { type: addon.value.props.type } : {}),
      })
  },
})
