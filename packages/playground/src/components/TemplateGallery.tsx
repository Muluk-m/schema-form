import { defineComponent, ref } from 'vue'
import { templates } from '../templates'
import { useSchema } from '../composables/useSchema'

export default defineComponent({
  name: 'TemplateGallery',
  setup() {
    const { setSchema } = useSchema()
    const activeIndex = ref<number | null>(null)
    const flashKey = ref(0)

    function handleSelect(index: number) {
      const template = templates[index]
      if (template) {
        activeIndex.value = index
        flashKey.value++
        setSchema(JSON.parse(JSON.stringify(template.schema)))
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
