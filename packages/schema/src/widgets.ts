/**
 * Widget registry — single source of truth for all known widgets.
 *
 * Used by schema validation, AI prompts, and compiler targets.
 * When adding a new widget, only this file needs to change.
 */

/** All known widget names across all adapters */
export const KNOWN_WIDGETS = new Set([
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

/** Valid field value types */
export const KNOWN_TYPES = new Set(['string', 'number', 'boolean', 'array', 'date', 'object'])

/** Widget → inferred type mapping */
export const WIDGET_TYPE_MAP: Record<string, string> = {
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

/** Widgets that require enum options */
export const ENUM_WIDGETS = new Set(['radio', 'radioButton', 'checkbox', 'select', 'picker'])
