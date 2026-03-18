import { defineComponent, ref } from 'vue'
import { useGenerator } from '@v3sf/generator'
import { templates } from '../templates'

export default defineComponent({
  name: 'TemplateGallery',
  setup() {
    const { loadSchema } = useGenerator()
    const activeIndex = ref<number | null>(null)

    function handleSelect(index: number) {
      const template = templates[index]
      if (template) {
        activeIndex.value = index
        loadSchema(JSON.parse(JSON.stringify(template.schema)))
      }
    }

    return () => (
      <div class="pg-templates">
        <span class="pg-templates__label">模板</span>
        <div class="pg-templates__list">
          {templates.map((template, index) => (
            <button
              class={['pg-templates__item', { 'is-active': activeIndex.value === index }]}
              key={index}
              title={template.description}
              onClick={() => handleSelect(index)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    )
  },
})
