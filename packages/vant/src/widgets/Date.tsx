import { defineComponent, computed, ref } from 'vue'
import { Field, Popup, DatePicker } from 'vant'
import { useAddon } from '@v3sf/core'

export default defineComponent({
  name: 'VantDate',

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

    return () => (
      <>
        <Field
          modelValue={props.modelValue}
          readonly
          border={false}
          is-link={isInteractive.value}
          center
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
          <DatePicker
            modelValue={dateColumns.value}
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
