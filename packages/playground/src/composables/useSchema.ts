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
  }
}
