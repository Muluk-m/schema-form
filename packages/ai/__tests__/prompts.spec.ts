import { describe, it, expect } from 'vitest'
import { systemPrompt, generateSchemaPrompt, modifySchemaPrompt } from '../src/prompts'

describe('systemPrompt', () => {
  it('should be a non-empty string', () => {
    expect(typeof systemPrompt).toBe('string')
    expect(systemPrompt.length).toBeGreaterThan(0)
  })

  it('should contain key terms about schema generation', () => {
    expect(systemPrompt).toContain('schema')
    expect(systemPrompt).toContain('type')
    expect(systemPrompt).toContain('properties')
    expect(systemPrompt).toContain('widget')
  })

  it('should mention v3sf', () => {
    expect(systemPrompt).toContain('v3sf')
  })

  it('should mention JSON format', () => {
    expect(systemPrompt).toContain('JSON')
  })

  it('should list known widget names', () => {
    const widgets = [
      'input',
      'textarea',
      'select',
      'radio',
      'checkbox',
      'switch',
      'date',
      'cascader',
      'picker',
      'stepper',
      'radioButton',
    ]
    for (const widget of widgets) {
      expect(systemPrompt).toContain(widget)
    }
  })

  it('should mention expression syntax {{ }}', () => {
    expect(systemPrompt).toContain('{{')
    expect(systemPrompt).toContain('}}')
  })
})

describe('generateSchemaPrompt', () => {
  it('should return a string containing the description', () => {
    const description = 'A user registration form with name and email'
    const result = generateSchemaPrompt(description)
    expect(typeof result).toBe('string')
    expect(result).toContain(description)
  })

  it('should mention JSON and schema requirements', () => {
    const result = generateSchemaPrompt('any form')
    expect(result).toContain('JSON')
    expect(result).toContain('type')
    expect(result).toContain('properties')
  })
})

describe('modifySchemaPrompt', () => {
  it('should return a string containing the current schema and instruction', () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } } }
    const instruction = 'Add an email field'
    const result = modifySchemaPrompt(schema, instruction)
    expect(typeof result).toBe('string')
    expect(result).toContain('"type": "object"')
    expect(result).toContain(instruction)
  })

  it('should include the serialized schema', () => {
    const schema = { type: 'object', properties: { age: { type: 'number' } } }
    const result = modifySchemaPrompt(schema, 'change age to string')
    expect(result).toContain('"age"')
    expect(result).toContain('"number"')
  })

  it('should mention preserving existing fields', () => {
    const result = modifySchemaPrompt({ type: 'object', properties: {} }, 'add field')
    expect(result).toContain('保留')
  })
})
