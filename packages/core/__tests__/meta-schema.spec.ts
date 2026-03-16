import { describe, it, expect } from 'vitest'
import metaSchema from '../schema.meta.json'

describe('meta-schema structure', () => {
  it('should be a valid JSON Schema with $schema and $id', () => {
    expect(metaSchema.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
    expect(metaSchema.$id).toBe('https://v3sf.dev/schema.meta.json')
  })

  it('should have title and description', () => {
    expect(metaSchema.title).toBe('v3sf Schema')
    expect(typeof metaSchema.description).toBe('string')
    expect(metaSchema.description.length).toBeGreaterThan(0)
  })

  it('should define root type as object', () => {
    expect(metaSchema.type).toBe('object')
  })

  it('should require "type" and "properties" at root', () => {
    expect(metaSchema.required).toEqual(['type', 'properties'])
  })

  it('should define root properties with "type" as const "object"', () => {
    expect(metaSchema.properties.type).toEqual({ const: 'object' })
  })

  it('should define root properties.properties referencing $defs/field', () => {
    const props = metaSchema.properties.properties
    expect(props.type).toBe('object')
    expect(props.additionalProperties.$ref).toBe('#/$defs/field')
  })
})

describe('meta-schema $defs/field', () => {
  const field = metaSchema.$defs.field

  it('should be an object type', () => {
    expect(field.type).toBe('object')
  })

  it('should define expected field properties', () => {
    const expectedKeys = [
      'type',
      'title',
      'widget',
      'required',
      'placeholder',
      'disabled',
      'readonly',
      'hidden',
      'displayType',
      'className',
      'border',
      'enum',
      'enumNames',
      'rules',
      'props',
      'properties',
    ]
    const actualKeys = Object.keys(field.properties)
    for (const key of expectedKeys) {
      expect(actualKeys).toContain(key)
    }
  })

  it('should define type field with valid enum values', () => {
    const typeField = field.properties.type
    expect(typeField.type).toBe('string')
    expect(typeField.enum).toEqual(['string', 'number', 'boolean', 'array', 'date', 'object'])
  })

  it('should define widget as a string', () => {
    expect(field.properties.widget.type).toBe('string')
  })

  it('should define displayType with row/column enum', () => {
    expect(field.properties.displayType.enum).toEqual(['row', 'column'])
  })

  it('should define enum and enumNames as arrays', () => {
    expect(field.properties.enum.type).toBe('array')
    expect(field.properties.enumNames.type).toBe('array')
  })

  it('should support nested properties referencing $defs/field recursively', () => {
    const nested = field.properties.properties
    expect(nested.type).toBe('object')
    expect(nested.additionalProperties.$ref).toBe('#/$defs/field')
  })
})

describe('meta-schema $defs/rule', () => {
  const rule = metaSchema.$defs.rule

  it('should be an object type', () => {
    expect(rule.type).toBe('object')
  })

  it('should define expected rule properties', () => {
    const expectedKeys = ['required', 'pattern', 'min', 'max', 'len', 'type', 'message']
    const actualKeys = Object.keys(rule.properties)
    for (const key of expectedKeys) {
      expect(actualKeys).toContain(key)
    }
  })

  it('should define message as a string with description', () => {
    expect(rule.properties.message.type).toBe('string')
    expect(typeof rule.properties.message.description).toBe('string')
  })
})
