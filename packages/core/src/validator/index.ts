import type { FormData, Schema, ValidatorAdapter, ValidatorRule, ErrorMessage } from '../types'

// Default validation messages (Chinese)
const messages = {
  required: '${name}不能为空',
  pattern: '${name}格式不正确',
  min: {
    string: '${name}至少${min}个字符',
    number: '${name}不能小于${min}',
    array: '${name}至少选择${min}项',
  },
  max: {
    string: '${name}不能超过${max}个字符',
    number: '${name}不能大于${max}',
    array: '${name}最多选择${max}项',
  },
  len: '${name}长度应为${len}',
  type: '${name}类型不正确',
  default: '${name}校验失败',
}

function replaceMessage(template: string, kv: Record<string, any>): string {
  return template.replace(/\$\{\w+\}/g, (str) => {
    const key = str.slice(2, -1)
    return kv[key] ?? key
  })
}

function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

function validateRule(
  value: any,
  rule: ValidatorRule,
  fieldSchema: Schema,
  formData: FormData,
): string | null {
  const kv = { name: fieldSchema.title ?? '', ...rule, ...fieldSchema }

  // Required
  if (rule.required && isEmpty(value)) {
    return replaceMessage(rule.message ?? messages.required, kv)
  }

  // Skip other checks if empty and not required
  if (isEmpty(value)) return null

  // Pattern
  if (rule.pattern) {
    const regex = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern
    if (!regex.test(String(value))) {
      return replaceMessage(rule.message ?? messages.pattern, kv)
    }
  }

  // Min
  if (rule.min != null) {
    const isString = typeof value === 'string'
    const isArray = Array.isArray(value)
    const isNumber = typeof value === 'number'

    if (isString && value.length < rule.min) {
      return replaceMessage(rule.message ?? messages.min.string, kv)
    }
    if (isNumber && value < rule.min) {
      return replaceMessage(rule.message ?? messages.min.number, kv)
    }
    if (isArray && value.length < rule.min) {
      return replaceMessage(rule.message ?? messages.min.array, kv)
    }
  }

  // Max
  if (rule.max != null) {
    const isString = typeof value === 'string'
    const isArray = Array.isArray(value)
    const isNumber = typeof value === 'number'

    if (isString && value.length > rule.max) {
      return replaceMessage(rule.message ?? messages.max.string, kv)
    }
    if (isNumber && value > rule.max) {
      return replaceMessage(rule.message ?? messages.max.number, kv)
    }
    if (isArray && value.length > rule.max) {
      return replaceMessage(rule.message ?? messages.max.array, kv)
    }
  }

  // Len
  if (rule.len != null) {
    const length = typeof value === 'string' || Array.isArray(value) ? value.length : undefined
    if (length !== undefined && length !== rule.len) {
      return replaceMessage(rule.message ?? messages.len, kv)
    }
  }

  // Type
  if (rule.type) {
    let valid = true
    switch (rule.type) {
      case 'string':
        valid = typeof value === 'string'
        break
      case 'number':
        valid = typeof value === 'number' && !isNaN(value)
        break
      case 'boolean':
        valid = typeof value === 'boolean'
        break
      case 'array':
        valid = Array.isArray(value)
        break
      default:
        valid = true
    }
    if (!valid) {
      return replaceMessage(rule.message ?? messages.type, kv)
    }
  }

  // Custom
  if (rule.custom) {
    const result = rule.custom(value, formData)
    if (result !== true && typeof result === 'string') {
      return result
    }
  }

  return null
}

function normalizeRules(schema: Schema): ValidatorRule[] {
  const rules: ValidatorRule[] = []

  // Build rule from schema-level required
  if (schema.required) {
    rules.push({ required: true })
  }

  // Schema-level rules
  if (schema.rules) {
    if (Array.isArray(schema.rules)) {
      rules.push(...schema.rules)
    } else {
      rules.push(schema.rules)
    }
  }

  return rules
}

export async function validateField(
  value: any,
  fieldSchema: Schema,
  fieldName: string,
  formData: FormData,
  adapter?: ValidatorAdapter,
): Promise<string[]> {
  // Use external adapter if provided
  if (adapter) {
    return adapter.validate(value, normalizeRules(fieldSchema), fieldSchema)
  }

  // Built-in validation
  const rules = normalizeRules(fieldSchema)
  const errors: string[] = []

  for (const rule of rules) {
    const error = validateRule(value, rule, fieldSchema, formData)
    if (error) {
      errors.push(error)
    }
  }

  return errors
}

export async function validateAllFields(
  formData: FormData,
  properties: Record<string, Schema> | undefined,
  adapter?: ValidatorAdapter,
): Promise<ErrorMessage[]> {
  if (!properties) return []

  const results = await Promise.all(
    Object.keys(formData).map(async (name) => {
      const schema = properties[name]
      if (!schema) return { name, error: [] as string[] }

      const error = await validateField(formData[name], schema, name, formData, adapter)
      return { name, error }
    }),
  )

  return results.filter(({ error }) => error.length > 0)
}
