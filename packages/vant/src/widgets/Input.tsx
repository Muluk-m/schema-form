import { defineComponent, computed } from 'vue'
import { Field } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantInput',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const value = computed({
      get: () => props.modelValue,
      set: (val: string) => emit('update:modelValue', val),
    })

    const fieldProps = computed(() => ({
      inputAlign: addon.value.props?.type === 'textarea' ? 'left' : ('right' as const),
      ...addon.value.props,
    }))

    return () => (
      <Field
        v-model={value.value}
        border={false}
        disabled={addon.value.disabled}
        readonly={addon.value.readonly}
        placeholder={addon.value.placeholder}
        {...fieldProps.value}
      />
    )
  },
})
