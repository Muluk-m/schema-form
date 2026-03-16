import { describe, it, expect } from 'vitest'
import { createBEM, createNamespace, uid, isObject, isJsonSchema, pick } from '../src/utils'

describe('createBEM', () => {
  const bem = createBEM('btn')

  it('should return base class with no arguments', () => {
    expect(bem()).toBe('btn')
  })

  it('should return element class', () => {
    expect(bem('icon')).toBe('btn__icon')
  })

  it('should return base class with string modifier', () => {
    expect(bem('primary')).toBe('btn__primary')
  })

  it('should return base class with modifier when first arg is non-string', () => {
    expect(bem('disabled')).toBe('btn__disabled')
  })

  it('should return base class with object modifier (truthy)', () => {
    expect(bem({ active: true })).toBe('btn btn--active')
  })

  it('should omit falsy object modifier', () => {
    expect(bem({ active: false })).toBe('btn')
  })

  it('should handle mixed object modifiers', () => {
    const result = bem({ active: true, disabled: false, large: true })
    expect(result).toBe('btn btn--active btn--large')
  })

  it('should handle array modifiers', () => {
    const result = bem(['primary', 'large'])
    expect(result).toBe('btn btn--primary btn--large')
  })

  it('should handle element with string modifier', () => {
    expect(bem('icon', 'small')).toBe('btn__icon btn__icon--small')
  })

  it('should handle element with object modifier', () => {
    expect(bem('icon', { active: true })).toBe('btn__icon btn__icon--active')
  })

  it('should handle element with array modifier', () => {
    expect(bem('icon', ['small', 'round'])).toBe('btn__icon btn__icon--small btn__icon--round')
  })
})

describe('createNamespace', () => {
  it('should return prefixed name and BEM function', () => {
    const [name, bem] = createNamespace('form')
    expect(name).toBe('v3sf-form')
    expect(typeof bem).toBe('function')
  })

  it('should produce correct BEM classes with prefix', () => {
    const [, bem] = createNamespace('field')
    expect(bem()).toBe('v3sf-field')
    expect(bem('label')).toBe('v3sf-field__label')
    expect(bem({ required: true })).toBe('v3sf-field v3sf-field--required')
  })
})

describe('uid', () => {
  it('should return a string of default length 11', () => {
    const id = uid()
    expect(typeof id).toBe('string')
    expect(id.length).toBe(11)
  })

  it('should return a string of specified length', () => {
    expect(uid(5).length).toBe(5)
    expect(uid(20).length).toBe(20)
  })

  it('should generate unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid()))
    expect(ids.size).toBe(100)
  })

  it('should only contain alphanumeric characters (0-9, a-z)', () => {
    const id = uid(100)
    expect(id).toMatch(/^[0-9a-z]+$/)
  })
})

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
  })

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isObject([])).toBe(false)
    expect(isObject([1, 2])).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(undefined)).toBe(false)
  })
})

describe('isJsonSchema', () => {
  it('should return true for valid schema structure', () => {
    expect(isJsonSchema({ type: 'object', properties: { name: { type: 'string' } } })).toBe(true)
  })

  it('should return true for schema with empty properties', () => {
    expect(isJsonSchema({ type: 'object', properties: {} })).toBe(true)
  })

  it('should return false if type is not "object"', () => {
    expect(isJsonSchema({ type: 'string', properties: {} })).toBe(false)
  })

  it('should return false if properties is missing', () => {
    expect(isJsonSchema({ type: 'object' })).toBe(false)
  })

  it('should return false if properties is not an object', () => {
    expect(isJsonSchema({ type: 'object', properties: 'bad' })).toBe(false)
    expect(isJsonSchema({ type: 'object', properties: [] })).toBe(false)
  })

  it('should return false for non-objects', () => {
    expect(isJsonSchema(null)).toBe(false)
    expect(isJsonSchema(42)).toBe(false)
    expect(isJsonSchema('string')).toBe(false)
  })
})

describe('pick', () => {
  it('should pick specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('should omit undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 } as Record<string, any>
    expect(pick(obj, ['a', 'b'])).toEqual({ a: 1 })
  })

  it('should return empty object when picking no keys', () => {
    expect(pick({ a: 1 }, [])).toEqual({})
  })

  it('should ignore keys not present in object', () => {
    const obj = { a: 1 } as Record<string, any>
    expect(pick(obj, ['a', 'z' as any])).toEqual({ a: 1 })
  })
})
