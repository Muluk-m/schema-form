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

export interface FormRef {
  getFormData: () => FormData
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>
  validateFields: (fields: string[], scrollToError?: boolean) => Promise<ErrorMessage[]>
}

export interface WidgetStandardProps {
  modelValue: any
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  error?: string
  addon?: FieldWidgetAddon
}

export interface WidgetDefinition {
  component: any
  propsMap?: Record<string, string>
}

export interface WidgetAdapter {
  widgets: Record<string, WidgetDefinition | any>
  globalPropsMap?: Record<string, string>
}

export interface FieldWidgetAddon<FD extends FormData = FormData> {
  schema: Schema
  name: string
  rootSchema: Schema
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  className?: string
  required?: boolean
  props?: Record<string, any>
  setFormData: (newFormData: Partial<FD>) => void
  getFormData: () => FD
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>
  validateFields: (fields: (keyof FD)[], scrollToError?: boolean) => Promise<ErrorMessage[]>
}

export interface ValidatorRule {
  required?: boolean
  pattern?: RegExp | string
  min?: number
  max?: number
  len?: number
  type?: string
  message?: string
  custom?: (value: any, formData: FormData) => string | true
}

export interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
