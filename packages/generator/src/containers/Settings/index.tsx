import { defineComponent, computed, ref, watch } from 'vue'
import type { SchemaRaw } from '@v3sf/core'
import { useGlobalState } from '../../hooks'

export const FieldSettings = defineComponent({
  name: 'V3sfFieldSettings',

  setup() {
    const state = useGlobalState('FieldSettings')

    const selectedFieldItem = computed(() => {
      if (!state.selectedField.value) return null
      return state.fields.value.find((f) => f.name === state.selectedField.value) ?? null
    })

    const fieldSchema = computed(() => selectedFieldItem.value?.schema ?? null)

    const editTitle = ref('')
    const editType = ref('')
    const editWidget = ref('')
    const editRequired = ref(false)
    const editPlaceholder = ref('')
    const editEnumValues = ref('')
    const editEnumNames = ref('')

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

    return () => (
      <div class="v3sf-FieldSettings">
        <div class="v3sf-FieldSettings__header">属性</div>
        <div class="v3sf-FieldSettings__content">
          {!selectedFieldItem.value ? (
            <div class="v3sf-FieldSettings__empty">选择一个字段以编辑属性</div>
          ) : (
            <div class="v3sf-FieldSettings__editor">
              <div class="v3sf-FieldSettings__field-name">
                字段: <strong>{selectedFieldItem.value.name}</strong>
              </div>

              <label class="v3sf-FieldSettings__label">
                标题
                <input
                  class="v3sf-FieldSettings__input"
                  value={editTitle.value}
                  onInput={(e: Event) => {
                    editTitle.value = (e.target as HTMLInputElement).value
                    applyFieldChanges()
                  }}
                />
              </label>

              <label class="v3sf-FieldSettings__label">
                类型
                <select
                  class="v3sf-FieldSettings__input"
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

              <label class="v3sf-FieldSettings__label">
                Widget
                <input
                  class="v3sf-FieldSettings__input"
                  value={editWidget.value}
                  placeholder="auto (基于类型)"
                  onInput={(e: Event) => {
                    editWidget.value = (e.target as HTMLInputElement).value
                    applyFieldChanges()
                  }}
                />
              </label>

              <label class="v3sf-FieldSettings__label v3sf-FieldSettings__label--row">
                <input
                  type="checkbox"
                  checked={editRequired.value}
                  onChange={(e: Event) => {
                    editRequired.value = (e.target as HTMLInputElement).checked
                    applyFieldChanges()
                  }}
                />
                必填
              </label>

              <label class="v3sf-FieldSettings__label">
                占位符
                <input
                  class="v3sf-FieldSettings__input"
                  value={editPlaceholder.value}
                  onInput={(e: Event) => {
                    editPlaceholder.value = (e.target as HTMLInputElement).value
                    applyFieldChanges()
                  }}
                />
              </label>

              <label class="v3sf-FieldSettings__label">
                枚举值 (逗号分隔)
                <input
                  class="v3sf-FieldSettings__input"
                  value={editEnumValues.value}
                  placeholder="例: a, b, c"
                  onInput={(e: Event) => {
                    editEnumValues.value = (e.target as HTMLInputElement).value
                    applyFieldChanges()
                  }}
                />
              </label>

              <label class="v3sf-FieldSettings__label">
                枚举标签 (逗号分隔)
                <input
                  class="v3sf-FieldSettings__input"
                  value={editEnumNames.value}
                  placeholder="例: 标签A, 标签B, 标签C"
                  onInput={(e: Event) => {
                    editEnumNames.value = (e.target as HTMLInputElement).value
                    applyFieldChanges()
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    )
  },
})
