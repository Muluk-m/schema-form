import { defineComponent, computed, ref, h } from 'vue'
import { Field, Popup, DatePicker } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantDate',
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
    const show = ref(false)

    const isInteractive = computed(() => !addon.value.disabled && !addon.value.readonly)

    // Vant 4 DatePicker expects columnsType and uses string[] for modelValue
    const dateColumns = computed<string[]>(() => {
      if (!props.modelValue) return []
      // Expect format like "2024-01-15" -> ["2024", "01", "15"]
      return props.modelValue.split('-')
    })

    const onConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
      emit('update:modelValue', selectedValues.join('-'))
      show.value = false
    }

    return () => [
      h(Field, {
        modelValue: props.modelValue,
        readonly: true,
        border: false,
        isLink: isInteractive.value,
        center: true,
        inputAlign: 'right',
        placeholder: addon.value.placeholder,
        disabled: addon.value.disabled,
        onClick: () => {
          if (isInteractive.value) {
            show.value = true
          }
        },
      }),
      h(
        Popup,
        {
          show: show.value,
          'onUpdate:show': (val: boolean) => {
            show.value = val
          },
          position: 'bottom',
        },
        () =>
          h(DatePicker, {
            modelValue: dateColumns.value,
            onCancel: () => {
              show.value = false
            },
            onConfirm,
          }),
      ),
    ]
  },
})
