import { defineComponent, computed, ref, type PropType } from 'vue'
import { Field, Popup, Picker } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantPicker',

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

    return () => (
      <>
        <Field
          border={false}
          modelValue={displayText.value}
          is-link={isInteractive.value}
          center
          readonly
          inputAlign="right"
          placeholder={addon.value.placeholder}
          disabled={addon.value.disabled}
          onClick={() => {
            if (isInteractive.value) {
              show.value = true
            }
          }}
        />
        <Popup v-model:show={show.value} position="bottom">
          <Picker
            columns={pickerColumns.value}
            onCancel={() => {
              show.value = false
            }}
            onConfirm={onConfirm}
            {...addon.value.props}
          />
        </Popup>
      </>
    )
  },
})
