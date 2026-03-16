# Form Ref Methods

API reference for the form instance methods exposed via template `ref`.

## Getting the Form Ref

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()
</script>

<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" />
</template>
```

## FormRef Interface

```ts
interface FormRef {
  getFormData: () => FormData
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>
  validateFields: (fields: string[], scrollToError?: boolean) => Promise<ErrorMessage[]>
}
```

## Methods

### `getFormData()`

Returns the current form data as a plain object.

```ts
const data = formRef.value.getFormData()
console.log(data) // { name: 'John', age: 30, ... }
```

When the `removeHiddenData` prop is `true`, hidden fields are excluded from the returned data.

**Returns:** `FormData` (`Record<string, any>`)

---

### `validate(scrollToError?)`

Validates all visible fields and returns an array of errors.

```ts
const errors = await formRef.value.validate()

if (errors.length === 0) {
  // All fields passed validation
  submitForm(formRef.value.getFormData())
}
```

**Parameters:**

| Parameter       | Type      | Default | Description                                           |
| --------------- | --------- | ------- | ----------------------------------------------------- |
| `scrollToError` | `boolean` | `true`  | Automatically scroll to the first field with an error |

**Returns:** `Promise<ErrorMessage[]>` -- an empty array means validation passed.

---

### `validateFields(fields, scrollToError?)`

Validates only the specified fields.

```ts
const errors = await formRef.value.validateFields(['email', 'password'])
```

**Parameters:**

| Parameter       | Type       | Default | Description                                           |
| --------------- | ---------- | ------- | ----------------------------------------------------- |
| `fields`        | `string[]` | -       | **Required.** Array of field names to validate.       |
| `scrollToError` | `boolean`  | `true`  | Automatically scroll to the first field with an error |

**Returns:** `Promise<ErrorMessage[]>`

## ErrorMessage

```ts
interface ErrorMessage {
  name: string // Field name (key in properties)
  error: string[] // Array of error message strings
}
```

### Example Error Output

```ts
;[
  { name: 'email', error: ['Email is required'] },
  { name: 'password', error: ['At least 8 characters', 'Must contain an uppercase letter'] },
]
```

## Common Patterns

### Submit with Validation

```ts
async function handleSubmit() {
  const errors = await formRef.value.validate()
  if (errors.length > 0) {
    // Validation failed -- errors are displayed, first error field scrolled into view
    return
  }
  const data = formRef.value.getFormData()
  await api.submit(data)
}
```

### Validate on Step Change (Multi-step Form)

```ts
async function nextStep() {
  // Only validate fields in the current step
  const currentStepFields = steps[currentStep].fields
  const errors = await formRef.value.validateFields(currentStepFields)
  if (errors.length === 0) {
    currentStep++
  }
}
```

### Validate Without Scrolling

```ts
const errors = await formRef.value.validate(false)
```

### Get Clean Data (Excluding Hidden Fields)

Set `removeHiddenData` on the component:

```vue
<SchemaForm ref="formRef" v-model="formData" :schema="schema" :remove-hidden-data="true" />
```

Then `getFormData()` automatically excludes hidden fields:

```ts
const cleanData = formRef.value.getFormData()
```
