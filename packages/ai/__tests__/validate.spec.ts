import { describe, it, expect } from 'vitest'
import { validateAndRepair } from '../src/validate'

describe('validateAndRepair', () => {
  describe('missing root type', () => {
    it('should add type: "object" when type is missing', () => {
      const result = validateAndRepair({ properties: { name: { type: 'string' } } })
      expect(result.schema.type).toBe('object')
      expect(result.repaired).toBe(true)
      expect(result.repairs.length).toBeGreaterThan(0)
    })

    it('should fix incorrect root type', () => {
      const result = validateAndRepair({ type: 'string', properties: {} })
      expect(result.schema.type).toBe('object')
      expect(result.repaired).toBe(true)
    })
  })

  describe('missing properties', () => {
    it('should add empty properties when missing', () => {
      const result = validateAndRepair({ type: 'object' })
      expect(result.schema.properties).toEqual({})
      expect(result.repaired).toBe(true)
    })

    it('should extract top-level fields into properties if they look like field definitions', () => {
      const result = validateAndRepair({
        type: 'object',
        name: { type: 'string', title: 'Name' },
      })
      expect(result.schema.properties.name).toBeDefined()
      expect(result.schema.properties.name.type).toBe('string')
      expect(result.repaired).toBe(true)
    })
  })

  describe('field without type', () => {
    it('should infer type from widget', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          toggle: { widget: 'switch', title: 'Toggle' },
        },
      })
      expect(result.schema.properties.toggle.type).toBe('boolean')
      expect(result.repaired).toBe(true)
    })

    it('should infer type as "string" from enum', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          color: { enum: ['red', 'blue'], title: 'Color' },
        },
      })
      expect(result.schema.properties.color.type).toBe('string')
    })

    it('should infer type as "object" from properties', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          address: { properties: { street: { type: 'string' } } },
        },
      })
      expect(result.schema.properties.address.type).toBe('object')
    })

    it('should default to "string" when no hints available', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          unknown: { title: 'Unknown' },
        },
      })
      expect(result.schema.properties.unknown.type).toBe('string')
    })
  })

  describe('unknown widget name', () => {
    it('should report error for unknown widget', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          field1: { type: 'string', widget: 'nonexistent' },
        },
      })
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some((e) => e.includes('nonexistent'))).toBe(true)
    })
  })

  describe('enum/enumNames length mismatch', () => {
    it('should report error when lengths differ', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          color: {
            type: 'string',
            widget: 'select',
            enum: ['a', 'b', 'c'],
            enumNames: ['A', 'B'],
          },
        },
      })
      expect(result.errors.some((e) => e.includes('长度不一致'))).toBe(true)
    })
  })

  describe('valid schema', () => {
    it('should return unchanged schema with no repairs or errors', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name', placeholder: 'Enter name' },
          age: { type: 'number', title: 'Age', widget: 'stepper' },
        },
      }
      const result = validateAndRepair(schema)
      expect(result.schema).toEqual(schema)
      expect(result.repairs).toEqual([])
      expect(result.errors).toEqual([])
      expect(result.repaired).toBe(false)
    })
  })

  describe('deeply invalid schema', () => {
    it('should return errors for null input', () => {
      const result = validateAndRepair(null)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.repaired).toBe(false)
    })

    it('should return errors for primitive input', () => {
      const result = validateAndRepair('not a schema')
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should handle field with unknown type', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          field1: { type: 'foobar' },
        },
      })
      expect(result.errors.some((e) => e.includes('foobar'))).toBe(true)
    })
  })

  describe('does not mutate original', () => {
    it('should not modify the original schema object', () => {
      const original = { properties: { name: { title: 'Name' } } }
      const copy = JSON.parse(JSON.stringify(original))
      validateAndRepair(original)
      expect(original).toEqual(copy)
    })
  })

  describe('invalid displayType', () => {
    it('should remove invalid displayType', () => {
      const result = validateAndRepair({
        type: 'object',
        properties: {
          field1: { type: 'string', displayType: 'invalid' },
        },
      })
      expect(result.schema.properties.field1.displayType).toBeUndefined()
      expect(result.repaired).toBe(true)
    })
  })
})
