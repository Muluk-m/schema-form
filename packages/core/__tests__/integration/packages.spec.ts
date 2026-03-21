/**
 * Integration tests — verify cross-package interactions work correctly.
 * These tests import from built packages to catch module resolution issues.
 */

import { describe, it, expect } from 'vitest'

describe('cross-package integration', () => {
  describe('@v3sf/core re-exports @v3sf/schema types', () => {
    it('exports Schema type from core', async () => {
      const core = await import('@v3sf/core')
      // compileExpression is re-exported from safe-template-expr
      expect(typeof core.compileExpression).toBe('function')
    })

    it('core defineAdapter still works', async () => {
      const { defineAdapter } = await import('@v3sf/core')
      const adapter = defineAdapter({
        widgets: {
          input: { component: {} },
        },
      })
      expect(adapter.widgets.input).toBeDefined()
    })
  })

  describe('safe-template-expr standalone usage', () => {
    it('compiles and evaluates independently of v3sf', async () => {
      const { compile, isExpression, resolveTemplate } = await import('safe-template-expr')

      const fn = compile('price * quantity')
      expect(fn({ price: 25, quantity: 4 })).toBe(100)

      expect(isExpression('{{ a + b }}')).toBe(true)
      expect(isExpression('plain text')).toBe(false)

      expect(resolveTemplate('{{ x > 10 }}', { x: 15 })).toBe(true)
      expect(resolveTemplate('static', {})).toBe('static')
    })
  })

  describe('@v3sf/schema standalone usage', () => {
    it('validates schema without any Vue dependency', async () => {
      const { validateAndRepair } = await import('@v3sf/schema')

      const result = validateAndRepair({
        properties: {
          name: { widget: 'input', title: '姓名' },
        },
      })

      expect(result.repaired).toBe(true)
      expect(result.schema.type).toBe('object')
      expect(result.schema.properties.name.type).toBe('string')
    })

    it('normalizes schema', async () => {
      const { normalizeSchema } = await import('@v3sf/schema')

      const result = normalizeSchema({
        type: 'object',
        properties: {
          age: { type: 'number', title: '年龄' },
        },
      })

      expect(result.properties.age.widget).toBe('number')
    })

    it('exports widget registry', async () => {
      const { KNOWN_WIDGETS, WIDGET_TYPE_MAP, ENUM_WIDGETS } = await import('@v3sf/schema')

      expect(KNOWN_WIDGETS.has('input')).toBe(true)
      expect(WIDGET_TYPE_MAP['switch']).toBe('boolean')
      expect(ENUM_WIDGETS.has('select')).toBe(true)
    })
  })

  describe('@v3sf/compiler end-to-end', () => {
    it('schema → validate → normalize → compile pipeline', async () => {
      const { validateAndRepair, normalizeSchema } = await import('@v3sf/schema')
      const { compile } = await import('@v3sf/compiler')

      // Start with a messy AI-generated schema
      const raw = {
        properties: {
          name: { title: '姓名', widget: 'input' },
          agree: { widget: 'switch' },
          role: {
            widget: 'select',
            enum: ['admin', 'user'],
            enumNames: ['管理员', '用户'],
          },
        },
      }

      // Step 1: validate and repair
      const validated = validateAndRepair(raw)
      expect(validated.repaired).toBe(true)
      expect(validated.schema.type).toBe('object')

      // Step 2: normalize
      const normalized = normalizeSchema(validated.schema)
      expect(normalized.properties.name.type).toBe('string')
      expect(normalized.properties.agree.type).toBe('boolean')

      // Step 3: compile to Element Plus
      const epResult = compile(normalized, 'element-plus')
      expect(epResult.success).toBe(true)
      const items = epResult.config.formItems as any[]
      expect(items.find((i: any) => i.prop === 'name').component).toBe('el-input')
      expect(items.find((i: any) => i.prop === 'agree').component).toBe('el-switch')
      expect(items.find((i: any) => i.prop === 'role').component).toBe('el-select')

      // Step 4: compile to Ant Design
      const antdResult = compile(normalized, 'antd')
      expect(antdResult.success).toBe(true)
      const antdItems = antdResult.config.formItems as any[]
      expect(antdItems.find((i: any) => i.name === 'role').component).toBe('Select')

      // Step 5: compile to Formily
      const formilyResult = compile(normalized, 'formily')
      expect(formilyResult.success).toBe(true)
      const formilyProps = (formilyResult.config as any).properties
      expect(formilyProps.role['x-component']).toBe('Select')

      // Step 6: compile to HTML
      const htmlResult = compile(normalized, 'html')
      expect(htmlResult.success).toBe(true)
    })

    it('handles expressions through the full pipeline', async () => {
      const { validateAndRepair } = await import('@v3sf/schema')
      const { compile } = await import('@v3sf/compiler')

      const schema = validateAndRepair({
        type: 'object',
        properties: {
          hasCode: { type: 'boolean', widget: 'switch', title: '有优惠码' },
          code: {
            type: 'string',
            title: '优惠码',
            hidden: '{{ !$values.hasCode }}',
            required: '{{ $values.hasCode }}',
          },
        },
      })

      // Element Plus: expressions extracted
      const ep = compile(schema.schema, 'element-plus')
      expect(ep.expressions.length).toBeGreaterThan(0)
      const hiddenExpr = ep.expressions.find((e) => e.prop === 'hidden')
      expect(hiddenExpr?.compiled).toContain('formData.hasCode')

      // Formily: expressions become x-reactions
      const formily = compile(schema.schema, 'formily')
      const codeField = (formily.config as any).properties.code
      expect(codeField['x-reactions']).toBeDefined()
      expect(codeField['x-reactions'].length).toBeGreaterThan(0)

      // Ant Design: dependencies extracted
      const antd = compile(schema.schema, 'antd')
      const codeItem = (antd.config.formItems as any[]).find((i) => i.name === 'code')
      expect(codeItem.dependencies).toContain('hasCode')
    })
  })

  describe('@v3sf/ai createGenerator structure', () => {
    it('exports createGenerator factory', async () => {
      const { createGenerator, GeneratorError } = await import('@v3sf/ai')

      expect(typeof createGenerator).toBe('function')
      expect(typeof GeneratorError).toBe('function')

      const generator = createGenerator({ apiKey: 'test' })
      expect(typeof generator.generate).toBe('function')
      expect(typeof generator.modify).toBe('function')
    })

    it('exports prompt templates', async () => {
      const { systemPrompt, generateSchemaPrompt, modifySchemaPrompt } = await import('@v3sf/ai')

      expect(typeof systemPrompt).toBe('string')
      expect(systemPrompt.length).toBeGreaterThan(100)

      const genPrompt = generateSchemaPrompt('注册表单')
      expect(genPrompt).toContain('注册表单')

      const modPrompt = modifySchemaPrompt({ type: 'object', properties: {} }, '加字段')
      expect(modPrompt).toContain('加字段')
    })

    it('exports examples corpus', async () => {
      const { examples } = await import('@v3sf/ai')

      expect(Array.isArray(examples)).toBe(true)
      expect(examples.length).toBeGreaterThanOrEqual(10)
      for (const ex of examples) {
        expect(ex.name).toBeDefined()
        expect(ex.schema?.type).toBe('object')
        expect(ex.schema?.properties).toBeDefined()
      }
    })
  })
})
