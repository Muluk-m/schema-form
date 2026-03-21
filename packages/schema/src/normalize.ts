/**
 * Schema normalization — standardize raw input with defaults and shorthand expansion.
 */

import type { Schema } from './types'
import { WIDGET_TYPE_MAP } from './widgets'

/**
 * Normalize a raw schema input: fill defaults, expand shorthands.
 *
 * - Ensures root has `type: "object"` and `properties`
 * - Infers missing field types from widget names
 * - Fills default widget based on type if not specified
 */
export function normalizeSchema(raw: any): { type: 'object'; properties: Record<string, Schema> } {
  if (raw == null || typeof raw !== 'object') {
    return { type: 'object', properties: {} }
  }

  const schema = JSON.parse(JSON.stringify(raw))
  if (!schema.type) schema.type = 'object'
  if (!schema.properties) schema.properties = {}

  const defaultWidgets: Record<string, string> = {
    string: 'input',
    number: 'number',
    boolean: 'switch',
    array: 'checkbox',
    date: 'date',
  }

  for (const [, field] of Object.entries(schema.properties)) {
    if (field == null || typeof field !== 'object' || Array.isArray(field)) continue
    const f = field as Record<string, any>

    // Infer type from widget
    if (!f.type && f.widget && WIDGET_TYPE_MAP[f.widget]) {
      f.type = WIDGET_TYPE_MAP[f.widget]
    }

    // Default type
    if (!f.type) f.type = 'string'

    // Default widget from type
    if (!f.widget && defaultWidgets[f.type]) {
      f.widget = defaultWidgets[f.type]
    }

    // Normalize nested
    if (f.type === 'object' && f.properties) {
      const nested = normalizeSchema(f)
      f.properties = nested.properties
    }
  }

  return schema
}
