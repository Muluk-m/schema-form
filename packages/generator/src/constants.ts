import type { InjectionKey, Ref } from 'vue'
import type { WidgetAdapter } from '@v3sf/core'
import type { WidgetDef } from './types'

export const ADAPTER_KEY: InjectionKey<Ref<WidgetAdapter>> = Symbol('v3sf-generator-adapter')
export const WIDGETS_KEY: InjectionKey<Ref<WidgetDef[]>> = Symbol('v3sf-generator-widgets')
