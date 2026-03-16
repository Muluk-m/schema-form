import { defineComponent, computed, ref, watch } from 'vue'
import type { SchemaRaw } from '@v3sf/core'
import { useGlobalState } from '../../hooks'
import { useGlobalAction } from '../../hooks'

export const Settings = defineComponent({
  name: 'V3sfSettings',

  setup() {
    const state = useGlobalState()
    const { importSchema, exportSchema } = useGlobalAction()

    const activeTab = ref<'field' | 'form'>('field')
    const importText = ref('')
    const importError = ref('')

    const selectedFieldItem = computed(() => {
      if (!state.selectedField.value) return null
      return state.fields.value.find((f) => f.name === state.selectedField.value) ?? null
    })

    const fieldSchema = computed(() => selectedFieldItem.value?.schema ?? null)

    // Local editable copies of field properties
    const editTitle = ref('')
    const editType = ref('')
    const editWidget = ref('')
    const editRequired = ref(false)
    const editPlaceholder = ref('')
    const editEnumValues = ref('')
    const editEnumNames = ref('')

    // Sync local state when selection changes
    watch(
      () => state.selectedField.value,
      () => {
        if (fieldSchema.value) {
          editTitle.value = (fieldSchema.value.title as string) ?? ''
          editType.value = (fieldSchema.value.type as string) ?? 'string'
          editWidget.value = (fieldSchema.value.widget as string) ?? ''
          editRequired.value = !!fieldSchema.value.required
          editPlaceholder.value = (fieldSchema.value.placeholder as string) ?? ''
          editEnumValues.value = fieldSchema.value.enum
            ? (fieldSchema.value.enum as string[]).join(', ')
            : ''
          editEnumNames.value = fieldSchema.value.enumNames
            ? (fieldSchema.value.enumNames as string[]).join(', ')
            : ''
          activeTab.value = 'field'
        }
      },
      { immediate: true },
    )

    function applyFieldChanges() {
      if (!selectedFieldItem.value) return
      const name = selectedFieldItem.value.name

      const updated: Record<string, any> = {
        ...selectedFieldItem.value.schema,
        title: editTitle.value || undefined,
        type: editType.value || 'string',
        widget: editWidget.value || undefined,
        required: editRequired.value || undefined,
        placeholder: editPlaceholder.value || undefined,
      }

      if (editEnumValues.value.trim()) {
        updated.enum = editEnumValues.value.split(',').map((s) => s.trim())
      } else {
        delete updated.enum
      }

      if (editEnumNames.value.trim()) {
        updated.enumNames = editEnumNames.value.split(',').map((s) => s.trim())
      } else {
        delete updated.enumNames
      }

      state.updateField(name, updated as SchemaRaw)
    }

    function handleImport() {
      importError.value = ''
      const ok = importSchema(importText.value)
      if (!ok) {
        importError.value = 'Invalid JSON schema'
      } else {
        importText.value = ''
      }
    }

    function handleExport() {
      importText.value = exportSchema()
      activeTab.value = 'form'
    }

    function renderFieldEditor() {
      if (!selectedFieldItem.value) {
        return <div class="v3sf-Settings__empty">Select a field to edit its properties</div>
      }

      return (
        <div class="v3sf-Settings__field-editor">
          <div class="v3sf-Settings__field-name">
            Field: <strong>{selectedFieldItem.value.name}</strong>
          </div>

          <label class="v3sf-Settings__label">
            Title
            <input
              class="v3sf-Settings__input"
              value={editTitle.value}
              onInput={(e: Event) => {
                editTitle.value = (e.target as HTMLInputElement).value
                applyFieldChanges()
              }}
            />
          </label>

          <label class="v3sf-Settings__label">
            Type
            <select
              class="v3sf-Settings__input"
              value={editType.value}
              onChange={(e: Event) => {
                editType.value = (e.target as HTMLSelectElement).value
                applyFieldChanges()
              }}
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="array">array</option>
              <option value="date">date</option>
            </select>
          </label>

          <label class="v3sf-Settings__label">
            Widget
            <input
              class="v3sf-Settings__input"
              value={editWidget.value}
              placeholder="auto (based on type)"
              onInput={(e: Event) => {
                editWidget.value = (e.target as HTMLInputElement).value
                applyFieldChanges()
              }}
            />
          </label>

          <label class="v3sf-Settings__label v3sf-Settings__label--row">
            <input
              type="checkbox"
              checked={editRequired.value}
              onChange={(e: Event) => {
                editRequired.value = (e.target as HTMLInputElement).checked
                applyFieldChanges()
              }}
            />
            Required
          </label>

          <label class="v3sf-Settings__label">
            Placeholder
            <input
              class="v3sf-Settings__input"
              value={editPlaceholder.value}
              onInput={(e: Event) => {
                editPlaceholder.value = (e.target as HTMLInputElement).value
                applyFieldChanges()
              }}
            />
          </label>

          <label class="v3sf-Settings__label">
            Enum values (comma-separated)
            <input
              class="v3sf-Settings__input"
              value={editEnumValues.value}
              placeholder="e.g. a, b, c"
              onInput={(e: Event) => {
                editEnumValues.value = (e.target as HTMLInputElement).value
                applyFieldChanges()
              }}
            />
          </label>

          <label class="v3sf-Settings__label">
            Enum labels (comma-separated)
            <input
              class="v3sf-Settings__input"
              value={editEnumNames.value}
              placeholder="e.g. Label A, Label B, Label C"
              onInput={(e: Event) => {
                editEnumNames.value = (e.target as HTMLInputElement).value
                applyFieldChanges()
              }}
            />
          </label>
        </div>
      )
    }

    function renderFormTab() {
      return (
        <div class="v3sf-Settings__form-tab">
          <div class="v3sf-Settings__actions">
            <button class="v3sf-Settings__btn" onClick={handleExport}>
              Export Schema
            </button>
          </div>

          <textarea
            class="v3sf-Settings__textarea"
            value={importText.value}
            onInput={(e: Event) => {
              importText.value = (e.target as HTMLTextAreaElement).value
            }}
            placeholder="Paste JSON schema here to import..."
          />

          {importError.value && <div class="v3sf-Settings__error">{importError.value}</div>}

          <button class="v3sf-Settings__btn" onClick={handleImport}>
            Import Schema
          </button>
        </div>
      )
    }

    return () => (
      <div class="v3sf-Settings">
        <div class="v3sf-Settings__tabs">
          <button
            class={[
              'v3sf-Settings__tab',
              activeTab.value === 'field' && 'v3sf-Settings__tab--active',
            ]}
            onClick={() => {
              activeTab.value = 'field'
            }}
          >
            Field Settings
          </button>
          <button
            class={[
              'v3sf-Settings__tab',
              activeTab.value === 'form' && 'v3sf-Settings__tab--active',
            ]}
            onClick={() => {
              activeTab.value = 'form'
            }}
          >
            Form Schema
          </button>
        </div>

        <div class="v3sf-Settings__content">
          {activeTab.value === 'field' ? renderFieldEditor() : renderFormTab()}
        </div>
      </div>
    )
  },
})
