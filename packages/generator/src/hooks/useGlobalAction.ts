import type { SchemaRaw } from '@v3sf/core'
import type { FieldItem } from '../types'
import { useGlobalState } from './useGlobal'

let uidCounter = 0
function uid(): string {
  return `field_${Date.now().toString(36)}_${(++uidCounter).toString(36)}`
}

export function useGlobalAction() {
  const state = useGlobalState()

  function duplicateField(name: string) {
    const field = state.fields.value.find((f) => f.name === name)
    if (!field) return

    const idx = state.fields.value.findIndex((f) => f.name === name)
    const newField: FieldItem = {
      name: uid(),
      schema: JSON.parse(JSON.stringify(field.schema)),
    }
    state.addField(newField, idx + 1)
  }

  function copyField(name: string) {
    const field = state.fields.value.find((f) => f.name === name)
    if (!field) return
    state.clipboard.value = JSON.parse(JSON.stringify(field))
  }

  function pasteField() {
    if (!state.clipboard.value) return

    const idx = state.selectedField.value
      ? state.fields.value.findIndex((f) => f.name === state.selectedField.value) + 1
      : state.fields.value.length

    const newField: FieldItem = {
      name: uid(),
      schema: JSON.parse(JSON.stringify(state.clipboard.value.schema)),
    }
    state.addField(newField, idx)
  }

  function importSchema(jsonStr: string): boolean {
    try {
      const schema = JSON.parse(jsonStr) as SchemaRaw
      if (!schema || typeof schema !== 'object') return false
      state.loadSchema(schema)
      return true
    } catch {
      return false
    }
  }

  function exportSchema(): string {
    return JSON.stringify(state.buildSchema(), null, 2)
  }

  return {
    duplicateField,
    copyField,
    pasteField,
    importSchema,
    exportSchema,
  }
}
