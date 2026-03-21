/**
 * Ant Design compiler target.
 *
 * Compiles v3sf schema → Ant Design Form config:
 * - Form initialValues + form items
 * - Component mapping (widget → Ant Design component)
 * - Rules conversion (v3sf rules → Ant Design rules format)
 * - Expression extraction for dynamic behavior (dependencies + shouldUpdate pattern)
 */

import type { Schema } from '@v3sf/schema'
import type { CompileResult, CompileWarning, ExpressionMapping } from './types'

/** v3sf widget → Ant Design component mapping */
const COMPONENT_MAP: Record<string, string> = {
  input: 'Input',
  textarea: 'Input.TextArea',
  number: 'InputNumber',
  stepper: 'InputNumber',
  switch: 'Switch',
  radio: 'Radio.Group',
  radioButton: 'Radio.Group',
  checkbox: 'Checkbox.Group',
  select: 'Select',
  picker: 'Select',
  cascader: 'Cascader',
  date: 'DatePicker',
}

const EXPR_RE = /^\s*\{\{([\s\S]*)\}\}\s*$/

function isExpression(value: unknown): value is string {
  return typeof value === 'string' && EXPR_RE.test(value)
}

function extractExpr(value: string): string {
  const match = value.match(EXPR_RE)
  return match ? match[1].trim() : value
}

interface AntdFormItemConfig {
  name: string
  label: string
  component: string
  componentProps: Record<string, any>
  rules: any[]
  hidden: boolean | string
  dependencies?: string[]
}

/**
 * Compile a v3sf schema to Ant Design Form configuration.
 */
export function compileToAntd(schema: any): CompileResult {
  const warnings: CompileWarning[] = []
  const expressions: ExpressionMapping[] = []
  const properties: Record<string, Schema> = schema?.properties ?? {}

  const initialValues: Record<string, any> = {}
  const formItems: AntdFormItemConfig[] = []

  for (const [fieldName, fieldSchema] of Object.entries(properties)) {
    if (!fieldSchema || typeof fieldSchema !== 'object') continue
    const field = fieldSchema as Record<string, any>

    // Default value
    initialValues[fieldName] = getDefaultValue(field.type)

    // Map widget → component
    const widget = field.widget ?? field.type ?? 'input'
    const component = COMPONENT_MAP[widget]
    if (!component) {
      warnings.push({
        code: 'UNKNOWN_WIDGET',
        field: fieldName,
        message: `Widget "${widget}" has no Ant Design mapping, falling back to Input`,
        severity: 'warning',
      })
    }

    // Component props
    const componentProps: Record<string, any> = {}
    if (field.placeholder) componentProps.placeholder = field.placeholder
    if (field.disabled === true) componentProps.disabled = true
    if (field.readonly === true) componentProps.readOnly = true
    if (widget === 'radioButton') componentProps.optionType = 'button'
    if (field.props) Object.assign(componentProps, field.props)

    // Enum → options (Ant Design format)
    if (field.enum) {
      componentProps.options = field.enum.map((value: any, i: number) => ({
        label: field.enumNames?.[i] ?? String(value),
        value,
      }))
    }

    // Extract expressions and detect dependencies
    const dependencies: string[] = []
    const hidden = extractDynamic(field, 'hidden', fieldName, expressions, dependencies)
    extractDynamic(field, 'disabled', fieldName, expressions, dependencies)
    extractDynamic(field, 'required', fieldName, expressions, dependencies)

    // Convert rules
    const rules = convertRules(field, fieldName, warnings)

    formItems.push({
      name: fieldName,
      label: field.title ?? fieldName,
      component: component ?? 'Input',
      componentProps,
      rules,
      hidden: hidden as boolean | string,
      ...(dependencies.length > 0 ? { dependencies: [...new Set(dependencies)] } : {}),
    })

    // Nested objects
    if (field.type === 'object' && field.properties) {
      warnings.push({
        code: 'NESTED_OBJECT',
        field: fieldName,
        message: 'Nested objects require Form.List or nested Form.Item in Ant Design',
        severity: 'info',
      })
    }
  }

  const config: Record<string, unknown> = {
    form: {
      initialValues,
      layout: schema?.layout === 'vertical' ? 'vertical' : 'horizontal',
      labelCol: schema?.layout === 'vertical' ? undefined : { span: 6 },
      wrapperCol: schema?.layout === 'vertical' ? undefined : { span: 18 },
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
      return undefined
  }
}

/**
 * Extract dynamic prop expressions and collect dependency field names.
 * Ant Design uses `dependencies` prop on Form.Item + `shouldUpdate` for dynamic behavior.
 */
function extractDynamic(
  field: Record<string, any>,
  prop: string,
  fieldName: string,
  expressions: ExpressionMapping[],
  dependencies: string[],
): boolean | string {
  const value = field[prop]
  if (value === undefined || value === null) return false

  if (isExpression(value)) {
    const source = extractExpr(value)
    // Extract dependency field names from $values.xxx references
    const depMatches = source.matchAll(/\$values\.(\w+)/g)
    for (const match of depMatches) {
      dependencies.push(match[1])
    }

    const compiled = source
      .replace(/\$values\b/g, 'formValues')
      .replace(/\$selfValue\b/g, `formValues.${fieldName}`)

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
    })
  }

  const schemaRules = field.rules ? (Array.isArray(field.rules) ? field.rules : [field.rules]) : []

  for (const rule of schemaRules) {
    if (!rule || typeof rule !== 'object') continue

    const antdRule: Record<string, any> = {}
    let hasRule = false

    if (rule.required) {
      antdRule.required = true
      antdRule.message = rule.message ?? `请输入${field.title ?? fieldName}`
      hasRule = true
    }

    if (rule.pattern) {
      antdRule.pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern
      antdRule.message = rule.message ?? `${field.title ?? fieldName}格式不正确`
      hasRule = true
    }

    if (rule.min != null) {
      antdRule.min = rule.min
      antdRule.message = rule.message ?? `${field.title ?? fieldName}至少${rule.min}个字符`
      hasRule = true
    }

    if (rule.max != null) {
      antdRule.max = rule.max
      antdRule.message = rule.message ?? `${field.title ?? fieldName}不能超过${rule.max}个字符`
      hasRule = true
    }

    if (rule.len != null) {
      antdRule.len = rule.len
      antdRule.message = rule.message ?? `${field.title ?? fieldName}长度应为${rule.len}`
      hasRule = true
    }

    if (rule.type) {
      antdRule.type = rule.type
      hasRule = true
    }

    if (rule.custom) {
      warnings.push({
        code: 'CUSTOM_RULE',
        field: fieldName,
        message: 'Custom validation functions cannot be serialized to Ant Design config',
        severity: 'warning',
      })
    }

    if (hasRule) result.push(antdRule)
  }

  return result
}
