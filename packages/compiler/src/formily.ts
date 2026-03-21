/**
 * Formily compiler target (LIMITED SUBSET).
 *
 * Only compiles:
 * - Static field mapping: widget → x-component, rules → x-validator
 * - Simple hidden/disabled expressions based on value comparisons
 *
 * Does NOT attempt full x-reactions fulfill/when/target/state mapping
 * (that's a research problem, not an engineering problem).
 */

import type { Schema } from '@v3sf/schema'
import type { CompileResult, CompileWarning, ExpressionMapping } from './types'

/** v3sf widget → Formily x-component mapping */
const COMPONENT_MAP: Record<string, string> = {
  input: 'Input',
  textarea: 'Input.TextArea',
  number: 'NumberPicker',
  stepper: 'NumberPicker',
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

/**
 * Check if an expression is "simple" enough for Formily x-reactions.
 * Simple = only involves $values.field comparisons with constants.
 */
function isSimpleExpression(expr: string): boolean {
  // Allow: $values.xxx, comparisons (===, !==, ==, !=, <, >, <=, >=),
  // logical (&&, ||, !), literals (true, false, strings, numbers)
  const simplified = expr
    .replace(/\$values\.\w+/g, '')
    .replace(/\$selfValue/g, '')
    .replace(/[!&|=<>?:]+/g, '')
    .replace(/true|false|null|undefined/g, '')
    .replace(/'[^']*'|"[^"]*"/g, '')
    .replace(/\d+\.?\d*/g, '')
    .replace(/\s+/g, '')
    .replace(/[()]/g, '')

  // If anything is left after removing known patterns, it's too complex
  return simplified.length === 0
}

/**
 * Compile a v3sf schema to Formily JSON Schema format.
 */
export function compileToFormily(schema: any): CompileResult {
  const warnings: CompileWarning[] = []
  const expressions: ExpressionMapping[] = []
  const properties: Record<string, Schema> = schema?.properties ?? {}

  const formilyProperties: Record<string, any> = {}

  for (const [fieldName, fieldSchema] of Object.entries(properties)) {
    if (!fieldSchema || typeof fieldSchema !== 'object') continue
    const field = fieldSchema as Record<string, any>

    // Map widget → x-component
    const widget = field.widget ?? field.type ?? 'input'
    const xComponent = COMPONENT_MAP[widget]
    if (!xComponent) {
      warnings.push({
        code: 'UNKNOWN_WIDGET',
        field: fieldName,
        message: `Widget "${widget}" has no Formily mapping, falling back to Input`,
        severity: 'warning',
      })
    }

    const formilyField: Record<string, any> = {
      type: mapType(field.type),
      title: field.title ?? fieldName,
      'x-component': xComponent ?? 'Input',
      'x-decorator': 'FormItem',
    }

    // Component props
    const componentProps: Record<string, any> = {}
    if (field.placeholder) componentProps.placeholder = field.placeholder
    if (field.props) Object.assign(componentProps, field.props)
    if (widget === 'radioButton') componentProps.optionType = 'button'
    if (Object.keys(componentProps).length > 0) {
      formilyField['x-component-props'] = componentProps
    }

    // Enum → enum/enumNames (Formily supports these natively)
    if (field.enum) {
      formilyField.enum = field.enum.map((value: any, i: number) => ({
        label: field.enumNames?.[i] ?? String(value),
        value,
      }))
    }

    // Required
    if (field.required === true) {
      formilyField.required = true
    }

    // Validation rules → x-validator
    const validators = convertValidators(field, fieldName, warnings)
    if (validators.length > 0) {
      formilyField['x-validator'] = validators
    }

    // Expressions → x-reactions (limited subset)
    const reactions = buildReactions(field, fieldName, expressions, warnings)
    if (reactions.length > 0) {
      formilyField['x-reactions'] = reactions
    }

    // Nested objects
    if (field.type === 'object' && field.properties) {
      const nested = compileToFormily({ type: 'object', properties: field.properties })
      formilyField.properties = (nested.config as any).properties
      for (const w of nested.warnings) {
        warnings.push({ ...w, field: `${fieldName}.${w.field}` })
      }
      for (const e of nested.expressions) {
        expressions.push({ ...e, field: `${fieldName}.${e.field}` })
      }
    }

    formilyProperties[fieldName] = formilyField
  }

  const config: Record<string, unknown> = {
    type: 'object',
    properties: formilyProperties,
  }

  return {
    success: warnings.filter((w) => w.severity === 'error').length === 0,
    config,
    warnings,
    expressions,
  }
}

function mapType(v3sfType?: string): string {
  switch (v3sfType) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return 'array'
    case 'date':
      return 'string' // Formily uses string for dates
    case 'object':
      return 'object'
    default:
      return 'string'
  }
}

function buildReactions(
  field: Record<string, any>,
  fieldName: string,
  expressions: ExpressionMapping[],
  warnings: CompileWarning[],
): any[] {
  const reactions: any[] = []

  for (const prop of ['hidden', 'disabled'] as const) {
    const value = field[prop]
    if (!isExpression(value)) continue

    const source = extractExpr(value)

    if (!isSimpleExpression(source)) {
      warnings.push({
        code: 'COMPLEX_EXPRESSION',
        field: fieldName,
        message: `Expression "${source}" is too complex for Formily x-reactions; only simple $values.field comparisons are supported`,
        severity: 'warning',
      })
      expressions.push({ field: fieldName, prop, source, compiled: `/* unsupported: ${source} */` })
      continue
    }

    // Convert to Formily x-reactions format
    // $values.xxx → $form.values.xxx
    const formilyExpr = source
      .replace(/\$values\b/g, '$form.values')
      .replace(/\$selfValue\b/g, '$self.value')

    const stateField = prop === 'hidden' ? 'display' : 'pattern'
    const stateTrue = prop === 'hidden' ? 'none' : 'disabled'
    const stateFalse = prop === 'hidden' ? 'visible' : 'editable'

    reactions.push({
      fulfill: {
        state: {
          [stateField]: `{{${formilyExpr} ? "${stateTrue}" : "${stateFalse}"}}`,
        },
      },
    })

    expressions.push({ field: fieldName, prop, source, compiled: formilyExpr })
  }

  // Required expressions — Formily handles differently
  if (isExpression(field.required)) {
    const source = extractExpr(field.required)
    if (isSimpleExpression(source)) {
      const formilyExpr = source.replace(/\$values\b/g, '$form.values')
      reactions.push({
        fulfill: {
          state: {
            required: `{{${formilyExpr}}}`,
          },
        },
      })
      expressions.push({ field: fieldName, prop: 'required', source, compiled: formilyExpr })
    } else {
      warnings.push({
        code: 'COMPLEX_EXPRESSION',
        field: fieldName,
        message: `Required expression "${source}" is too complex for Formily`,
        severity: 'warning',
      })
    }
  }

  return reactions
}

function convertValidators(
  field: Record<string, any>,
  fieldName: string,
  warnings: CompileWarning[],
): any[] {
  const validators: any[] = []

  const schemaRules = field.rules ? (Array.isArray(field.rules) ? field.rules : [field.rules]) : []

  for (const rule of schemaRules) {
    if (!rule || typeof rule !== 'object') continue

    if (rule.required) {
      validators.push({ required: true, message: rule.message })
    }
    if (rule.pattern) {
      validators.push({
        pattern: typeof rule.pattern === 'string' ? rule.pattern : rule.pattern.source,
        message: rule.message,
      })
    }
    if (rule.min != null) {
      validators.push({ min: rule.min, message: rule.message })
    }
    if (rule.max != null) {
      validators.push({ max: rule.max, message: rule.message })
    }
    if (rule.len != null) {
      validators.push({ len: rule.len, message: rule.message })
    }
    if (rule.custom) {
      warnings.push({
        code: 'CUSTOM_RULE',
        field: fieldName,
        message: 'Custom validators cannot be serialized to Formily config',
        severity: 'warning',
      })
    }
  }

  return validators
}
