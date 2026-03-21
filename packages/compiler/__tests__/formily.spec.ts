import { describe, it, expect } from 'vitest'
import { compile } from '../src/index'

describe('compile to formily', () => {
  const target = 'formily' as const

  it('compiles a simple field with x-component', () => {
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
    const props = (result.config as any).properties
    expect(props.name['x-component']).toBe('Input')
    expect(props.name['x-decorator']).toBe('FormItem')
    expect(props.name.title).toBe('姓名')
    expect(props.name['x-component-props'].placeholder).toBe('请输入')
  })

  it('maps all widget types to Formily components', () => {
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
    const props = (result.config as any).properties

    expect(props.a['x-component']).toBe('Input')
    expect(props.b['x-component']).toBe('Input.TextArea')
    expect(props.c['x-component']).toBe('NumberPicker')
    expect(props.d['x-component']).toBe('Switch')
    expect(props.e['x-component']).toBe('Radio.Group')
    expect(props.f['x-component']).toBe('Select')
    expect(props.g['x-component']).toBe('Checkbox.Group')
    expect(props.h['x-component']).toBe('Cascader')
    expect(props.i['x-component']).toBe('DatePicker')
  })

  it('converts enum to Formily format', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            widget: 'select',
            enum: ['admin', 'user'],
            enumNames: ['管理员', '用户'],
          },
        },
      },
      target,
    )

    const props = (result.config as any).properties
    expect(props.role.enum).toEqual([
      { label: '管理员', value: 'admin' },
      { label: '用户', value: 'user' },
    ])
  })

  it('converts validation rules to x-validator', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          phone: {
            type: 'string',
            rules: [
              { required: true, message: '必填' },
              { pattern: '^1[3-9]\\d{9}$', message: '格式错误' },
            ],
          },
        },
      },
      target,
    )

    const validators = (result.config as any).properties.phone['x-validator']
    expect(validators).toHaveLength(2)
    expect(validators[0].required).toBe(true)
    expect(validators[1].pattern).toBe('^1[3-9]\\d{9}$')
  })

  describe('x-reactions (limited subset)', () => {
    it('compiles simple hidden expression to x-reactions', () => {
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

      const reactions = (result.config as any).properties.detail['x-reactions']
      expect(reactions).toHaveLength(1)
      expect(reactions[0].fulfill.state.display).toContain('$form.values.toggle')
      expect(reactions[0].fulfill.state.display).toContain('none')
      expect(reactions[0].fulfill.state.display).toContain('visible')
    })

    it('compiles disabled expression to x-reactions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            locked: { type: 'boolean', widget: 'switch' },
            name: { type: 'string', disabled: '{{ $values.locked }}' },
          },
        },
        target,
      )

      const reactions = (result.config as any).properties.name['x-reactions']
      expect(reactions).toHaveLength(1)
      expect(reactions[0].fulfill.state.pattern).toContain('disabled')
      expect(reactions[0].fulfill.state.pattern).toContain('editable')
    })

    it('compiles required expression to x-reactions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            hasCode: { type: 'boolean' },
            code: { type: 'string', required: '{{ $values.hasCode }}' },
          },
        },
        target,
      )

      const reactions = (result.config as any).properties.code['x-reactions']
      expect(reactions.some((r: any) => r.fulfill?.state?.required)).toBe(true)
    })

    it('warns about complex expressions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            x: {
              type: 'string',
              hidden: '{{ $values.a + $values.b > 10 }}',
            },
          },
        },
        target,
      )

      // + operator makes it complex
      expect(result.warnings.some((w) => w.code === 'COMPLEX_EXPRESSION')).toBe(true)
    })

    it('handles simple comparison expressions', () => {
      const result = compile(
        {
          type: 'object',
          properties: {
            type: { type: 'string', widget: 'select', enum: ['a', 'b'], enumNames: ['A', 'B'] },
            detail: { type: 'string', hidden: "{{ $values.type !== 'b' }}" },
          },
        },
        target,
      )

      // Simple comparison should compile without warnings
      const complexWarnings = result.warnings.filter((w) => w.code === 'COMPLEX_EXPRESSION')
      expect(complexWarnings).toHaveLength(0)
      expect(result.expressions).toHaveLength(1)
      expect(result.expressions[0].compiled).toContain("$form.values.type !== 'b'")
    })
  })

  it('outputs Formily JSON Schema structure', () => {
    const result = compile({ type: 'object', properties: { x: { type: 'string' } } }, target)

    expect((result.config as any).type).toBe('object')
    expect((result.config as any).properties).toBeDefined()
  })

  it('compiles nested objects recursively', () => {
    const result = compile(
      {
        type: 'object',
        properties: {
          address: {
            type: 'object',
            title: '地址',
            properties: {
              city: { type: 'string', title: '城市' },
            },
          },
        },
      },
      target,
    )

    const addr = (result.config as any).properties.address
    expect(addr.type).toBe('object')
    expect(addr.properties.city['x-component']).toBe('Input')
  })

  it('handles null schema', () => {
    const result = compile(null, target)
    expect(result.success).toBe(true)
  })
})
