# Validation

v3sf includes a built-in validation engine that covers the most common scenarios. For advanced needs, you can plug in a custom `ValidatorAdapter`.

## Built-in Rules

Define rules on any field via the `rules` property. It accepts a single rule object or an array.

```ts
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      rules: [
        { required: true, message: 'Username is required' },
        { min: 2, max: 20, message: 'Must be 2-20 characters' },
        { pattern: '^[a-zA-Z0-9_]+$', message: 'Only letters, numbers, and underscores' },
      ],
    },
  },
}
```

### Rule Properties

| Property   | Type                                  | Description                                                                          |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| `required` | `boolean`                             | Field must have a non-empty value                                                    |
| `pattern`  | `RegExp \| string`                    | Value must match the regular expression                                              |
| `min`      | `number`                              | Minimum value (numbers), minimum length (strings/arrays)                             |
| `max`      | `number`                              | Maximum value (numbers), maximum length (strings/arrays)                             |
| `len`      | `number`                              | Exact length (strings/arrays)                                                        |
| `type`     | `string`                              | Validates the JavaScript type (`'string'`, `'number'`, `'boolean'`, `'array'`)       |
| `message`  | `string`                              | Custom error message. Supports `${name}`, `${min}`, `${max}`, `${len}` placeholders. |
| `custom`   | `(value, formData) => string \| true` | Custom validator function                                                            |

### How `min` / `max` Work

The behavior of `min` and `max` depends on the value type:

| Value Type | `min` checks          | `max` checks          |
| ---------- | --------------------- | --------------------- |
| `string`   | `value.length >= min` | `value.length <= max` |
| `number`   | `value >= min`        | `value <= max`        |
| `array`    | `value.length >= min` | `value.length <= max` |

### Schema-Level `required`

You can set `required: true` directly on a field (outside `rules`). The engine automatically creates a required rule from it:

```json
{
  "name": {
    "type": "string",
    "title": "Name",
    "required": true
  }
}
```

This is equivalent to adding `{ required: true }` in the `rules` array.

## Custom Validators

For logic that goes beyond the built-in rules, use the `custom` function. Return `true` to pass, or an error message string to fail.

```ts
const schema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      title: 'Password',
      rules: {
        custom: (value, formData) => {
          if (value && value.length < 8) return 'Password must be at least 8 characters'
          if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter'
          if (!/[0-9]/.test(value)) return 'Must contain a number'
          return true
        },
      },
    },
    confirmPassword: {
      type: 'string',
      title: 'Confirm Password',
      rules: {
        custom: (value, formData) => {
          if (value !== formData.password) return 'Passwords do not match'
          return true
        },
      },
    },
  },
}
```

The `custom` function receives two arguments:

1. `value` -- the current field value
2. `formData` -- the entire form data object (useful for cross-field validation)

## ValidatorAdapter

If you need to replace the built-in validation entirely (e.g., to use a library like `yup`, `zod`, or `async-validator`), implement the `ValidatorAdapter` interface and pass it as a prop.

```ts
interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
```

### Example: Custom ValidatorAdapter

```ts
import type { ValidatorAdapter } from '@v3sf/core'

const myValidator: ValidatorAdapter = {
  async validate(value, rules, fieldSchema) {
    const errors: string[] = []

    for (const rule of rules) {
      if (rule.required && (value == null || value === '')) {
        errors.push(rule.message ?? `${fieldSchema.title} is required`)
      }
      // Add your own validation logic here
    }

    return errors
  },
}
```

Pass it to the form component:

```vue
<SchemaForm v-model="formData" :schema="schema" :validator="myValidator" />
```

When a `ValidatorAdapter` is provided, the built-in validator is bypassed entirely. All validation is delegated to your adapter.

## Error Messages

### Default Messages

The built-in validator generates messages using templates with placeholder variables:

| Rule           | Default Message Template                     |
| -------------- | -------------------------------------------- |
| `required`     | `${name} is required`                        |
| `pattern`      | `${name} format is invalid`                  |
| `min` (string) | `${name} must be at least ${min} characters` |
| `min` (number) | `${name} cannot be less than ${min}`         |
| `max` (string) | `${name} cannot exceed ${max} characters`    |
| `max` (number) | `${name} cannot be greater than ${max}`      |
| `len`          | `${name} must be exactly ${len} characters`  |
| `type`         | `${name} type is invalid`                    |

::: tip
The `${name}` placeholder is replaced with the field's `title`. Always provide a `title` for meaningful error messages, or supply your own `message` on the rule.
:::

### Custom Messages

Override any default message by setting the `message` property on a rule:

```json
{
  "email": {
    "type": "string",
    "title": "Email",
    "rules": {
      "pattern": "^[\\w.-]+@[\\w.-]+\\.\\w+$",
      "message": "Please enter a valid email address"
    }
  }
}
```

## Triggering Validation

### Validate All Fields

```ts
const errors = await formRef.value.validate()
// errors: ErrorMessage[] -- empty array means all fields passed
```

### Validate Specific Fields

```ts
const errors = await formRef.value.validateFields(['email', 'password'])
```

### Auto-Scroll on Error

Both `validate()` and `validateFields()` accept an optional `scrollToError` boolean (defaults to `true`). When enabled, the form automatically scrolls to the first field with an error.

```ts
// Disable auto-scroll
const errors = await formRef.value.validate(false)
```

### Auto Re-Validation

When a field currently has an error, the form automatically re-validates it whenever its value changes. Errors are cleared as soon as the value becomes valid.
