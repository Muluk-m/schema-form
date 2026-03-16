import {
  defineComponent,
  computed,
  watch,
  ref,
  provide,
  toRef,
  type PropType,
  type Component,
} from 'vue'
import type {
  SchemaRaw,
  FormData,
  Deps,
  ErrorMessage,
  WidgetAdapter,
  ValidatorAdapter,
  Schema,
} from '../types'
import { FORM_KEY } from '../constants'
import { createNamespace, isJsonSchema, pick } from '../utils'
import { resolveValue, isExpression } from '../expression'
import { validateField, validateAllFields } from '../validator'
import Field from './Field'

const [name] = createNamespace('schema-form')

function resolveSchema(schema: SchemaRaw, formData: FormData, deps: Deps): Schema {
  if (!isJsonSchema(schema)) return schema as Schema

  const { properties = {}, ...rest } = schema
  const resolvedProperties: Record<string, Schema> = {}

  for (const [field, property] of Object.entries(properties)) {
    if (!property) continue
    resolvedProperties[field] = resolvePropertySegments(property, formData[field], formData, deps)
  }

  return { ...rest, properties: resolvedProperties } as Schema
}

function resolvePropertySegments(
  property: any,
  selfValue: unknown,
  formData: FormData,
  deps: Deps,
): Schema {
  if (!property || typeof property !== 'object') return property

  const resolved: Record<string, any> = {}

  for (const [key, val] of Object.entries(property)) {
    if (Array.isArray(val)) {
      resolved[key] = val
    } else if (val !== null && typeof val === 'object') {
      resolved[key] = resolvePropertySegments(val, selfValue, formData, deps)
    } else if (isExpression(val)) {
      resolved[key] = resolveValue(val, selfValue, formData, deps)
    } else {
      resolved[key] = val
    }
  }

  return resolved as Schema
}

export function createSchemaForm(adapter: WidgetAdapter): Component {
  return defineComponent({
    name,

    props: {
      schema: { type: Object as PropType<SchemaRaw>, default: () => ({}) },
      modelValue: { type: Object as PropType<FormData>, default: () => ({}) },
      deps: { type: Object as PropType<Deps>, default: () => ({}) },
      readonly: Boolean,
      disabled: Boolean,
      removeHiddenData: Boolean,
      debug: Boolean,
      displayType: { type: String as PropType<'row' | 'column'>, default: 'row' },
      border: { type: Boolean, default: true },
      inlineErrorMessage: Boolean,
      validator: { type: Object as PropType<ValidatorAdapter>, default: undefined },
    },

    emits: ['update:modelValue'],

    setup(props, { emit, expose }) {
      const errorFields = ref<Record<string, string>>({})

      const formData = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
      })

      const resolvedSchema = computed(() => resolveSchema(props.schema, formData.value, props.deps))

      const visibleFields = computed(() => {
        const properties = resolvedSchema.value.properties ?? {}
        return Object.entries(properties).filter(([__key, schema]) => !schema.hidden)
      })

      // Provide form context
      provide(FORM_KEY, {
        formData: formData as any,
        rootSchema: resolvedSchema as any,
        disabled: toRef(props, 'disabled') as any,
        readonly: toRef(props, 'readonly') as any,
        border: toRef(props, 'border') as any,
        displayType: toRef(props, 'displayType') as any,
      })

      const getFormData = (): FormData => {
        if (props.removeHiddenData) {
          const visibleNames = visibleFields.value.map(([name]) => name)
          return Object.fromEntries(
            Object.entries(formData.value).filter(([key]) => visibleNames.includes(key)),
          )
        }
        return formData.value
      }

      const setFormData = (values: Partial<FormData>) => {
        formData.value = { ...formData.value, ...values }
      }

      const scrollToField = (fieldName: string) => {
        const el = document.querySelector(`[data-field="${fieldName}"]`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      const validate = async (scrollToError = true): Promise<ErrorMessage[]> => {
        const data = getFormData()
        const errors = await validateAllFields(
          data,
          resolvedSchema.value.properties,
          props.validator,
        )

        if (scrollToError && errors.length) {
          scrollToField(errors[0].name)
        }

        if (!props.inlineErrorMessage) {
          if (errors.length) {
            errorFields.value = errors.reduce(
              (acc, { name, error }) => ({ ...acc, [name]: error[0] }),
              {} as Record<string, string>,
            )
          } else {
            errorFields.value = {}
          }
        }

        return errors
      }

      const validateFields = async (
        fields: string[],
        scrollToError = true,
      ): Promise<ErrorMessage[]> => {
        const data = getFormData()
        const errors: ErrorMessage[] = []

        for (const fieldName of fields) {
          const schema = resolvedSchema.value.properties?.[fieldName]
          if (!schema) continue

          const fieldErrors = await validateField(
            data[fieldName],
            schema,
            fieldName,
            data,
            props.validator,
          )

          if (fieldErrors.length) {
            errors.push({ name: fieldName, error: fieldErrors })

            if (!props.inlineErrorMessage) {
              errorFields.value = {
                ...errorFields.value,
                [fieldName]: fieldErrors[0],
              }
            }

            if (scrollToError && errors.length === 1) {
              scrollToField(fieldName)
            }
          } else if (!props.inlineErrorMessage) {
            const { [fieldName]: __removed, ...rest } = errorFields.value
            errorFields.value = rest
          }
        }

        return errors
      }

      // Re-validate error fields on formData change
      watch(
        () => props.modelValue,
        () => {
          const errorKeys = Object.keys(errorFields.value)
          if (errorKeys.length > 0) {
            for (const key of errorKeys) {
              const schema = resolvedSchema.value.properties?.[key]
              if (schema) {
                validateField(
                  formData.value[key],
                  schema,
                  key,
                  formData.value,
                  props.validator,
                ).then((fieldErrors) => {
                  if (fieldErrors.length) {
                    errorFields.value = { ...errorFields.value, [key]: fieldErrors[0] }
                  } else {
                    const { [key]: __removed, ...rest } = errorFields.value
                    errorFields.value = rest
                  }
                })
              }
            }
          }

          if (props.debug && process.env.NODE_ENV !== 'production') {
            console.group('[v3sf] FormData Changed')
            console.log('Data:', formData.value)
            console.log('Schema:', resolvedSchema.value)
            console.groupEnd()
          }
        },
        { deep: true },
      )

      expose({ getFormData, validate, validateFields })

      return () => (
        <div class={name}>
          {visibleFields.value.map(([fieldName, fieldSchema]) => {
            const fieldState = {
              border: fieldSchema.border ?? props.border,
              disabled: fieldSchema.disabled ?? props.disabled,
              readonly: fieldSchema.readonly ?? props.readonly,
              displayType: fieldSchema.displayType ?? props.displayType,
              placeholder: fieldSchema.placeholder,
              className: fieldSchema.className,
              required: !!fieldSchema.required,
            }

            const addon = {
              name: fieldName,
              schema: fieldSchema,
              rootSchema: resolvedSchema.value,
              ...fieldState,
              props: {
                ...pick(fieldState, ['readonly', 'disabled', 'placeholder']),
                ...(fieldSchema.props ?? {}),
              },
              setFormData,
              getFormData,
              validate,
              validateFields,
            }

            return (
              <Field
                key={fieldName}
                name={fieldName}
                addon={addon}
                adapter={adapter}
                formData={formData.value}
                errorMessage={errorFields.value[fieldName] ?? ''}
                displayType={fieldState.displayType}
                border={fieldState.border}
                onUpdateValue={(val: any) => {
                  formData.value = { ...formData.value, [fieldName]: val }
                }}
              />
            )
          })}
        </div>
      )
    },
  })
}
