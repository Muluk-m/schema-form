import { defineComponent, computed, provide, h as createElement, type PropType } from 'vue'
import type { FieldWidgetAddon, WidgetAdapter, FormData } from '../types'
import { ADDON_KEY } from '../constants'
import { getWidgetForField } from '../adapter'
import { createNamespace } from '../utils'
import Label from './Label'

const [name, bem] = createNamespace('form-field')

export default defineComponent({
  name,

  props: {
    name: { type: String, required: true },
    addon: { type: Object as PropType<FieldWidgetAddon>, required: true },
    adapter: { type: Object as PropType<WidgetAdapter>, required: true },
    formData: { type: Object as PropType<FormData>, required: true },
    errorMessage: { type: String, default: '' },
    displayType: { type: String as PropType<'row' | 'column'>, default: 'row' },
    border: { type: Boolean, default: true },
  },

  emits: ['updateValue'],

  setup(props, { emit }) {
    provide(
      ADDON_KEY,
      computed(() => props.addon),
    )

    const fieldValue = computed({
      get: () => props.formData[props.name],
      set: (value: unknown) => emit('updateValue', value),
    })

    const resolved = computed(() =>
      getWidgetForField(props.adapter, props.addon.schema.widget, props.addon.schema.type),
    )

    const mappedProps = computed(() => {
      const propsMap = resolved.value?.propsMap ?? {}
      const standardProps: Record<string, any> = {
        disabled: props.addon.disabled,
        readonly: props.addon.readonly,
        placeholder: props.addon.placeholder,
        error: props.errorMessage,
        ...(props.addon.props ?? {}),
      }

      const result: Record<string, any> = {}
      for (const [key, value] of Object.entries(standardProps)) {
        const mappedKey = propsMap[key] ?? key
        result[mappedKey] = value
      }
      return result
    })

    const title = computed(() => props.addon.schema.title ?? props.name)

    return () => {
      const WidgetComponent = resolved.value?.component

      if (!WidgetComponent) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[v3sf] No widget found for field "${props.name}" (widget: ${props.addon.schema.widget}, type: ${props.addon.schema.type})`,
          )
        }
        return (
          <div class={bem()} data-field={props.name}>
            <span class={bem('fallback')}>
              Unknown widget: {props.addon.schema.widget ?? props.addon.schema.type}
            </span>
          </div>
        )
      }

      return (
        <div
          class={[bem(), bem({ column: props.displayType === 'column' }), props.addon.className]}
          data-field={props.name}
        >
          {props.addon.schema.title && (
            <Label title={title.value} required={props.addon.required} />
          )}
          <div class={bem('content')}>
            {createElement(WidgetComponent, {
              ...mappedProps.value,
              modelValue: fieldValue.value,
              'onUpdate:modelValue': (val: any) => {
                fieldValue.value = val
              },
            })}
            {props.errorMessage && <div class={bem('error-message')}>{props.errorMessage}</div>}
          </div>
        </div>
      )
    }
  },
})
