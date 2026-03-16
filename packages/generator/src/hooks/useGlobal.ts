import { ref, computed, provide, inject, type InjectionKey, type Ref } from 'vue'
import type { SchemaRaw } from '@v3sf/core'
import type { FieldItem, HistoryEntry } from '../types'

export interface GlobalState {
  fields: Ref<FieldItem[]>
  selectedField: Ref<string>
  history: Ref<HistoryEntry[]>
  historyIndex: Ref<number>
  clipboard: Ref<FieldItem | null>
  addField: (field: FieldItem, index?: number) => void
  removeField: (name: string) => void
  updateField: (name: string, schema: SchemaRaw) => void
  selectField: (name: string) => void
  moveField: (fromIndex: number, toIndex: number) => void
  undo: () => void
  redo: () => void
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  buildSchema: () => SchemaRaw
  loadSchema: (schema: SchemaRaw) => void
}

const GLOBAL_STATE_KEY: InjectionKey<GlobalState> = Symbol('generator-global')

let uidCounter = 0
function uid(): string {
  return `field_${Date.now().toString(36)}_${(++uidCounter).toString(36)}`
}

function pushHistory(state: {
  fields: Ref<FieldItem[]>
  selectedField: Ref<string>
  history: Ref<HistoryEntry[]>
  historyIndex: Ref<number>
}) {
  // Trim any redo entries beyond current index
  state.history.value = state.history.value.slice(0, state.historyIndex.value + 1)
  state.history.value.push({
    fields: JSON.parse(JSON.stringify(state.fields.value)),
    selectedField: state.selectedField.value,
  })
  state.historyIndex.value = state.history.value.length - 1
}

export function createGlobalState(initialSchema?: SchemaRaw): GlobalState {
  const fields = ref<FieldItem[]>([])
  const selectedField = ref<string>('')
  const history = ref<HistoryEntry[]>([])
  const historyIndex = ref<number>(-1)
  const clipboard = ref<FieldItem | null>(null)

  // Load initial schema if provided
  if (initialSchema?.properties) {
    const properties = initialSchema.properties as Record<string, SchemaRaw>
    for (const [name, schema] of Object.entries(properties)) {
      fields.value.push({ name, schema: schema as SchemaRaw })
    }
  }

  // Push initial state
  pushHistory({ fields, selectedField, history, historyIndex })

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function addField(field: FieldItem, index?: number) {
    // Ensure unique name
    const existingNames = new Set(fields.value.map((f) => f.name))
    if (existingNames.has(field.name)) {
      field = { ...field, name: uid() }
    }

    if (index !== undefined && index >= 0 && index <= fields.value.length) {
      fields.value.splice(index, 0, field)
    } else {
      fields.value.push(field)
    }
    selectedField.value = field.name
    pushHistory({ fields, selectedField, history, historyIndex })
  }

  function removeField(name: string) {
    const idx = fields.value.findIndex((f) => f.name === name)
    if (idx === -1) return

    fields.value.splice(idx, 1)

    // Select neighbor
    if (selectedField.value === name) {
      const newIdx = Math.min(idx, fields.value.length - 1)
      selectedField.value = newIdx >= 0 ? fields.value[newIdx].name : ''
    }
    pushHistory({ fields, selectedField, history, historyIndex })
  }

  function updateField(name: string, schema: SchemaRaw) {
    const field = fields.value.find((f) => f.name === name)
    if (field) {
      field.schema = schema
      pushHistory({ fields, selectedField, history, historyIndex })
    }
  }

  function selectField(name: string) {
    selectedField.value = name
  }

  function moveField(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || fromIndex >= fields.value.length) return
    if (toIndex < 0 || toIndex >= fields.value.length) return

    const [item] = fields.value.splice(fromIndex, 1)
    fields.value.splice(toIndex, 0, item)
    pushHistory({ fields, selectedField, history, historyIndex })
  }

  function undo() {
    if (!canUndo.value) return
    historyIndex.value--
    const entry = history.value[historyIndex.value]
    fields.value = JSON.parse(JSON.stringify(entry.fields))
    selectedField.value = entry.selectedField
  }

  function redo() {
    if (!canRedo.value) return
    historyIndex.value++
    const entry = history.value[historyIndex.value]
    fields.value = JSON.parse(JSON.stringify(entry.fields))
    selectedField.value = entry.selectedField
  }

  function buildSchema(): SchemaRaw {
    const properties: Record<string, SchemaRaw> = {}
    for (const field of fields.value) {
      properties[field.name] = field.schema
    }
    return { type: 'object', properties } as SchemaRaw
  }

  function loadSchema(schema: SchemaRaw) {
    fields.value = []
    selectedField.value = ''

    if (schema?.properties) {
      const properties = schema.properties as Record<string, SchemaRaw>
      for (const [name, fieldSchema] of Object.entries(properties)) {
        fields.value.push({ name, schema: fieldSchema as SchemaRaw })
      }
    }

    pushHistory({ fields, selectedField, history, historyIndex })
  }

  const state: GlobalState = {
    fields,
    selectedField,
    history,
    historyIndex,
    clipboard,
    addField,
    removeField,
    updateField,
    selectField,
    moveField,
    undo,
    redo,
    canUndo,
    canRedo,
    buildSchema,
    loadSchema,
  }

  return state
}

export function provideGlobalState(state: GlobalState) {
  provide(GLOBAL_STATE_KEY, state)
}

export function useGlobalState(): GlobalState {
  const state = inject(GLOBAL_STATE_KEY)
  if (!state) {
    throw new Error('[v3sf-generator] useGlobalState must be used within a Generator component')
  }
  return state
}
