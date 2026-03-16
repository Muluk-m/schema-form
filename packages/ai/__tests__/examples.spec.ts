import { describe, it, expect } from 'vitest'
import { examples } from '../src/examples'

describe('examples', () => {
  it('should be an array with at least 10 items', () => {
    expect(Array.isArray(examples)).toBe(true)
    expect(examples.length).toBeGreaterThanOrEqual(10)
  })

  it('each example should have name, description, and schema', () => {
    for (const example of examples) {
      expect(typeof example.name).toBe('string')
      expect(example.name.length).toBeGreaterThan(0)
      expect(typeof example.description).toBe('string')
      expect(example.description.length).toBeGreaterThan(0)
      expect(typeof example.schema).toBe('object')
      expect(example.schema).not.toBeNull()
    }
  })

  it('each schema should have type: "object" and properties', () => {
    for (const example of examples) {
      expect(example.schema.type).toBe('object')
      expect(typeof example.schema.properties).toBe('object')
      expect(example.schema.properties).not.toBeNull()
      expect(Array.isArray(example.schema.properties)).toBe(false)
    }
  })

  it('each schema should have at least one property', () => {
    for (const example of examples) {
      expect(Object.keys(example.schema.properties).length).toBeGreaterThan(0)
    }
  })

  it('should have no duplicate names', () => {
    const names = examples.map((e) => e.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })

  it('each field in schema properties should have a type', () => {
    for (const example of examples) {
      for (const [_fieldName, field] of Object.entries(example.schema.properties)) {
        const f = field as Record<string, any>
        expect(f.type).toBeDefined()
        expect(typeof f.type).toBe('string')
      }
    }
  })

  it('fields with enum should have matching enumNames length', () => {
    for (const example of examples) {
      for (const [, field] of Object.entries(example.schema.properties)) {
        const f = field as Record<string, any>
        if (f.enum && f.enumNames) {
          expect(f.enum.length).toBe(f.enumNames.length)
        }
      }
    }
  })
})
