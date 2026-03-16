# Component Props

API reference for the `SchemaForm` component props.

## SchemaForm Props

The component returned by `createSchemaForm(adapter)` accepts the following props:

| Prop                 | Type                  | Default     | Description                                                                                     |
| -------------------- | --------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `modelValue`         | `FormData`            | `{}`        | Form data object (two-way binding via `v-model`)                                                |
| `schema`             | `SchemaRaw`           | `{}`        | The form schema definition                                                                      |
| `deps`               | `Record<string, any>` | `{}`        | External dependencies accessible in expressions as `$deps`                                      |
| `readonly`           | `boolean`             | `false`     | Sets all fields to read-only                                                                    |
| `disabled`           | `boolean`             | `false`     | Disables all fields                                                                             |
| `removeHiddenData`   | `boolean`             | `false`     | When `true`, `getFormData()` excludes hidden fields                                             |
| `debug`              | `boolean`             | `false`     | Logs form data and schema changes to the console (dev only)                                     |
| `displayType`        | `'row' \| 'column'`   | `'row'`     | Default layout direction for label and input                                                    |
| `border`             | `boolean`             | `true`      | Whether fields show borders by default                                                          |
| `inlineErrorMessage` | `boolean`             | `false`     | When `true`, error messages are handled inline by widgets instead of the form-level error state |
| `validator`          | `ValidatorAdapter`    | `undefined` | Custom validator to replace the built-in validation engine                                      |

## Events

| Event               | Payload    | Description                    |
| ------------------- | ---------- | ------------------------------ |
| `update:modelValue` | `FormData` | Emitted when form data changes |

## Usage

```vue
<template>
  <SchemaForm
    v-model="formData"
    :schema="schema"
    :deps="{ maxItems: 10 }"
    :disabled="isSubmitting"
    :readonly="false"
    :remove-hidden-data="true"
    :debug="isDev"
    display-type="row"
    :border="true"
    :validator="customValidator"
  />
</template>
```

## TypeScript Types

```ts
import type { FormData, SchemaRaw, Deps, ValidatorAdapter } from '@v3sf/core'
```

### FormData

```ts
type FormData = Record<string, any>
```

### Deps

```ts
type Deps = Record<string, any>
```

### ValidatorAdapter

```ts
interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
```

## Prop Inheritance

Some props can be overridden at the field level in the schema:

| Component Prop | Schema Field Property | Behavior                           |
| -------------- | --------------------- | ---------------------------------- |
| `disabled`     | `disabled`            | Field-level value takes precedence |
| `readonly`     | `readonly`            | Field-level value takes precedence |
| `border`       | `border`              | Field-level value takes precedence |
| `displayType`  | `displayType`         | Field-level value takes precedence |
