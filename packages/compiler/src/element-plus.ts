/**
 * Element Plus compiler target.
 *
 * Compiles v3sf schema → Element Plus form config:
 * - el-form model + rules
 * - el-form-item configs (label, prop, required)
 * - Component mapping (widget → el-component)
 * - Validation rule conversion
 * - Expression extraction for dynamic behavior
 */

import type { Schema } from '@v3sf/schema'
import type { CompileResult, CompileWarning, ExpressionMapping } from './types'

/** v3sf widget → Element Plus component mapping */
const COMPONENT_MAP: Record<string, string> = {
  input: 'el-input',
  textarea: 'el-input', // with type="textarea"
  number: 'el-input-number',
  stepper: 'el-input-number',
  switch: 'el-switch',
  radio: 'el-radio-group',
  radioButton: 'el-radio-group', // with button children
  checkbox: 'el-checkbox-group',
  select: 'el-select',
  picker: 'el-select',
  cascader: 'el-cascader',
  date: 'el-date-picker',
}

/** Expression pattern: {{ ... }} */
const EXPR_RE = /^\s*\{\{([\s\S]*)\}\}\s*$/

function isExpression(value: unknown): value is string {
  return typeof value === 'string' && EXPR_RE.test(value)
}

function extractExpr(value: string): string {
  const match = value.match(EXPR_RE)
  return match ? match[1].trim() : value
}

interface ElFormItemConfig {
  prop: string
  label: string
  required: boolean | string
  component: string
  componentProps: Record<string, any>
  rules: any[]
  hidden: boolean | string
  disabled: boolean | string
}

/**
 * Compile a v3sf schema to Element Plus form configuration.
 */
export function compileToElementPlus(schema: any): CompileResult {
  const warnings: CompileWarning[] = []
  const expressions: ExpressionMapping[] = []
  const properties: Record<string, Schema> = schema?.properties ?? {}

  const model: Record<string, any> = {}
  const rules: Record<string, any[]> = {}
  const formItems: ElFormItemConfig[] = []

  for (const [fieldName, fieldSchema] of Object.entries(properties)) {
    if (!fieldSchema || typeof fieldSchema !== 'object') continue
    const field = fieldSchema as Record<string, any>

    // Build default model value
    model[fieldName] = getDefaultValue(field.type)

    // Map widget → component
    const widget = field.widget ?? field.type ?? 'input'
    const component = COMPONENT_MAP[widget]
    if (!component) {
      warnings.push({
        code: 'UNKNOWN_WIDGET',
        field: fieldName,
        message: `Widget "${widget}" has no Element Plus mapping, falling back to el-input`,
        severity: 'warning',
      })
    }

    // Build component props
    const componentProps: Record<string, any> = {}
    if (widget === 'textarea') {
      componentProps.type = 'textarea'
    }
    if (widget === 'radioButton') {
      componentProps._buttonStyle = true
    }
    if (field.placeholder) {
      componentProps.placeholder = field.placeholder
    }
    if (field.props) {
      Object.assign(componentProps, field.props)
    }

    // Handle enum options (for select, radio, checkbox)
    if (field.enum) {
      componentProps.options = field.enum.map((value: any, i: number) => ({
        label: field.enumNames?.[i] ?? value,
        value,
      }))
    }

    // Extract expressions for dynamic props
    const hidden = extractDynamicProp(field, 'hidden', fieldName, expressions)
    const disabled = extractDynamicProp(field, 'disabled', fieldName, expressions)
    const required = extractDynamicProp(field, 'required', fieldName, expressions)

    // Convert validation rules
    const fieldRules = convertRules(field, fieldName, warnings)
    if (fieldRules.length > 0) {
      rules[fieldName] = fieldRules
    }

    formItems.push({
      prop: fieldName,
      label: field.title ?? fieldName,
      required: required as boolean | string,
      component: component ?? 'el-input',
      componentProps,
      rules: fieldRules,
      hidden: hidden as boolean | string,
      disabled: disabled as boolean | string,
    })

    // Handle nested objects
    if (field.type === 'object' && field.properties) {
      warnings.push({
        code: 'NESTED_OBJECT',
        field: fieldName,
        message: 'Nested object fields require manual sub-form implementation in Element Plus',
        severity: 'info',
      })
    }
  }

  const config: Record<string, unknown> = {
    form: {
      model,
      rules,
      labelWidth: schema?.labelWidth ?? '100px',
      labelPosition: schema?.layout === 'vertical' ? 'top' : 'right',
    },
    formItems,
  }

  return {
    success: warnings.filter((w) => w.severity === 'error').length === 0,
    config,
    warnings,
    expressions,
  }
}

function getDefaultValue(type?: string): any {
  switch (type) {
    case 'number':
      return undefined
    case 'boolean':
      return false
    case 'array':
      return []
    case 'date':
      return undefined
    case 'object':
      return {}
    default:
      return ''
  }
}

function extractDynamicProp(
  field: Record<string, any>,
  prop: string,
  fieldName: string,
  expressions: ExpressionMapping[],
): boolean | string {
  const value = field[prop]
  if (value === undefined || value === null) return false

  if (isExpression(value)) {
    const source = extractExpr(value)
    // Convert v3sf expression context to Element Plus reactive data context
    // $values.x → formData.x (user needs to wire this up)
    const compiled = source
      .replace(/\$values\b/g, 'formData')
      .replace(/\$selfValue\b/g, `formData.${fieldName}`)

    expressions.push({ field: fieldName, prop, source, compiled })
    return `{{ ${compiled} }}`
  }

  return !!value
}

function convertRules(
  field: Record<string, any>,
  fieldName: string,
  warnings: CompileWarning[],
): any[] {
  const result: any[] = []

  // Schema-level required
  if (field.required === true) {
    result.push({
      required: true,
      message: `请输入${field.title ?? fieldName}`,
      trigger: field.widget === 'select' || field.widget === 'radio' ? 'change' : 'blur',
    })
  }

  // Schema-level rules
  const schemaRules = field.rules ? (Array.isArray(field.rules) ? field.rules : [field.rules]) : []

  for (const rule of schemaRules) {
    if (!rule || typeof rule !== 'object') continue

    const elRule: Record<string, any> = {}
    let hasRule = false

    if (rule.required) {
      elRule.required = true
      elRule.message = rule.message ?? `请输入${field.title ?? fieldName}`
      elRule.trigger = 'blur'
      hasRule = true
    }

    if (rule.pattern) {
      elRule.pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern
      elRule.message = rule.message ?? `${field.title ?? fieldName}格式不正确`
      elRule.trigger = 'blur'
      hasRule = true
    }

    if (rule.min != null) {
      elRule.min = rule.min
      elRule.message = rule.message ?? `${field.title ?? fieldName}至少${rule.min}个字符`
      elRule.trigger = 'blur'
      hasRule = true
    }

    if (rule.max != null) {
      elRule.max = rule.max
      elRule.message = rule.message ?? `${field.title ?? fieldName}不能超过${rule.max}个字符`
      elRule.trigger = 'blur'
      hasRule = true
    }

    if (rule.len != null) {
      elRule.len = rule.len
      elRule.message = rule.message ?? `${field.title ?? fieldName}长度应为${rule.len}`
      elRule.trigger = 'blur'
      hasRule = true
    }

    if (rule.custom) {
      warnings.push({
        code: 'CUSTOM_RULE',
        field: fieldName,
        message: 'Custom validation functions cannot be serialized to Element Plus config',
        severity: 'warning',
      })
    }

    if (hasRule) {
      result.push(elRule)
    }
  }

  return result
}
