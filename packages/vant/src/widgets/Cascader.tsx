import { defineComponent, computed, ref, type PropType } from 'vue'
import { Field, Popup, Picker } from 'vant'
import { useAddon } from '@v3sf/core'
import { getWidgetOptionsBySchema } from '../utils'

interface CascaderColumn {
  text: string
  value: string | number
  children?: CascaderColumn[]
}

function transformOptions(list: any[]): CascaderColumn[] {
  if (!Array.isArray(list)) return []
  return list.map(({ label, value, children, props }) => ({
    text: label,
    value,
    ...(Array.isArray(children) ? { children: transformOptions(children) } : {}),
    ...props,
  }))
}

export default defineComponent({
  name: 'VantCascader',

  props: {
    modelValue: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const addon = useAddon()
    const show = ref(false)

    const cascaderColumns = computed(() =>
      transformOptions(
        getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? []),
      ),
    )

    const displayText = computed(() => {
      const ids = props.modelValue
      let names = ''
      let curLevel = cascaderColumns.value as CascaderColumn[]

      for (let i = 0; i < ids.length; i++) {
        const option = curLevel.find((item) => item.value === ids[i])
        if (option) {
          curLevel = option.children ?? []
          names += names ? `/${option.text}` : option.text
        }
      }

      return names
    })

    const isInteractive = computed(() => !addon.value.readonly && !addon.value.disabled)

    const onConfirm = ({ selectedValues }: { selectedValues: (string | number)[] }) => {
      emit('update:modelValue', selectedValues.filter(Boolean))
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
            columns={cascaderColumns.value}
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
