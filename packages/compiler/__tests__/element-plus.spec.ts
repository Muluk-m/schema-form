import { describe, it, expect } from 'vitest'
import { compile } from '../src/index'

describe('compile to element-plus', () => {
  const target = 'element-plus' as const

  describe('basic field mapping', () => {
    it('compiles a simple text field', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            name: { type: 'string', title: '姓名', placeholder: '请输入姓名' },
          },
        },
        target,
      )

      expect(result.success).toBe(true)
      const items = result.config.formItems as any[]
      expect(items).toHaveLength(1)
      expect(items[0].prop).toBe('name')
      expect(items[0].label).toBe('姓名')
      expect(items[0].component).toBe('el-input')
      expect(items[0].componentProps.placeholder).toBe('请输入姓名')
    })

    it('maps all widget types to Element Plus components', () => {
      const schema = {
        type: 'object',
        properties: {
          a: { type: 'string', widget: 'input' },
          b: { type: 'string', widget: 'textarea' },
          c: { type: 'number', widget: 'number' },
          d: { type: 'number', widget: 'stepper' },
          e: { type: 'boolean', widget: 'switch' },
          f: { type: 'string', widget: 'radio', enum: ['a'], enumNames: ['A'] },
          g: { type: 'string', widget: 'select', enum: ['a'], enumNames: ['A'] },
          h: { type: 'array', widget: 'checkbox', enum: ['a'], enumNames: ['A'] },
          i: { type: 'array', widget: 'cascader' },
          j: { type: 'date', widget: 'date' },
        },
      }

      const result = compile(schema, target)
      const items = result.config.formItems as any[]

      expect(items.find((i: any) => i.prop === 'a').component).toBe('el-input')
      expect(items.find((i: any) => i.prop === 'b').component).toBe('el-input')
      expect(items.find((i: any) => i.prop === 'b').componentProps.type).toBe('textarea')
      expect(items.find((i: any) => i.prop === 'c').component).toBe('el-input-number')
      expect(items.find((i: any) => i.prop === 'd').component).toBe('el-input-number')
      expect(items.find((i: any) => i.prop === 'e').component).toBe('el-switch')
      expect(items.find((i: any) => i.prop === 'f').component).toBe('el-radio-group')
      expect(items.find((i: any) => i.prop === 'g').component).toBe('el-select')
      expect(items.find((i: any) => i.prop === 'h').component).toBe('el-checkbox-group')
      expect(items.find((i: any) => i.prop === 'i').component).toBe('el-cascader')
      expect(items.find((i: any) => i.prop === 'j').component).toBe('el-date-picker')
    })

    it('generates correct model with default values', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
            agree: { type: 'boolean' },
            tags: { type: 'array' },
          },
        },
        target,
      )

      const model = (result.config.form as any).model
      expect(model.name).toBe('')
      expect(model.age).toBeUndefined()
      expect(model.agree).toBe(false)
      expect(model.tags).toEqual([])
    })
  })

  describe('enum options', () => {
    it('converts enum/enumNames to options array', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              widget: 'select',
              enum: ['admin', 'user', 'guest'],
              enumNames: ['管理员', '普通用户', '访客'],
            },
          },
        },
        target,
      )

      const items = result.config.formItems as any[]
      expect(items[0].componentProps.options).toEqual([
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ])
    })
  })

  describe('validation rules', () => {
    it('converts required rule', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            name: { type: 'string', title: '姓名', required: true },
          },
        },
        target,
      )

      const rules = (result.config.form as any).rules.name
      expect(rules).toHaveLength(1)
      expect(rules[0].required).toBe(true)
      expect(rules[0].trigger).toBe('blur')
    })

    it('converts pattern rule', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            phone: {
              type: 'string',
              title: '手机号',
              rules: { pattern: '^1[3-9]\\d{9}$', message: '手机号格式不正确' },
            },
          },
        },
        target,
      )

      const rules = (result.config.form as any).rules.phone
      expect(rules).toHaveLength(1)
      expect(rules[0].pattern).toBeInstanceOf(RegExp)
      expect(rules[0].message).toBe('手机号格式不正确')
    })

    it('converts min/max rules', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              title: '密码',
              rules: [
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少8位' },
              ],
            },
          },
        },
        target,
      )

      const rules = (result.config.form as any).rules.password
      expect(rules).toHaveLength(2)
      expect(rules[0].required).toBe(true)
      expect(rules[1].min).toBe(8)
    })

    it('warns about custom validation functions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              rules: { custom: () => true },
            },
          },
        },
        target,
      )

      expect(result.warnings.some((w) => w.code === 'CUSTOM_RULE')).toBe(true)
    })

    it('uses change trigger for select/radio widgets', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              title: '角色',
              widget: 'select',
              required: true,
              enum: ['a'],
              enumNames: ['A'],
            },
          },
        },
        target,
      )

      const rules = (result.config.form as any).rules.role
      expect(rules[0].trigger).toBe('change')
    })
  })

  describe('expression handling', () => {
    it('extracts hidden expressions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            toggle: { type: 'boolean', widget: 'switch' },
            detail: {
              type: 'string',
              hidden: '{{ !$values.toggle }}',
            },
          },
        },
        target,
      )

      expect(result.expressions).toHaveLength(1)
      expect(result.expressions[0].field).toBe('detail')
      expect(result.expressions[0].prop).toBe('hidden')
      expect(result.expressions[0].source).toBe('!$values.toggle')
      expect(result.expressions[0].compiled).toBe('!formData.toggle')
    })

    it('extracts required expressions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            hasCode: { type: 'boolean', widget: 'switch' },
            code: {
              type: 'string',
              required: '{{ $values.hasCode }}',
            },
          },
        },
        target,
      )

      const expr = result.expressions.find((e) => e.prop === 'required')
      expect(expr).toBeDefined()
      expect(expr!.compiled).toBe('formData.hasCode')
    })

    it('converts $selfValue to formData.fieldName', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              disabled: '{{ $selfValue > 100 }}',
            },
          },
        },
        target,
      )

      expect(result.expressions[0].compiled).toBe('formData.amount > 100')
    })
  })

  describe('layout', () => {
    it('defaults to right label position', () => {
      const result = compile({ type: 'object', properties: {} }, target)
      expect((result.config.form as any).labelPosition).toBe('right')
    })

    it('uses top label position for vertical layout', () => {
      const result = compile({ type: 'object', layout: 'vertical', properties: {} }, target)
      expect((result.config.form as any).labelPosition).toBe('top')
    })
  })

  describe('edge cases', () => {
    it('handles empty schema', () => {
      const result = compile({ type: 'object', properties: {} }, target)
      expect(result.success).toBe(true)
      expect((result.config.formItems as any[]).length).toBe(0)
    })

    it('handles null schema gracefully', () => {
      const result = compile(null, target)
      expect(result.success).toBe(true)
      expect((result.config.formItems as any[]).length).toBe(0)
    })

    it('warns about nested objects', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            address: {
              type: 'object',
              properties: { city: { type: 'string' } },
            },
          },
        },
        target,
      )

      expect(result.warnings.some((w) => w.code === 'NESTED_OBJECT')).toBe(true)
    })

    it('warns about unknown widgets', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            x: { type: 'string', widget: 'unknown-widget' },
          },
        },
        target,
      )

      expect(result.warnings.some((w) => w.code === 'UNKNOWN_WIDGET')).toBe(true)
    })
  })
})

describe('compile to html', () => {
  it('compiles basic fields', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名', required: true },
          age: { type: 'number', title: '年龄' },
        },
      },
      'html',
    )

    expect(result.success).toBe(true)
    const fields = result.config.fields as any[]
    expect(fields).toHaveLength(2)
    expect(fields[0].tag).toBe('input')
    expect(fields[0].attributes.type).toBe('text')
    expect(fields[1].attributes.type).toBe('number')
  })

  it('warns about expressions in HTML mode', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          x: { type: 'string', hidden: '{{ $values.y }}' },
        },
      },
      'html',
    )

    expect(result.warnings.some((w) => w.code === 'EXPRESSION_UNSUPPORTED')).toBe(true)
  })
})

describe('compile with unknown target', () => {
  it('returns error for unknown target', () => {
    const result = compile({ type: 'object', properties: {} }, 'unknown' as any)
    expect(result.success).toBe(false)
    expect(result.warnings[0].code).toBe('UNKNOWN_TARGET')
  })
})
