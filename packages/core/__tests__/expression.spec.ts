import { describe, it, expect } from 'vitest'
import { compile, isExpression, resolveValue, ExpressionError } from '../src/expression'

describe('Expression Engine', () => {
  describe('isExpression', () => {
    it('detects {{ }} expressions', () => {
      expect(isExpression('{{ $values.name }}')).toBe(true)
      expect(isExpression('{{ $values.age > 18 }}')).toBe(true)
      expect(isExpression('hello')).toBe(false)
      expect(isExpression(true)).toBe(false)
      expect(isExpression(42)).toBe(false)
      expect(isExpression(null)).toBe(false)
    })
  })

  describe('Property Access', () => {
    it('accesses top-level property', () => {
      const fn = compile('$values.name')
      expect(fn({ $values: { name: 'Alice' } })).toBe('Alice')
    })

    it('accesses nested property', () => {
      const fn = compile('$values.address.city')
      expect(fn({ $values: { address: { city: 'Beijing' } } })).toBe('Beijing')
    })

    it('returns undefined for missing property (null-safe)', () => {
      const fn = compile('$values.address.city')
      expect(fn({ $values: { address: undefined } })).toBeUndefined()
      expect(fn({ $values: {} })).toBeUndefined()
    })

    it('returns undefined when root is null', () => {
      const fn = compile('$values.name')
      expect(fn({ $values: null })).toBeUndefined()
    })
  })

  describe('Comparison', () => {
    it('strict equality', () => {
      const fn = compile('$values.age === 18')
      expect(fn({ $values: { age: 18 } })).toBe(true)
      expect(fn({ $values: { age: '18' } })).toBe(false)
    })

    it('strict inequality', () => {
      const fn = compile('$values.type !== "admin"')
      expect(fn({ $values: { type: 'user' } })).toBe(true)
    })

    it('greater than / less than', () => {
      const fn = compile('$values.age >= 18')
      expect(fn({ $values: { age: 20 } })).toBe(true)
      expect(fn({ $values: { age: 17 } })).toBe(false)
      expect(fn({ $values: { age: 18 } })).toBe(true)
    })

    it('loose equality', () => {
      const fn = compile('$values.age == 18')
      expect(fn({ $values: { age: 18 } })).toBe(true)
      expect(fn({ $values: { age: '18' } })).toBe(true)
    })
  })

  describe('Logical', () => {
    it('AND', () => {
      const fn = compile('$values.agreed && $values.age > 18')
      expect(fn({ $values: { agreed: true, age: 20 } })).toBe(true)
      expect(fn({ $values: { agreed: false, age: 20 } })).toBe(false)
    })

    it('OR', () => {
      const fn = compile('$values.isAdmin || $values.isMod')
      expect(fn({ $values: { isAdmin: false, isMod: true } })).toBe(true)
      expect(fn({ $values: { isAdmin: false, isMod: false } })).toBe(false)
    })

    it('NOT', () => {
      const fn = compile('!$values.hidden')
      expect(fn({ $values: { hidden: false } })).toBe(true)
      expect(fn({ $values: { hidden: true } })).toBe(false)
    })
  })

  describe('Ternary', () => {
    it('evaluates conditional expression', () => {
      const fn = compile("$values.type === 'vip' ? 'VIP用户' : '普通用户'")
      expect(fn({ $values: { type: 'vip' } })).toBe('VIP用户')
      expect(fn({ $values: { type: 'normal' } })).toBe('普通用户')
    })
  })

  describe('Arithmetic', () => {
    it('basic math', () => {
      expect(compile('$values.a + $values.b')({ $values: { a: 3, b: 4 } })).toBe(7)
      expect(compile('$values.a - $values.b')({ $values: { a: 10, b: 4 } })).toBe(6)
      expect(compile('$values.a * $values.b')({ $values: { a: 3, b: 4 } })).toBe(12)
      expect(compile('$values.a / $values.b')({ $values: { a: 12, b: 4 } })).toBe(3)
      expect(compile('$values.a % $values.b')({ $values: { a: 10, b: 3 } })).toBe(1)
    })

    it('unary minus', () => {
      expect(compile('-$values.a')({ $values: { a: 5 } })).toBe(-5)
    })
  })

  describe('Literals', () => {
    it('boolean literals', () => {
      expect(compile('true')({})).toBe(true)
      expect(compile('false')({})).toBe(false)
    })

    it('null literal', () => {
      expect(compile('null')({})).toBeNull()
    })

    it('number literal', () => {
      expect(compile('42')({})).toBe(42)
      expect(compile('3.14')({})).toBeCloseTo(3.14)
    })

    it('string literal', () => {
      expect(compile("'hello'")({})).toBe('hello')
      expect(compile('"world"')({})).toBe('world')
    })
  })

  describe('Parentheses', () => {
    it('respects grouping', () => {
      const fn = compile('($values.a + $values.b) * $values.c')
      expect(fn({ $values: { a: 2, b: 3, c: 4 } })).toBe(20)
    })
  })

  describe('Context Variables', () => {
    it('$selfValue access', () => {
      const fn = compile('$selfValue > 10')
      expect(fn({ $selfValue: 15 })).toBe(true)
      expect(fn({ $selfValue: 5 })).toBe(false)
    })

    it('$deps access', () => {
      const fn = compile('$deps.config.maxLength')
      expect(fn({ $deps: { config: { maxLength: 100 } } })).toBe(100)
    })
  })

  describe('Security', () => {
    it('rejects function calls', () => {
      expect(() => compile('alert("xss")')).toThrow()
    })

    it('rejects assignment', () => {
      expect(() => compile('$values.name = "hacked"')).toThrow()
    })

    it('rejects semicolons', () => {
      expect(() => compile('$values.a; $values.b')).toThrow()
    })
  })

  describe('Error handling', () => {
    it('throws ExpressionError with position', () => {
      try {
        compile('$values.age >')
        expect.fail('should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ExpressionError)
        expect((e as ExpressionError).pos).toBeGreaterThan(0)
      }
    })
  })

  describe('resolveValue', () => {
    it('returns literal values as-is', () => {
      expect(resolveValue(true, null, {}, {})).toBe(true)
      expect(resolveValue('hello', null, {}, {})).toBe('hello')
      expect(resolveValue(42, null, {}, {})).toBe(42)
    })

    it('evaluates {{ }} expressions', () => {
      expect(resolveValue('{{ $values.age > 18 }}', null, { age: 20 }, {})).toBe(true)
    })

    it('provides $selfValue', () => {
      expect(resolveValue('{{ $selfValue }}', 'myValue', {}, {})).toBe('myValue')
    })
  })
})
