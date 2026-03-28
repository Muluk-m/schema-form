import { defineComponent, computed, ref, h, type PropType } from 'vue'
import { Field, Popup, Picker } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantPicker',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()
    const show = ref(false)

    const pickerColumns = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? []).map(
        ({ label, value: val, props: itemProps }) => ({
          text: label,
          value: val,
          ...itemProps,
        }),
      ),
    )

    const displayText = computed(
      () => pickerColumns.value.find((col) => col.value === props.modelValue)?.text ?? '',
    )

    const isInteractive = computed(() => !addon.value.readonly && !addon.value.disabled)

    const onConfirm = ({ selectedValues }: { selectedValues: (string | number)[] }) => {
      emit('update:modelValue', selectedValues[0])
      show.value = false
    }

    return () => [
      h(Field, {
        modelValue: displayText.value,
        border: false,
        isLink: isInteractive.value,
        center: true,
        readonly: true,
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
          h(Picker, {
            columns: pickerColumns.value,
            onCancel: () => {
              show.value = false
            },
            onConfirm,
          }),
      ),
    ]
  },
})
