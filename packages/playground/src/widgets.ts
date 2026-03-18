import type { WidgetDef } from '@v3sf/generator'

export const widgets: WidgetDef[] = [
  // 基础
  {
    label: 'Input 输入框',
    type: 'input',
    category: '基础',
    defaultSchema: { type: 'string', title: '输入框', widget: 'input', placeholder: '请输入' },
  },
  {
    label: 'Number 数字',
    type: 'number',
    category: '基础',
    defaultSchema: { type: 'number', title: '数字', widget: 'number' },
  },
  {
    label: 'Textarea 文本域',
    type: 'textarea',
    category: '基础',
    defaultSchema: {
      type: 'string',
      title: '文本域',
      widget: 'textarea',
      placeholder: '请输入',
    },
  },
  // 选择
  {
    label: 'Radio 单选',
    type: 'radio',
    category: '选择',
    defaultSchema: {
      type: 'string',
      title: '单选',
      widget: 'radio',
      enum: ['a', 'b'],
      enumNames: ['选项A', '选项B'],
    },
  },
  {
    label: 'Checkbox 多选',
    type: 'checkbox',
    category: '选择',
    defaultSchema: {
      type: 'array',
      title: '多选',
      widget: 'checkbox',
      enum: ['a', 'b'],
      enumNames: ['选项A', '选项B'],
    },
  },
  {
    label: 'Switch 开关',
    type: 'switch',
    category: '选择',
    defaultSchema: { type: 'boolean', title: '开关', widget: 'switch' },
  },
  {
    label: 'Select 选择器',
    type: 'select',
    category: '选择',
    defaultSchema: {
      type: 'string',
      title: '选择器',
      widget: 'select',
      enum: ['a', 'b', 'c'],
      enumNames: ['选项A', '选项B', '选项C'],
    },
  },
  {
    label: 'Picker 选择',
    type: 'picker',
    category: '选择',
    defaultSchema: {
      type: 'string',
      title: '选择',
      widget: 'picker',
      enum: ['a', 'b'],
      enumNames: ['选项A', '选项B'],
    },
  },
  // 日期
  {
    label: 'Date 日期',
    type: 'date',
    category: '日期',
    defaultSchema: { type: 'date', title: '日期', widget: 'date' },
  },
  // 高级
  {
    label: 'Cascader 级联',
    type: 'cascader',
    category: '高级',
    defaultSchema: { type: 'string', title: '级联选择', widget: 'cascader' },
  },
]
