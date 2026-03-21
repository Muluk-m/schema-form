/**
 * Framework-agnostic schema type definitions.
 *
 * These types define the v3sf schema format without any Vue/React coupling.
 * Vue-specific types (FieldWidgetAddon, FormRef, etc.) remain in @v3sf/core.
 */

export type ValueType =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'boolean'
  | 'date'
  | (string & {})

export type Stringify<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? Stringify<T[K]> : T[K] | `{{${string}}}`
}

export interface ValidatorRule {
  required?: boolean
  pattern?: RegExp | string
  min?: number
  max?: number
  len?: number
  type?: string
  message?: string
  custom?: (value: any, formData: Record<string, any>) => string | true
}

export interface SchemaBase {
  type: ValueType
  title: string
  required: boolean
  placeholder: string
  disabled: boolean
  readonly: boolean
  hidden: boolean
  displayType: 'row' | 'column'
  className: string
  widget: string
  properties: Record<string, Schema>
  enum: Array<string | number>
  enumNames: Array<string | number>
  rules: ValidatorRule | ValidatorRule[]
  props: Record<string, any>
  border: boolean
}

export type Schema = Partial<SchemaBase>
export type SchemaRaw = Stringify<SchemaBase>

export type FormData = Record<string, any>
export type Deps = Record<string, any>

export interface Options {
  label: string
  value: string | number
  props?: Record<string, any>
}

export interface ErrorMessage {
  name: string
  error: string[]
}
