import { describe, it, expect } from 'vitest'
import { compile } from '../src/index'

describe('compile to antd', () => {
  const target = 'antd' as const

  it('compiles a simple text field', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名', placeholder: '请输入' },
        },
      },
      target,
    )

    expect(result.success).toBe(true)
    const items = result.config.formItems as any[]
    expect(items[0].name).toBe('name')
    expect(items[0].label).toBe('姓名')
    expect(items[0].component).toBe('Input')
    expect(items[0].componentProps.placeholder).toBe('请输入')
  })

  it('maps all widget types', () => {
    const schema = {
      type: 'object',
      properties: {
        a: { widget: 'input' },
        b: { widget: 'textarea' },
        c: { widget: 'number' },
        d: { widget: 'switch' },
        e: { widget: 'radio', enum: ['x'], enumNames: ['X'] },
        f: { widget: 'select', enum: ['x'], enumNames: ['X'] },
        g: { widget: 'checkbox', enum: ['x'], enumNames: ['X'] },
        h: { widget: 'cascader' },
        i: { widget: 'date' },
      },
    }

    const result = compile(schema, target)
    const items = result.config.formItems as any[]

    expect(items.find((i: any) => i.name === 'a').component).toBe('Input')
    expect(items.find((i: any) => i.name === 'b').component).toBe('Input.TextArea')
    expect(items.find((i: any) => i.name === 'c').component).toBe('InputNumber')
    expect(items.find((i: any) => i.name === 'd').component).toBe('Switch')
    expect(items.find((i: any) => i.name === 'e').component).toBe('Radio.Group')
    expect(items.find((i: any) => i.name === 'f').component).toBe('Select')
    expect(items.find((i: any) => i.name === 'g').component).toBe('Checkbox.Group')
    expect(items.find((i: any) => i.name === 'h').component).toBe('Cascader')
    expect(items.find((i: any) => i.name === 'i').component).toBe('DatePicker')
  })

  it('converts validation rules', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            title: '邮箱',
            required: true,
            rules: { pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', message: '格式错误' },
          },
        },
      },
      target,
    )

    const items = result.config.formItems as any[]
    expect(items[0].rules).toHaveLength(2) // required + pattern
    expect(items[0].rules[0].required).toBe(true)
    expect(items[0].rules[1].pattern).toBeInstanceOf(RegExp)
  })

  it('extracts dependencies from expressions', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          toggle: { type: 'boolean', widget: 'switch' },
          detail: { type: 'string', hidden: '{{ !$values.toggle }}' },
        },
      },
      target,
    )

    const items = result.config.formItems as any[]
    const detail = items.find((i: any) => i.name === 'detail')
    expect(detail.dependencies).toContain('toggle')
    expect(result.expressions).toHaveLength(1)
    expect(result.expressions[0].compiled).toBe('!formValues.toggle')
  })

  it('sets horizontal layout with labelCol/wrapperCol', () => {
    const result = compile({ type: 'object', properties: {} }, target)
    const form = result.config.form as any
    expect(form.layout).toBe('horizontal')
    expect(form.labelCol).toEqual({ span: 6 })
    expect(form.wrapperCol).toEqual({ span: 18 })
  })

  it('sets vertical layout without col spans', () => {
    const result = compile({ type: 'object', layout: 'vertical', properties: {} }, target)
    const form = result.config.form as any
    expect(form.layout).toBe('vertical')
    expect(form.labelCol).toBeUndefined()
  })

  it('handles null schema', () => {
    const result = compile(null, target)
    expect(result.success).toBe(true)
  })
})
