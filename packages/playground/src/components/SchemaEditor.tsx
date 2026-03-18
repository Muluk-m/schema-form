import { defineComponent, ref, watch, computed } from 'vue'
import { useGenerator } from '@v3sf/generator'

export default defineComponent({
  name: 'SchemaEditor',
  setup() {
    const { schema, loadSchema } = useGenerator()
    const jsonText = ref('')
    const parseError = ref('')
    const isDirty = ref(false)

    const lineCount = computed(() => {
      return jsonText.value.split('\n').length
    })

    function syncFromSchema() {
      jsonText.value = JSON.stringify(schema.value, null, 2)
      parseError.value = ''
      isDirty.value = false
    }

    // Watch schema changes (from canvas operations, templates, etc.)
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

      try {
        JSON.parse(target.value)
        parseError.value = ''
      } catch (err: any) {
        parseError.value = err.message ?? 'JSON 解析错误'
      }
    }

    function handleApply() {
      try {
        const parsed = JSON.parse(jsonText.value)
        loadSchema(parsed)
        parseError.value = ''
        isDirty.value = false
      } catch {
        // ignore
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

    function handleBlur() {
      if (!parseError.value && jsonText.value.trim()) {
        try {
          const parsed = JSON.parse(jsonText.value)
          jsonText.value = JSON.stringify(parsed, null, 2)
        } catch {
          // ignore
        }
      }
    }

    return () => (
      <div class="pg-editor">
        <div class="pg-editor__header">
          <span class="editor-label">Schema</span>
          <div class="editor-actions">
            <button class="pg-editor__btn" onClick={handleFormat}>
              Format
            </button>
            <button class="pg-editor__btn" onClick={handleApply} disabled={!!parseError.value}>
              Apply
            </button>
            <button class="pg-editor__btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
        <textarea
          class="pg-editor__textarea"
          value={jsonText.value}
          onInput={handleInput}
          onBlur={handleBlur}
          spellcheck={false}
        />
        {parseError.value && <div class="pg-editor__error">{parseError.value}</div>}
        <div class={['pg-editor__status', { 'is-dirty': isDirty.value }]}>
          {isDirty.value ? (
            <span>已修改 · 点击 Apply</span>
          ) : (
            <span>JSON · {lineCount.value} lines</span>
          )}
        </div>
      </div>
    )
  },
})
