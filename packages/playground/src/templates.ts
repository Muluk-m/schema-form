import type { Schema } from '@v3sf/core'

export interface TemplateItem {
  name: string
  description: string
  schema: Schema
}

// Try to import from @v3sf/ai examples if available, otherwise use built-in templates
let aiExamples: TemplateItem[] = []
try {
  const { examples } = await import('@v3sf/ai')
  if (Array.isArray(examples)) {
    aiExamples = examples.map((ex: any) => ({
      name: ex.name ?? '未命名',
      description: ex.description ?? '',
      schema: ex.schema ?? ex,
    }))
  }
} catch {
  // @v3sf/ai not built yet, use fallback templates
}

const builtinTemplates: TemplateItem[] = [
  {
    name: '用户注册',
    description: '基础用户注册表单',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: '用户名',
          required: true,
          placeholder: '请输入用户名',
        },
        email: {
          type: 'string',
          title: '邮箱',
          required: true,
          placeholder: '请输入邮箱',
          widget: 'input',
        },
        password: {
          type: 'string',
          title: '密码',
          required: true,
          placeholder: '请输入密码',
          widget: 'input',
          props: { type: 'password' },
        },
        gender: {
          type: 'string',
          title: '性别',
          widget: 'radio',
          enum: ['male', 'female'],
          enumNames: ['男', '女'],
        },
        agree: {
          type: 'boolean',
          title: '同意协议',
          widget: 'switch',
        },
      },
    },
  },
  {
    name: '商品信息',
    description: '商品录入表单',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: '商品名称',
          required: true,
          placeholder: '请输入商品名称',
        },
        price: {
          type: 'number',
          title: '价格',
          required: true,
          widget: 'number',
        },
        category: {
          type: 'string',
          title: '分类',
          widget: 'select',
          enum: ['electronics', 'clothing', 'food'],
          enumNames: ['电子产品', '服装', '食品'],
        },
        description: {
          type: 'string',
          title: '描述',
          widget: 'textarea',
          placeholder: '请输入商品描述',
        },
        onSale: {
          type: 'boolean',
          title: '上架',
          widget: 'switch',
        },
      },
    },
  },
  {
    name: '日期选择',
    description: '包含日期控件的表单',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: '事件名称',
          required: true,
          placeholder: '请输入事件名称',
        },
        date: {
          type: 'date',
          title: '日期',
          widget: 'date',
        },
        remind: {
          type: 'boolean',
          title: '提醒',
          widget: 'switch',
        },
      },
    },
  },
  {
    name: '空表单',
    description: '从零开始',
    schema: {
      type: 'object',
      properties: {},
    },
  },
]

export const templates: TemplateItem[] = [...aiExamples, ...builtinTemplates]
