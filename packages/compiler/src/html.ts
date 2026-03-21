/**
 * HTML compiler target — pure HTML5 form output (no framework, no linkage).
 * Serves as a fallback / lowest common denominator.
 */

import type { CompileResult, CompileWarning } from './types'
import type { Schema } from '@v3sf/schema'

const INPUT_TYPE_MAP: Record<string, string> = {
  input: 'text',
  textarea: 'textarea',
  number: 'number',
  stepper: 'number',
  date: 'date',
  switch: 'checkbox',
}

/**
 * Compile a v3sf schema to plain HTML5 form config.
 */
export function compileToHtml(schema: any): CompileResult {
  const warnings: CompileWarning[] = []
  const properties: Record<string, Schema> = schema?.properties ?? {}

  const fields: Array<{
    name: string
    label: string
    type: string
    tag: string
    required: boolean
    placeholder: string
    attributes: Record<string, string>
    options?: Array<{ label: string; value: string | number }>
  }> = []

  for (const [fieldName, fieldSchema] of Object.entries(properties)) {
    if (!fieldSchema || typeof fieldSchema !== 'object') continue
    const field = fieldSchema as Record<string, any>

    const widget = field.widget ?? field.type ?? 'input'
    const attributes: Record<string, string> = {}

    // Determine HTML tag and type
    let tag = 'input'
    let inputType = INPUT_TYPE_MAP[widget] ?? 'text'

    if (widget === 'textarea') {
      tag = 'textarea'
      inputType = ''
    } else if (['select', 'picker'].includes(widget)) {
      tag = 'select'
      inputType = ''
    } else if (['radio', 'radioButton'].includes(widget)) {
      tag = 'radio-group'
      inputType = 'radio'
    } else if (widget === 'checkbox') {
      tag = 'checkbox-group'
      inputType = 'checkbox'
    }

    if (inputType) attributes.type = inputType
    if (field.placeholder) attributes.placeholder = field.placeholder
    if (field.required === true) attributes.required = 'required'
    if (field.disabled === true) attributes.disabled = 'disabled'
    if (field.readonly === true) attributes.readonly = 'readonly'

    // Min/max from rules
    const rules = field.rules ? (Array.isArray(field.rules) ? field.rules : [field.rules]) : []
    for (const rule of rules) {
      if (rule.min != null) attributes.minlength = String(rule.min)
      if (rule.max != null) attributes.maxlength = String(rule.max)
      if (rule.pattern) attributes.pattern = String(rule.pattern)
    }

    // Expression props become warnings (HTML can't do dynamic behavior)
    for (const prop of ['hidden', 'disabled', 'required']) {
      if (typeof field[prop] === 'string' && field[prop].includes('{{')) {
        warnings.push({
          code: 'EXPRESSION_UNSUPPORTED',
          field: fieldName,
          message: `Expression on "${prop}" is not supported in HTML output`,
          severity: 'info',
        })
      }
    }

    const entry: (typeof fields)[0] = {
      name: fieldName,
      label: field.title ?? fieldName,
      type: inputType,
      tag,
      required: field.required === true,
      placeholder: field.placeholder ?? '',
      attributes,
    }

    if (field.enum) {
      entry.options = field.enum.map((value: any, i: number) => ({
        label: field.enumNames?.[i] ?? value,
        value,
      }))
    }

    fields.push(entry)
  }

  return {
    success: true,
    config: { fields },
    warnings,
    expressions: [],
  }
}
