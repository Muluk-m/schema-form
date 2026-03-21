import { describe, it, expect } from 'vitest'
import { normalizeSchema } from '../src/normalize'

describe('normalizeSchema', () => {
  it('returns empty schema for null input', () => {
    expect(normalizeSchema(null)).toEqual({ type: 'object', properties: {} })
  })

  it('returns empty schema for non-object input', () => {
    expect(normalizeSchema('hello')).toEqual({ type: 'object', properties: {} })
  })

  it('adds default type: "object" if missing', () => {
    const result = normalizeSchema({ properties: { name: { title: '姓名' } } })
    expect(result.type).toBe('object')
  })

  it('adds empty properties if missing', () => {
    const result = normalizeSchema({ type: 'object' })
    expect(result.properties).toEqual({})
  })

  it('infers type from widget', () => {
    const result = normalizeSchema({
      type: 'object',
      properties: {
        toggle: { widget: 'switch', title: '开关' },
        count: { widget: 'stepper', title: '数量' },
      },
    })
    expect(result.properties.toggle.type).toBe('boolean')
    expect(result.properties.count.type).toBe('number')
  })

  it('defaults type to string when unspecified', () => {
    const result = normalizeSchema({
      type: 'object',
      properties: {
        name: { title: '姓名' },
      },
    })
    expect(result.properties.name.type).toBe('string')
  })

  it('assigns default widget from type', () => {
    const result = normalizeSchema({
      type: 'object',
      properties: {
        name: { type: 'string', title: '姓名' },
        age: { type: 'number', title: '年龄' },
        agree: { type: 'boolean', title: '同意' },
      },
    })
    expect(result.properties.name.widget).toBe('input')
    expect(result.properties.age.widget).toBe('number')
    expect(result.properties.agree.widget).toBe('switch')
  })

  it('does not override explicit widget', () => {
    const result = normalizeSchema({
      type: 'object',
      properties: {
        bio: { type: 'string', widget: 'textarea', title: '简介' },
      },
    })
    expect(result.properties.bio.widget).toBe('textarea')
  })

  it('normalizes nested object properties', () => {
    const result = normalizeSchema({
      type: 'object',
      properties: {
        address: {
          type: 'object',
          title: '地址',
          properties: {
            city: { title: '城市' },
          },
        },
      },
    })
    expect(result.properties.address.properties.city.type).toBe('string')
    expect(result.properties.address.properties.city.widget).toBe('input')
  })

  it('does not mutate input', () => {
    const input = {
      type: 'object',
      properties: { name: { title: '姓名' } },
    }
    const copy = JSON.parse(JSON.stringify(input))
    normalizeSchema(input)
    expect(input).toEqual(copy)
  })
})
