/**
 * Schema validation and auto-repair for AI-generated schemas.
 *
 * Validates v3sf schema structure and automatically fixes common issues.
 */

import { KNOWN_WIDGETS, KNOWN_TYPES, WIDGET_TYPE_MAP, ENUM_WIDGETS } from './widgets'

export interface ValidateResult {
  /** Repaired schema */
  schema: any
  /** Auto-repair records */
  repairs: string[]
  /** Errors that cannot be auto-repaired */
  errors: string[]
  /** Whether any repairs were made */
  repaired: boolean
}

/**
 * Validate and auto-repair a v3sf schema.
 *
 * @param schema - Raw schema (will be deep-cloned, original is not modified)
 * @returns Validation result with repaired schema, repair records, and errors
 */
export function validateAndRepair(schema: any): ValidateResult {
  const repairs: string[] = []
  const errors: string[] = []

  if (schema == null || typeof schema !== 'object') {
    errors.push('schema 不是一个有效的对象')
    return {
      schema: { type: 'object', properties: {} },
      repairs: [],
      errors,
      repaired: false,
    }
  }

  const result = JSON.parse(JSON.stringify(schema))

  // 1. Fix missing root type: "object"
  if (result.type !== 'object') {
    if (result.type == null) {
      result.type = 'object'
      repairs.push('根节点缺少 type，已补充为 "object"')
    } else {
      repairs.push(`根节点 type 为 "${result.type}"，已修正为 "object"`)
      result.type = 'object'
    }
  }

  // 2. Fix missing properties
  if (result.properties == null) {
    const possibleFields: Record<string, any> = {}
    let foundFields = false
    for (const key of Object.keys(result)) {
      if (key !== 'type' && typeof result[key] === 'object' && result[key] !== null) {
        const val = result[key]
        if (val.type || val.title || val.widget) {
          possibleFields[key] = val
          foundFields = true
        }
      }
    }
    if (foundFields) {
      result.properties = possibleFields
      for (const key of Object.keys(possibleFields)) {
        delete result[key]
      }
      repairs.push('根节点缺少 properties，已从顶层字段中提取')
    } else {
      result.properties = {}
      repairs.push('根节点缺少 properties，已补充为空对象')
    }
  } else if (typeof result.properties !== 'object' || Array.isArray(result.properties)) {
    errors.push('properties 不是一个有效的对象')
    result.properties = {}
  }

  // 3. Fix properties being an array
  if (Array.isArray(result.properties)) {
    result.properties = {}
    repairs.push('properties 为数组，已重置为空对象')
  }

  // 4. Validate and repair each field
  for (const [fieldName, fieldValue] of Object.entries(result.properties)) {
    if (fieldValue == null || typeof fieldValue !== 'object') {
      errors.push(`字段 "${fieldName}" 不是有效的对象`)
      continue
    }

    const field = fieldValue as Record<string, any>

    // 4a. Bare array → { type: "array" }
    if (Array.isArray(field)) {
      result.properties[fieldName] = { type: 'array', enum: field }
      repairs.push(`字段 "${fieldName}" 为裸数组，已包裹为 { type: "array" }`)
      continue
    }

    // 4b. Ensure field has type
    if (!field.type) {
      if (field.widget && WIDGET_TYPE_MAP[field.widget]) {
        field.type = WIDGET_TYPE_MAP[field.widget]
        repairs.push(
          `字段 "${fieldName}" 缺少 type，已根据 widget "${field.widget}" 推断为 "${field.type}"`,
        )
      } else if (field.enum || field.enumNames) {
        field.type = 'string'
        repairs.push(`字段 "${fieldName}" 缺少 type，因存在 enum 已推断为 "string"`)
      } else if (field.properties) {
        field.type = 'object'
        repairs.push(`字段 "${fieldName}" 缺少 type，因存在 properties 已推断为 "object"`)
      } else {
        field.type = 'string'
        repairs.push(`字段 "${fieldName}" 缺少 type，已默认设为 "string"`)
      }
    }

    // 4c. Validate type
    if (typeof field.type === 'string' && !KNOWN_TYPES.has(field.type)) {
      errors.push(
        `字段 "${fieldName}" 的 type "${field.type}" 不是已知类型（${[...KNOWN_TYPES].join(', ')}）`,
      )
    }

    // 4d. Validate widget
    if (field.widget && typeof field.widget === 'string' && !KNOWN_WIDGETS.has(field.widget)) {
      errors.push(
        `字段 "${fieldName}" 的 widget "${field.widget}" 不是已知组件（${[...KNOWN_WIDGETS].join(', ')}）`,
      )
    }

    // 4e. Enum widget without enum values
    if (field.widget && ENUM_WIDGETS.has(field.widget)) {
      if (!field.enum) {
        errors.push(`字段 "${fieldName}" 使用 widget "${field.widget}" 但缺少 enum 选项值`)
      }
    }

    // 4f. enum/enumNames length mismatch
    if (field.enum && field.enumNames) {
      if (Array.isArray(field.enum) && Array.isArray(field.enumNames)) {
        if (field.enum.length !== field.enumNames.length) {
          errors.push(
            `字段 "${fieldName}" 的 enum (${field.enum.length} 项) 与 enumNames (${field.enumNames.length} 项) 长度不一致`,
          )
        }
      }
    }

    // 4g. Recursively validate nested properties
    if (field.type === 'object' && field.properties) {
      const nested = validateAndRepair({ type: 'object', properties: field.properties })
      field.properties = nested.schema.properties
      for (const r of nested.repairs) {
        repairs.push(`${fieldName} > ${r}`)
      }
      for (const e of nested.errors) {
        errors.push(`${fieldName} > ${e}`)
      }
    }

    // 4h. displayType validation
    if (field.displayType && field.displayType !== 'row' && field.displayType !== 'column') {
      repairs.push(`字段 "${fieldName}" 的 displayType "${field.displayType}" 无效，已移除`)
      delete field.displayType
    }
  }

  return {
    schema: result,
    repairs,
    errors,
    repaired: repairs.length > 0,
  }
}
