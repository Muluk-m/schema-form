import { defineComponent } from 'vue'
import { useSchema } from '../composables/useSchema'

interface WidgetItem {
  widget: string
  label: string
  icon: () => JSX.Element
  defaultSchema: Record<string, any>
}

interface WidgetGroup {
  name: string
  items: WidgetItem[]
}

// --- SVG Icon components ---
const InputIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <line x1="4" y1="6" x2="14" y2="6" />
    <line x1="4" y1="9" x2="11" y2="9" />
    <line x1="4" y1="12" x2="8" y2="12" />
  </svg>
)

const NumberIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M6 3l-1 12M13 3l-1 12M3 7h12M3 11h12" />
  </svg>
)

const TextareaIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="2" y="3" width="14" height="12" rx="1.5" />
    <line x1="5" y1="6" x2="13" y2="6" />
    <line x1="5" y1="9" x2="13" y2="9" />
    <line x1="5" y1="12" x2="10" y2="12" />
  </svg>
)

const RadioIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <circle cx="9" cy="9" r="6" />
    <circle cx="9" cy="9" r="2.5" fill="currentColor" stroke="none" />
  </svg>
)

const CheckboxIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="3" y="3" width="12" height="12" rx="2" />
    <polyline points="6,9 8,11.5 12,6.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)

const SwitchIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="2" y="5.5" width="14" height="7" rx="3.5" />
    <circle cx="12.5" cy="9" r="2" fill="currentColor" stroke="none" />
  </svg>
)

const SelectIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="3" y="4" width="12" height="10" rx="1.5" />
    <polyline points="7,8 9,10.5 11,8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)

const PickerIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <line x1="3" y1="5" x2="15" y2="5" />
    <line x1="3" y1="9" x2="15" y2="9" />
    <line x1="3" y1="13" x2="15" y2="13" />
    <circle cx="6" cy="9" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

const DateIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="2" y="3" width="14" height="13" rx="1.5" />
    <line x1="2" y1="7" x2="16" y2="7" />
    <line x1="6" y1="1.5" x2="6" y2="4.5" />
    <line x1="12" y1="1.5" x2="12" y2="4.5" />
    <rect x="5" y="9.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="8" y="9.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="11" y="9.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const CascaderIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
    <circle cx="5" cy="4" r="1.5" />
    <circle cx="10" cy="9" r="1.5" />
    <circle cx="10" cy="14" r="1.5" />
    <line x1="6.2" y1="5" x2="8.8" y2="8" />
    <line x1="6.2" y1="5" x2="8.8" y2="13" />
  </svg>
)

const widgetGroups: WidgetGroup[] = [
  {
    name: '基础',
    items: [
      {
        widget: 'input',
        label: 'Input 输入框',
        icon: InputIcon,
        defaultSchema: { type: 'string', title: '输入框', widget: 'input', placeholder: '请输入' },
      },
      {
        widget: 'number',
        label: 'Number 数字',
        icon: NumberIcon,
        defaultSchema: { type: 'number', title: '数字', widget: 'number' },
      },
      {
        widget: 'textarea',
        label: 'Textarea 文本域',
        icon: TextareaIcon,
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
        icon: RadioIcon,
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
        icon: CheckboxIcon,
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
        icon: SwitchIcon,
        defaultSchema: { type: 'boolean', title: '开关', widget: 'switch' },
      },
      {
        widget: 'select',
        label: 'Select 选择器',
        icon: SelectIcon,
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
        icon: PickerIcon,
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
        icon: DateIcon,
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
        icon: CascaderIcon,
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
                  if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'copy'
                    e.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({
                        widget: item.widget,
                        label: item.label,
                        defaultSchema: item.defaultSchema,
                      }),
                    )
                  }
                }}
              >
                <span class="pg-palette__icon">
                  <item.icon />
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
})
