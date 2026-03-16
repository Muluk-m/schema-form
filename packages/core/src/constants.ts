import type { InjectionKey, Ref } from 'vue'
import type { FieldWidgetAddon, FormData, Schema } from './types'

export const FORM_KEY = Symbol('v3sf-form') as InjectionKey<{
  formData: Ref<FormData>
  rootSchema: Ref<Schema>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  border: Ref<boolean>
  displayType: Ref<string>
}>

export const ADDON_KEY = Symbol('v3sf-addon') as InjectionKey<Ref<FieldWidgetAddon>>
