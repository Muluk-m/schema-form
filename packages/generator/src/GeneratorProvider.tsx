import { defineComponent, toRef, provide, type PropType } from 'vue'
import type { WidgetAdapter, SchemaRaw } from '@v3sf/core'
import type { WidgetDef } from './types'
import { createGlobalState, provideGlobalState } from './hooks'
import { ADAPTER_KEY, WIDGETS_KEY } from './constants'

export const GeneratorProvider = defineComponent({
  name: 'V3sfGeneratorProvider',

  props: {
    schema: { type: Object as PropType<SchemaRaw>, default: undefined },
    adapter: { type: Object as PropType<WidgetAdapter>, required: true },
    widgets: { type: Array as PropType<WidgetDef[]>, required: true },
  },

  setup(props, { slots }) {
    const state = createGlobalState(props.schema)
    provideGlobalState(state)
    provide(ADAPTER_KEY, toRef(props, 'adapter'))
    provide(WIDGETS_KEY, toRef(props, 'widgets'))

    return () => slots.default?.()
  },
})
