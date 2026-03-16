import { defineComponent, computed } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import { elementPlusAdapter } from '@v3sf/element-plus'
import { useSchema } from '../composables/useSchema'

export default defineComponent({
  name: 'FormPreview',
  setup() {
    const { schema, formData, selectedAdapter, previewMode } = useSchema()

    const VantForm = createSchemaForm(vantAdapter)
    const ElementForm = createSchemaForm(elementPlusAdapter)

    const CurrentForm = computed(() => {
      return selectedAdapter.value === 'vant' ? VantForm : ElementForm
    })

    const hasFields = computed(() => {
      return Object.keys(schema.value.properties ?? {}).length > 0
    })

    function renderForm() {
      const Form = CurrentForm.value
      return (
        <Form
          schema={schema.value as any}
          modelValue={formData.value}
          onUpdate:modelValue={(val: any) => {
            formData.value = val
          }}
          border={true}
          displayType="column"
        />
      )
    }

    return () => {
      if (!hasFields.value) {
        return (
          <div class="pg-preview__empty">
            <span style="font-size: 32px; opacity: 0.3">+</span>
            <span>从左侧面板添加组件，或选择底部模板</span>
          </div>
        )
      }

      if (previewMode.value === 'mobile') {
        return (
          <div class="pg-preview__mobile-frame">
            <div class="pg-preview__notch" />
            <div class="pg-preview__content">{renderForm()}</div>
          </div>
        )
      }

      return <div class="pg-preview__desktop-frame">{renderForm()}</div>
    }
  },
})
