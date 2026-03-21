import { describe, it, expect } from 'vitest'
import {
  compile,
  evaluateExpression,
  isExpression,
  extractExpression,
  resolveTemplate,
  ExpressionError,
} from '../src/index'

describe('safe-template-expr', () => {
  describe('isExpression', () => {
    it('detects {{ }} expressions', () => {
      expect(isExpression('{{ a + b }}')).toBe(true)
      expect(isExpression('  {{ x }}  ')).toBe(true)
    })

    it('rejects non-expressions', () => {
      expect(isExpression('hello')).toBe(false)
      expect(isExpression(42)).toBe(false)
      expect(isExpression(null)).toBe(false)
    })
  })

  describe('extractExpression', () => {
    it('extracts inner expression', () => {
      expect(extractExpression('{{ a + b }}')).toBe('a + b')
    })

    it('returns input if no {{ }}', () => {
      expect(extractExpression('hello')).toBe('hello')
    })
  })

  describe('compile + evaluate', () => {
    it('evaluates arithmetic', () => {
      const fn = compile('a + b * 2')
      expect(fn({ a: 10, b: 5 })).toBe(20)
    })

    it('evaluates comparisons', () => {
      expect(compile('age >= 18')({ age: 20 })).toBe(true)
      expect(compile('age >= 18')({ age: 15 })).toBe(false)
    })

    it('evaluates logical operators', () => {
      expect(compile('a && b')({ a: true, b: true })).toBe(true)
      expect(compile('a || b')({ a: false, b: true })).toBe(true)
    })

    it('evaluates ternary', () => {
      expect(compile('x > 0 ? "positive" : "non-positive"')({ x: 5 })).toBe('positive')
      expect(compile('x > 0 ? "positive" : "non-positive"')({ x: -1 })).toBe('non-positive')
    })

    it('evaluates member access', () => {
      expect(compile('user.name')({ user: { name: 'Alice' } })).toBe('Alice')
    })

    it('null-safe member access', () => {
      expect(compile('user.name')({ user: null })).toBe(undefined)
      expect(compile('user.address.city')({})).toBe(undefined)
    })

    it('evaluates unary operators', () => {
      expect(compile('!x')({ x: false })).toBe(true)
      expect(compile('-x')({ x: 5 })).toBe(-5)
    })

    it('evaluates string literals', () => {
      expect(compile("x === 'hello'")({ x: 'hello' })).toBe(true)
    })

    it('evaluates boolean and null literals', () => {
      expect(compile('true')({})).toBe(true)
      expect(compile('false')({})).toBe(false)
      expect(compile('null')({})).toBe(null)
    })

    it('evaluates parenthesized expressions', () => {
      expect(compile('(a + b) * 2')({ a: 3, b: 4 })).toBe(14)
    })

    it('supports strict equality', () => {
      expect(compile('x === 1')({ x: 1 })).toBe(true)
      expect(compile('x !== 2')({ x: 1 })).toBe(true)
    })

    it('supports modulo', () => {
      expect(compile('x % 2')({ x: 7 })).toBe(1)
    })
  })

  describe('evaluateExpression', () => {
    it('returns result for valid expression', () => {
      expect(evaluateExpression('1 + 2', {})).toBe(3)
    })

    it('returns undefined for invalid expression', () => {
      expect(evaluateExpression('???', {})).toBe(undefined)
    })
  })

  describe('resolveTemplate', () => {
    it('evaluates {{ }} templates', () => {
      expect(resolveTemplate('{{ price * 2 }}', { price: 50 })).toBe(100)
    })

    it('returns non-expression values as-is', () => {
      expect(resolveTemplate('hello', {})).toBe('hello')
      expect(resolveTemplate(42, {})).toBe(42)
      expect(resolveTemplate(null, {})).toBe(null)
    })

    it('returns undefined for invalid template expressions', () => {
      expect(resolveTemplate('{{ ??? }}', {})).toBe(undefined)
    })
  })

  describe('ExpressionError', () => {
    it('thrown for syntax errors', () => {
      expect(() => compile('@invalid')).toThrow(ExpressionError)
    })

    it('includes position info', () => {
      try {
        compile('@')
      } catch (e) {
        expect(e).toBeInstanceOf(ExpressionError)
        expect((e as ExpressionError).pos).toBe(0)
      }
    })

    it('thrown for unterminated strings', () => {
      expect(() => compile("'unclosed")).toThrow(ExpressionError)
    })
  })

  describe('AST introspection', () => {
    it('compiled function exposes ast', () => {
      const fn = compile('a + 1')
      expect(fn.ast).toBeDefined()
      expect(fn.ast.type).toBe('BinaryExpression')
    })
  })
})
