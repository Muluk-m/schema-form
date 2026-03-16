import { inject, type Ref } from 'vue'
import type { FieldWidgetAddon, FormData } from '../types'
import { ADDON_KEY } from '../constants'

export function useAddon<FD extends FormData = FormData>(): Ref<FieldWidgetAddon<FD>> {
  const addon = inject<Ref<FieldWidgetAddon<FD>>>(ADDON_KEY)

  if (!addon) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('[v3sf] useAddon must be used inside a SchemaForm widget.')
    }
  }

  return addon!
}
