import { ref, watch } from 'vue'
import type { Schema } from '@v3sf/core'

const schema = ref<Schema>({
  type: 'object',
  properties: {},
})

const formData = ref<Record<string, any>>({})
const selectedAdapter = ref<'vant' | 'element-plus'>('vant')
const previewMode = ref<'mobile' | 'desktop'>('mobile')
const selectedField = ref<string | null>(null)

// Sync: reset formData when schema changes
watch(
  schema,
  () => {
    const properties = schema.value.properties ?? {}
    const newData: Record<string, any> = {}
    for (const key of Object.keys(properties)) {
      newData[key] = formData.value[key] ?? undefined
    }
    formData.value = newData
  },
  { deep: true },
)

export function useSchema() {
  function setSchema(newSchema: Schema) {
    schema.value = newSchema
    selectedField.value = null
  }

  function updateSchemaFromJson(json: string): boolean {
    try {
      const parsed = JSON.parse(json)
      schema.value = parsed
      return true
    } catch {
      return false
    }
  }

  function addField(fieldName: string, fieldSchema: Schema) {
    schema.value = {
      ...schema.value,
      properties: {
        ...(schema.value.properties ?? {}),
        [fieldName]: fieldSchema,
      },
    }
  }

  function removeField(fieldName: string) {
    const { [fieldName]: _removed, ...rest } = schema.value.properties ?? {}
    schema.value = {
      ...schema.value,
      properties: rest,
    }
    if (selectedField.value === fieldName) {
      selectedField.value = null
    }
  }

  function selectField(fieldName: string | null) {
    selectedField.value = fieldName
  }

  function moveField(fieldName: string, direction: 'up' | 'down') {
    const properties = schema.value.properties ?? {}
    const keys = Object.keys(properties)
    const index = keys.indexOf(fieldName)
    if (index < 0) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= keys.length) return

    // Swap
    const temp = keys[index]
    keys[index] = keys[targetIndex]
    keys[targetIndex] = temp

    // Rebuild properties in new order
    const newProperties: Record<string, any> = {}
    for (const key of keys) {
      newProperties[key] = properties[key]
    }
    schema.value = {
      ...schema.value,
      properties: newProperties,
    }
  }

  function duplicateField(fieldName: string) {
    const properties = schema.value.properties ?? {}
    const fieldSchema = properties[fieldName]
    if (!fieldSchema) return

    let copyName = `${fieldName}_copy`
    let counter = 1
    while (copyName in properties) {
      copyName = `${fieldName}_copy${counter}`
      counter++
    }

    // Insert the copy right after the original
    const keys = Object.keys(properties)
    const index = keys.indexOf(fieldName)
    const newProperties: Record<string, any> = {}

    for (let i = 0; i <= index; i++) {
      newProperties[keys[i]] = properties[keys[i]]
    }
    newProperties[copyName] = JSON.parse(JSON.stringify(fieldSchema))
    for (let i = index + 1; i < keys.length; i++) {
      newProperties[keys[i]] = properties[keys[i]]
    }

    schema.value = {
      ...schema.value,
      properties: newProperties,
    }
    selectedField.value = copyName
  }

  function exportSchemaUrl(): string {
    const json = JSON.stringify(schema.value)
    const encoded = btoa(encodeURIComponent(json))
    const url = `${window.location.origin}${window.location.pathname}#schema=${encoded}`
    return url
  }

  function importSchemaFromUrl(): boolean {
    try {
      const hash = window.location.hash
      if (!hash.startsWith('#schema=')) return false
      const encoded = hash.slice('#schema='.length)
      const json = decodeURIComponent(atob(encoded))
      const parsed = JSON.parse(json)
      schema.value = parsed
      return true
    } catch {
      return false
    }
  }

  return {
    schema,
    formData,
    selectedAdapter,
    previewMode,
    selectedField,
    setSchema,
    updateSchemaFromJson,
    addField,
    removeField,
    selectField,
    moveField,
    duplicateField,
    exportSchemaUrl,
    importSchemaFromUrl,
  }
}
