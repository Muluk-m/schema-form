/**
 * v3sf Meta Schema（OpenAI Function Calling 格式）
 *
 * 用于 LLM function calling / tool use，约束 AI 输出合法的 v3sf schema。
 */

const expressionOrBoolean = {
  oneOf: [
    { type: 'boolean' as const },
    { type: 'string' as const, description: '表达式字符串，格式为 {{ expression }}' },
  ],
}

const validatorRule = {
  type: 'object' as const,
  properties: {
    required: { type: 'boolean' as const, description: '是否必填' },
    pattern: { type: 'string' as const, description: '正则表达式字符串' },
    min: { type: 'number' as const, description: '最小值/最小长度' },
    max: { type: 'number' as const, description: '最大值/最大长度' },
    len: { type: 'number' as const, description: '精确长度' },
    type: { type: 'string' as const, description: '值类型校验' },
    message: { type: 'string' as const, description: '校验失败提示信息' },
  },
}

const fieldDefinition: Record<string, any> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['string', 'number', 'boolean', 'array', 'date', 'object'],
      description: '字段值类型',
    },
    title: {
      type: 'string',
      description: '字段显示标签',
    },
    widget: {
      type: 'string',
      enum: [
        'input',
        'textarea',
        'number',
        'stepper',
        'switch',
        'radio',
        'radioButton',
        'checkbox',
        'select',
        'picker',
        'cascader',
        'date',
      ],
      description: '渲染组件名称',
    },
    required: {
      ...expressionOrBoolean,
      description: '是否必填，支持布尔值或 {{ expression }}',
    },
    placeholder: {
      type: 'string',
      description: '占位提示文本',
    },
    disabled: {
      ...expressionOrBoolean,
      description: '是否禁用，支持布尔值或 {{ expression }}',
    },
    readonly: {
      ...expressionOrBoolean,
      description: '是否只读，支持布尔值或 {{ expression }}',
    },
    hidden: {
      ...expressionOrBoolean,
      description: '是否隐藏，支持布尔值或 {{ expression }}',
    },
    displayType: {
      type: 'string',
      enum: ['row', 'column'],
      description: '标签与字段的布局方式',
    },
    className: {
      type: 'string',
      description: '自定义 CSS 类名',
    },
    border: {
      type: 'boolean',
      description: '是否显示边框',
    },
    enum: {
      type: 'array',
      items: { type: ['string', 'number'] },
      description: '选项值数组（用于 select/radio/checkbox 等组件）',
    },
    enumNames: {
      type: 'array',
      items: { type: ['string', 'number'] },
      description: '选项标签数组，与 enum 一一对应',
    },
    rules: {
      oneOf: [validatorRule, { type: 'array', items: validatorRule }],
      description: '校验规则，单条或多条',
    },
    props: {
      type: 'object',
      additionalProperties: true,
      description: '传递给组件的额外属性，值支持 {{ expression }} 语法',
    },
    properties: {
      type: 'object',
      additionalProperties: { $ref: '#/$defs/field' },
      description: '嵌套字段定义（type 为 object 时使用）',
    },
  },
  required: ['type'],
}

export const metaSchemaForFunctionCalling = {
  name: 'generate_form_schema',
  description: '根据用户描述生成 v3sf 表单 schema。v3sf 是一个 Vue 3 JSON Schema 驱动的表单引擎。',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        const: 'object',
        description: '根节点类型，固定为 object',
      },
      properties: {
        type: 'object',
        additionalProperties: fieldDefinition,
        description: '表单字段定义，key 为字段名（camelCase），value 为字段配置',
      },
    },
    required: ['type', 'properties'],
    $defs: {
      field: fieldDefinition,
    },
  },
}
