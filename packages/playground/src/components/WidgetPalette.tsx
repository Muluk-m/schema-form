import { defineComponent } from 'vue'
import { useSchema } from '../composables/useSchema'

interface WidgetItem {
  widget: string
  label: string
  icon: string
  defaultSchema: Record<string, any>
}

interface WidgetGroup {
  name: string
  items: WidgetItem[]
}

const widgetGroups: WidgetGroup[] = [
  {
    name: '基础',
    items: [
      {
        widget: 'input',
        label: 'Input 输入框',
        icon: 'T',
        defaultSchema: { type: 'string', title: '输入框', widget: 'input', placeholder: '请输入' },
      },
      {
        widget: 'number',
        label: 'Number 数字',
        icon: '#',
        defaultSchema: { type: 'number', title: '数字', widget: 'number' },
      },
      {
        widget: 'textarea',
        label: 'Textarea 文本域',
        icon: '¶',
        defaultSchema: {
          type: 'string',
          title: '文本域',
          widget: 'textarea',
          placeholder: '请输入',
        },
      },
    ],
  },
  {
    name: '选择',
    items: [
      {
        widget: 'radio',
        label: 'Radio 单选',
        icon: '◉',
        defaultSchema: {
          type: 'string',
          title: '单选',
          widget: 'radio',
          enum: ['a', 'b'],
          enumNames: ['选项A', '选项B'],
        },
      },
      {
        widget: 'checkbox',
        label: 'Checkbox 多选',
        icon: '☑',
        defaultSchema: {
          type: 'array',
          title: '多选',
          widget: 'checkbox',
          enum: ['a', 'b'],
          enumNames: ['选项A', '选项B'],
        },
      },
      {
        widget: 'switch',
        label: 'Switch 开关',
        icon: '⊘',
        defaultSchema: { type: 'boolean', title: '开关', widget: 'switch' },
      },
      {
        widget: 'select',
        label: 'Select 选择器',
        icon: '▾',
        defaultSchema: {
          type: 'string',
          title: '选择器',
          widget: 'select',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项A', '选项B', '选项C'],
        },
      },
      {
        widget: 'picker',
        label: 'Picker 选择',
        icon: '☰',
        defaultSchema: {
          type: 'string',
          title: '选择',
          widget: 'picker',
          enum: ['a', 'b'],
          enumNames: ['选项A', '选项B'],
        },
      },
    ],
  },
  {
    name: '日期',
    items: [
      {
        widget: 'date',
        label: 'Date 日期',
        icon: '📅',
        defaultSchema: { type: 'date', title: '日期', widget: 'date' },
      },
    ],
  },
  {
    name: '高级',
    items: [
      {
        widget: 'cascader',
        label: 'Cascader 级联',
        icon: '⊞',
        defaultSchema: { type: 'string', title: '级联选择', widget: 'cascader' },
      },
    ],
  },
]

export default defineComponent({
  name: 'WidgetPalette',
  setup() {
    const { addField, schema } = useSchema()

    function generateFieldName(widget: string): string {
      const properties = schema.value.properties ?? {}
      let index = 1
      while (`${widget}_${index}` in properties) {
        index++
      }
      return `${widget}_${index}`
    }

    function handleAddWidget(item: WidgetItem) {
      const fieldName = generateFieldName(item.widget)
      addField(fieldName, { ...item.defaultSchema })
    }

    return () => (
      <div class="pg-palette">
        {widgetGroups.map((group) => (
          <div class="pg-palette__group" key={group.name}>
            <div class="pg-palette__group-title">{group.name}</div>
            {group.items.map((item) => (
              <div
                class="pg-palette__item"
                key={item.widget}
                draggable
                onClick={() => handleAddWidget(item)}
                onDragstart={(e: DragEvent) => {
                  e.dataTransfer?.setData('application/json', JSON.stringify(item))
                }}
              >
                <span class="pg-palette__icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
})
