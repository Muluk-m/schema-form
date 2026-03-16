import { describe, it, expect } from 'vitest'
import { validateField, validateAllFields } from '../src/validator'

describe('Validator', () => {
  describe('required', () => {
    it('fails on empty string', async () => {
      const errors = await validateField('', { required: true, title: '姓名' }, 'name', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails on null', async () => {
      const errors = await validateField(null, { required: true, title: '姓名' }, 'name', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails on undefined', async () => {
      const errors = await validateField(undefined, { required: true, title: '姓名' }, 'name', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('fails on empty array', async () => {
      const errors = await validateField([], { required: true, title: '选择' }, 'items', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes on non-empty value', async () => {
      const errors = await validateField('hello', { required: true, title: '姓名' }, 'name', {})
      expect(errors).toEqual([])
    })

    it('passes when not required and empty', async () => {
      const errors = await validateField('', { title: '姓名' }, 'name', {})
      expect(errors).toEqual([])
    })
  })

  describe('pattern', () => {
    it('fails on pattern mismatch', async () => {
      const errors = await validateField(
        '1234',
        { title: '手机号', rules: { pattern: '^\\d{11}$' } },
        'phone',
        {},
      )
      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes on pattern match', async () => {
      const errors = await validateField(
        '13800138000',
        { title: '手机号', rules: { pattern: '^\\d{11}$' } },
        'phone',
        {},
      )
      expect(errors).toEqual([])
    })

    it('supports RegExp pattern', async () => {
      const errors = await validateField(
        'abc',
        { title: '编码', rules: { pattern: /^\d+$/ } },
        'code',
        {},
      )
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('min/max', () => {
    it('validates number min', async () => {
      const errors = await validateField(-1, { title: '年龄', rules: { min: 0 } }, 'age', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('validates number max', async () => {
      const errors = await validateField(150, { title: '年龄', rules: { max: 120 } }, 'age', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('validates string length min', async () => {
      const errors = await validateField(
        'a',
        { type: 'string', title: '密码', rules: { min: 6 } },
        'password',
        {},
      )
      expect(errors.length).toBeGreaterThan(0)
    })

    it('validates string length max', async () => {
      const errors = await validateField(
        'a'.repeat(51),
        { type: 'string', title: '签名', rules: { max: 50 } },
        'bio',
        {},
      )
      expect(errors.length).toBeGreaterThan(0)
    })

    it('validates array length min', async () => {
      const errors = await validateField(['a'], { title: '标签', rules: { min: 2 } }, 'tags', {})
      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes when in range', async () => {
      const errors = await validateField(
        25,
        { title: '年龄', rules: { min: 0, max: 120 } },
        'age',
        {},
      )
      expect(errors).toEqual([])
    })
  })

  describe('custom validator', () => {
    it('returns custom error message', async () => {
      const errors = await validateField(
        'abc',
        {
          title: '确认密码',
          rules: {
            custom: (value, formData) => (value === formData.password ? true : '密码不一致'),
          },
        },
        'confirmPassword',
        { password: 'xyz' },
      )
      expect(errors).toEqual(['密码不一致'])
    })

    it('passes when custom returns true', async () => {
      const errors = await validateField(
        'xyz',
        {
          title: '确认密码',
          rules: {
            custom: (value, formData) => (value === formData.password ? true : '密码不一致'),
          },
        },
        'confirmPassword',
        { password: 'xyz' },
      )
      expect(errors).toEqual([])
    })
  })

  describe('multiple rules', () => {
    it('validates array of rules', async () => {
      const errors = await validateField(
        '',
        {
          title: '邮箱',
          required: true,
          rules: [
            { required: true, message: '请输入邮箱' },
            { pattern: /^[^@]+@[^@]+$/, message: '邮箱格式不正确' },
          ],
        },
        'email',
        {},
      )
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateAllFields', () => {
    it('validates all fields and returns errors', async () => {
      const errors = await validateAllFields(
        { name: '', age: 200 },
        {
          name: { required: true, title: '姓名' },
          age: { title: '年龄', rules: { max: 120 } },
        },
      )
      expect(errors.length).toBe(2)
      expect(errors.map((e) => e.name).sort()).toEqual(['age', 'name'])
    })

    it('returns empty when all valid', async () => {
      const errors = await validateAllFields(
        { name: 'Alice', age: 25 },
        {
          name: { required: true, title: '姓名' },
          age: { title: '年龄', rules: { max: 120 } },
        },
      )
      expect(errors).toEqual([])
    })
  })
})
