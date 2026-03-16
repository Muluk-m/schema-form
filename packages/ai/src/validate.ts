/**
 * v3sf Schema 校验与自动修复
 *
 * 对 AI 生成的 schema 进行校验，并尽可能自动修复常见问题。
 */

/** 所有已知的 widget 名称 */
const KNOWN_WIDGETS = new Set([
  'input',
  'textarea',
  'number',
  'stepper',
  'switch',
  'radio',
  'radioButton',
  'checkbox',
  'select',
  'picker',
  'cascader',
  'date',
])

/** 合法的字段值类型 */
const KNOWN_TYPES = new Set(['string', 'number', 'boolean', 'array', 'date', 'object'])

/** widget 到推断 type 的映射 */
const WIDGET_TYPE_MAP: Record<string, string> = {
  input: 'string',
  textarea: 'string',
  number: 'number',
  stepper: 'number',
  switch: 'boolean',
  radio: 'string',
  radioButton: 'string',
  checkbox: 'array',
  select: 'string',
  picker: 'string',
  cascader: 'array',
  date: 'date',
}

export interface ValidateResult {
  /** 修复后的 schema */
  schema: any
  /** 自动修复记录 */
  repairs: string[]
  /** 无法自动修复的错误 */
  errors: string[]
  /** 是否进行了修复 */
  repaired: boolean
}

/**
 * 校验并自动修复 v3sf schema
 *
 * @param schema - AI 生成的原始 schema（会被深拷贝，不修改原对象）
 * @returns 修复结果，包含修复后的 schema、修复记录和错误列表
 */
export function validateAndRepair(schema: any): ValidateResult {
  const repairs: string[] = []
  const errors: string[] = []

  // 处理非对象输入
  if (schema == null || typeof schema !== 'object') {
    errors.push('schema 不是一个有效的对象')
    return {
      schema: { type: 'object', properties: {} },
      repairs: [],
      errors,
      repaired: false,
    }
  }

  // 深拷贝，避免修改原始对象
  const result = JSON.parse(JSON.stringify(schema))

  // 1. 修复根节点缺少 type: "object"
  if (result.type !== 'object') {
    if (result.type == null) {
      result.type = 'object'
      repairs.push('根节点缺少 type，已补充为 "object"')
    } else {
      repairs.push(`根节点 type 为 "${result.type}"，已修正为 "object"`)
      result.type = 'object'
    }
  }

  // 2. 修复根节点缺少 properties
  if (result.properties == null) {
    // 如果根节点直接包含字段定义（没有 properties 包裹），尝试提取
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

  // 3. 修复 properties 是数组的情况（包裹为对象）
  if (Array.isArray(result.properties)) {
    result.properties = {}
    repairs.push('properties 为数组，已重置为空对象')
  }

  // 4. 遍历字段进行校验和修复
  for (const [fieldName, fieldValue] of Object.entries(result.properties)) {
    if (fieldValue == null || typeof fieldValue !== 'object') {
      errors.push(`字段 "${fieldName}" 不是有效的对象`)
      continue
    }

    const field = fieldValue as Record<string, any>

    // 4a. 裸数组包裹为 { type: "array" }
    if (Array.isArray(field)) {
      result.properties[fieldName] = { type: 'array', enum: field }
      repairs.push(`字段 "${fieldName}" 为裸数组，已包裹为 { type: "array" }`)
      continue
    }

    // 4b. 确保字段有 type
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

    // 4c. 校验 type 是否合法
    if (typeof field.type === 'string' && !KNOWN_TYPES.has(field.type)) {
      errors.push(
        `字段 "${fieldName}" 的 type "${field.type}" 不是已知类型（${[...KNOWN_TYPES].join(', ')}）`,
      )
    }

    // 4d. 校验 widget 是否合法
    if (field.widget && typeof field.widget === 'string' && !KNOWN_WIDGETS.has(field.widget)) {
      errors.push(
        `字段 "${fieldName}" 的 widget "${field.widget}" 不是已知组件（${[...KNOWN_WIDGETS].join(', ')}）`,
      )
    }

    // 4e. 带选项组件缺少 enum 时提示
    if (
      field.widget &&
      ['radio', 'radioButton', 'checkbox', 'select', 'picker'].includes(field.widget)
    ) {
      if (!field.enum) {
        errors.push(`字段 "${fieldName}" 使用 widget "${field.widget}" 但缺少 enum 选项值`)
      }
    }

    // 4f. enum 和 enumNames 长度不匹配
    if (field.enum && field.enumNames) {
      if (Array.isArray(field.enum) && Array.isArray(field.enumNames)) {
        if (field.enum.length !== field.enumNames.length) {
          errors.push(
            `字段 "${fieldName}" 的 enum (${field.enum.length} 项) 与 enumNames (${field.enumNames.length} 项) 长度不一致`,
          )
        }
      }
    }

    // 4g. 递归校验嵌套 properties
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

    // 4h. displayType 校验
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
