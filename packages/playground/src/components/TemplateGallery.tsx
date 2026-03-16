import { defineComponent } from 'vue'
import { templates } from '../templates'
import { useSchema } from '../composables/useSchema'

export default defineComponent({
  name: 'TemplateGallery',
  setup() {
    const { setSchema } = useSchema()

    function handleSelect(index: number) {
      const template = templates[index]
      if (template) {
        setSchema(JSON.parse(JSON.stringify(template.schema)))
      }
    }

    return () => (
      <div class="pg-templates">
        <span class="pg-templates__label">模板:</span>
        {templates.map((template, index) => (
          <button
            class="pg-templates__item"
            key={index}
            title={template.description}
            onClick={() => handleSelect(index)}
          >
            {template.name}
          </button>
        ))}
      </div>
    )
  },
})
