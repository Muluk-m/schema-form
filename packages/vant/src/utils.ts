import type { Schema, Options } from '@v3sf/core'

/**
 * Build options list from schema enum/enumNames or explicit options prop.
 */
export function getWidgetOptionsBySchema(schema: Schema, options: Options[]): Options[] {
  if (options && options.length > 0) {
    return options
  }

  if (schema.enum && schema.enum.length > 0) {
    const labels = schema.enumNames || schema.enum
    return schema.enum.map((value, index) => ({
      label: String(labels[index]),
      value,
      props: {},
    }))
  }

  return []
}
