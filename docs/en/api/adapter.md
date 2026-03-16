# Adapter API

API reference for the adapter system, including `defineAdapter`, `defineWidget`, and related types.

## WidgetAdapter

The core interface for an adapter.

```ts
interface WidgetAdapter {
  widgets: Record<string, WidgetDefinition | Component>
  globalPropsMap?: Record<string, string>
}
```

| Property         | Type                                            | Description                                                    |
| ---------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| `widgets`        | `Record<string, WidgetDefinition \| Component>` | Map of widget names to their definitions or raw Vue components |
| `globalPropsMap` | `Record<string, string>`                        | Prop name mappings applied to all widgets                      |

## WidgetDefinition

Defines a single widget with an optional prop mapping.

```ts
interface WidgetDefinition {
  component: Component
  propsMap?: Record<string, string>
}
```

| Property    | Type                     | Description                                                                                   |
| ----------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| `component` | `Component`              | The Vue component to render                                                                   |
| `propsMap`  | `Record<string, string>` | Maps v3sf standard props to this component's actual prop names. Merged with `globalPropsMap`. |

## defineAdapter()

Type-helper function for creating an adapter with full TypeScript inference.

```ts
function defineAdapter(config: WidgetAdapter): WidgetAdapter
```

### Usage

```ts
import { defineAdapter } from '@v3sf/core'

const myAdapter = defineAdapter({
  widgets: {
    input: { component: MyInput },
    select: { component: MySelect, propsMap: { modelValue: 'value' } },
    switch: MySwitch, // Shorthand: pass component directly
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})
```

## defineWidget()

Type-helper function for creating a widget definition.

```ts
function defineWidget(definition: WidgetDefinition & { name?: string }): WidgetDefinition
```

### Usage

```ts
import { defineWidget } from '@v3sf/core'
import MyDateRange from './MyDateRange.vue'

const dateRangeWidget = defineWidget({
  component: MyDateRange,
  propsMap: {
    modelValue: 'value',
    disabled: 'isDisabled',
  },
})
```

The optional `name` property is stripped from the output; it exists only for documentation purposes.

## createSchemaForm()

Creates a SchemaForm Vue component bound to a specific adapter.

```ts
function createSchemaForm(adapter: WidgetAdapter): Component
```

### Usage

```ts
import { createSchemaForm } from '@v3sf/core'

const SchemaForm = createSchemaForm(myAdapter)
```

## WidgetStandardProps

The standard props that v3sf passes to every widget component.

```ts
interface WidgetStandardProps {
  modelValue: any
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  error?: string
  addon?: FieldWidgetAddon
}
```

| Prop          | Type               | Description                                    |
| ------------- | ------------------ | ---------------------------------------------- |
| `modelValue`  | `any`              | Current field value                            |
| `disabled`    | `boolean`          | Whether the field is disabled                  |
| `readonly`    | `boolean`          | Whether the field is read-only                 |
| `placeholder` | `string`           | Placeholder text                               |
| `error`       | `string`           | Current validation error message (first error) |
| `addon`       | `FieldWidgetAddon` | Form context object                            |

## FieldWidgetAddon

Context object available to widgets via the `addon` prop or the `useAddon()` hook.

```ts
interface FieldWidgetAddon<FD extends FormData = FormData> {
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
```

| Property                                 | Type                                              | Description                         |
| ---------------------------------------- | ------------------------------------------------- | ----------------------------------- |
| `schema`                                 | `Schema`                                          | The current field's resolved schema |
| `name`                                   | `string`                                          | Field name (key in `properties`)    |
| `rootSchema`                             | `Schema`                                          | The root schema object              |
| `disabled`                               | `boolean`                                         | Resolved disabled state             |
| `readonly`                               | `boolean`                                         | Resolved read-only state            |
| `placeholder`                            | `string`                                          | Placeholder text                    |
| `className`                              | `string`                                          | Custom CSS class                    |
| `required`                               | `boolean`                                         | Whether the field is required       |
| `props`                                  | `Record<string, any>`                             | Merged pass-through props           |
| `setFormData(data)`                      | `(Partial<FD>) => void`                           | Merge new values into form data     |
| `getFormData()`                          | `() => FD`                                        | Get the full form data object       |
| `validate(scrollToError?)`               | `(boolean?) => Promise<ErrorMessage[]>`           | Validate all fields                 |
| `validateFields(fields, scrollToError?)` | `(string[], boolean?) => Promise<ErrorMessage[]>` | Validate specific fields            |

## useAddon()

Hook to access the `FieldWidgetAddon` inside a custom widget component.

```ts
import { useAddon } from '@v3sf/core'

const addon = useAddon()
// addon.value.schema, addon.value.name, addon.value.getFormData(), etc.
```

Returns a `Ref<FieldWidgetAddon>`.

## Prop Resolution Order

When v3sf renders a widget, props are resolved in this order:

1. Standard props (`modelValue`, `disabled`, `readonly`, `placeholder`, `error`, `addon`)
2. Schema `props` are merged in
3. `globalPropsMap` renames are applied
4. Per-widget `propsMap` renames are applied (overrides `globalPropsMap`)

## Widget Resolution Order

When a field needs to be rendered:

1. If `widget` is specified in the schema, look up `adapter.widgets[widget]`
2. If not found or not specified, map `type` to a default widget name:
   - `string` -> `input`
   - `number` -> `number`
   - `boolean` -> `switch`
   - `array` -> `checkbox`
   - `date` -> `date`
3. Look up the mapped name in `adapter.widgets`
