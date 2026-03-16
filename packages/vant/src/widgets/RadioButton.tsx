import { defineComponent, computed, type PropType } from 'vue'
import { Button } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

export default defineComponent({
  name: 'VantRadioButton',

  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()

    const updateValue = (val: string | number) => {
      emit('update:modelValue', val)
    }

    const options = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? []),
    )

    return () => (
      <div>
        {options.value.map(({ label, value: val, props: itemProps }) => (
          <Button
            key={val}
            size="small"
            disabled={addon.value.disabled}
            type={val === props.modelValue ? 'primary' : 'default'}
            onClick={() => {
              if (!addon.value.readonly && !addon.value.disabled) {
                updateValue(val)
              }
            }}
            {...itemProps}
          >
            {label}
          </Button>
        ))}
      </div>
    )
  },
})
