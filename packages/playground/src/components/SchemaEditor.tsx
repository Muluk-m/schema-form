import { defineComponent, ref, watch } from 'vue'
import { useSchema } from '../composables/useSchema'

// TODO: Integrate Monaco Editor for rich JSON editing with autocomplete.
// For now, using a simple textarea with JSON.stringify/parse as a fallback.

export default defineComponent({
  name: 'SchemaEditor',
  setup() {
    const { schema, updateSchemaFromJson } = useSchema()
    const jsonText = ref('')
    const parseError = ref('')
    const isDirty = ref(false)

    // Sync from schema to text
    function syncFromSchema() {
      jsonText.value = JSON.stringify(schema.value, null, 2)
      parseError.value = ''
      isDirty.value = false
    }

    // Watch schema changes (from palette, templates, etc.)
    watch(
      schema,
      () => {
        if (!isDirty.value) {
          syncFromSchema()
        }
      },
      { deep: true, immediate: true },
    )

    function handleInput(e: Event) {
      const target = e.target as HTMLTextAreaElement
      jsonText.value = target.value
      isDirty.value = true

      // Try to parse and update
      try {
        JSON.parse(target.value)
        parseError.value = ''
      } catch (err: any) {
        parseError.value = err.message ?? 'JSON 解析错误'
      }
    }

    function handleApply() {
      const success = updateSchemaFromJson(jsonText.value)
      if (success) {
        parseError.value = ''
        isDirty.value = false
      }
    }

    function handleFormat() {
      try {
        const parsed = JSON.parse(jsonText.value)
        jsonText.value = JSON.stringify(parsed, null, 2)
        parseError.value = ''
      } catch (err: any) {
        parseError.value = err.message ?? 'JSON 解析错误'
      }
    }

    function handleReset() {
      syncFromSchema()
    }

    return () => (
      <div class="pg-editor">
        <div class="pg-editor__toolbar">
          <button class="pg-editor__btn" onClick={handleFormat}>
            格式化
          </button>
          <button class="pg-editor__btn" onClick={handleApply} disabled={!!parseError.value}>
            应用
          </button>
          <button class="pg-editor__btn" onClick={handleReset}>
            重置
          </button>
        </div>
        <textarea
          class="pg-editor__textarea"
          value={jsonText.value}
          onInput={handleInput}
          spellcheck={false}
        />
        {parseError.value && <div class="pg-editor__error">{parseError.value}</div>}
        <div class="pg-editor__status">
          {isDirty.value ? '已修改 - 点击"应用"更新预览' : 'Schema JSON'}
        </div>
      </div>
    )
  },
})
