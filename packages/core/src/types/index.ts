// Re-export framework-agnostic types from @v3sf/schema
export type {
  ValueType,
  SchemaBase,
  Schema,
  SchemaRaw,
  FormData,
  Deps,
  Options,
  ErrorMessage,
  ValidatorRule,
  Stringify,
} from '@v3sf/schema'

// Vue-specific types (not in @v3sf/schema)

export interface FormRef {
  getFormData: () => Record<string, any>
  validate: (scrollToError?: boolean) => Promise<{ name: string; error: string[] }[]>
  validateFields: (
    fields: string[],
    scrollToError?: boolean,
  ) => Promise<{ name: string; error: string[] }[]>
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

export interface FieldWidgetAddon<FD extends Record<string, any> = Record<string, any>> {
  schema: import('@v3sf/schema').Schema
  name: string
  rootSchema: import('@v3sf/schema').Schema
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  className?: string
  required?: boolean
  props?: Record<string, any>
  setFormData: (newFormData: Partial<FD>) => void
  getFormData: () => FD
  validate: (scrollToError?: boolean) => Promise<{ name: string; error: string[] }[]>
  validateFields: (
    fields: (keyof FD)[],
    scrollToError?: boolean,
  ) => Promise<{ name: string; error: string[] }[]>
}

export interface ValidatorAdapter {
  validate: (
    value: any,
    rules: import('@v3sf/schema').ValidatorRule[],
    fieldSchema: import('@v3sf/schema').Schema,
  ) => Promise<string[]>
}
