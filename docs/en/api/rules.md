# Validation Rules

API reference for the `ValidatorRule` interface and built-in validation behavior.

## ValidatorRule

```ts
interface ValidatorRule {
  required?: boolean
  pattern?: RegExp | string
  min?: number
  max?: number
  len?: number
  type?: string
  message?: string
  custom?: (value: any, formData: FormData) => string | true
}
```

## Rule Properties

| Property   | Type                                  | Description                                                                                         |
| ---------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `required` | `boolean`                             | The field must have a non-empty value. Empty means `null`, `undefined`, `''` (after trim), or `[]`. |
| `pattern`  | `RegExp \| string`                    | The value must match this regular expression. Strings are converted to `RegExp` internally.         |
| `min`      | `number`                              | Minimum constraint. For strings/arrays: minimum length. For numbers: minimum value.                 |
| `max`      | `number`                              | Maximum constraint. For strings/arrays: maximum length. For numbers: maximum value.                 |
| `len`      | `number`                              | The value's length must be exactly this number. Applies to strings and arrays.                      |
| `type`     | `string`                              | Validates the JavaScript type. Accepted values: `'string'`, `'number'`, `'boolean'`, `'array'`.     |
| `message`  | `string`                              | Custom error message. Supports template variables: `${name}`, `${min}`, `${max}`, `${len}`.         |
| `custom`   | `(value, formData) => string \| true` | Custom validation function. Return `true` to pass, or an error string to fail.                      |

## Usage

### Single Rule

```json
{
  "rules": { "required": true, "message": "This field is required" }
}
```

### Multiple Rules

```json
{
  "rules": [
    { "required": true, "message": "Email is required" },
    { "pattern": "^[\\w.-]+@[\\w.-]+\\.\\w+$", "message": "Invalid email format" }
  ]
}
```

### Schema-Level Required

Setting `required: true` on the field itself automatically creates a required rule:

```json
{
  "name": {
    "type": "string",
    "title": "Name",
    "required": true
  }
}
```

This is equivalent to:

```json
{
  "name": {
    "type": "string",
    "title": "Name",
    "rules": [{ "required": true }]
  }
}
```

Both can be used together. The schema-level `required` rule runs first.

## Validation Behavior

### Evaluation Order

Rules are evaluated sequentially. Each rule in the array is checked in order, and all errors are collected (not short-circuited).

### Empty Value Handling

If the value is empty and the rule does not have `required: true`, the rule is skipped. Only `required` rules trigger on empty values.

### min / max Behavior by Type

| Value Type | `min`                 | `max`                 |
| ---------- | --------------------- | --------------------- |
| `string`   | `value.length >= min` | `value.length <= max` |
| `number`   | `value >= min`        | `value <= max`        |
| `array`    | `value.length >= min` | `value.length <= max` |

## Default Error Message Templates

| Rule           | Template                                     |
| -------------- | -------------------------------------------- |
| `required`     | `${name} is required`                        |
| `pattern`      | `${name} format is invalid`                  |
| `min` (string) | `${name} must be at least ${min} characters` |
| `min` (number) | `${name} cannot be less than ${min}`         |
| `min` (array)  | `${name} must have at least ${min} items`    |
| `max` (string) | `${name} cannot exceed ${max} characters`    |
| `max` (number) | `${name} cannot be greater than ${max}`      |
| `max` (array)  | `${name} must have at most ${max} items`     |
| `len`          | `${name} must be exactly ${len} characters`  |
| `type`         | `${name} type is invalid`                    |

The `${name}` variable is replaced with the field's `title`.

## Custom Validation

```ts
const schema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      title: 'Password',
      rules: [
        { required: true, message: 'Password is required' },
        {
          custom: (value, formData) => {
            if (value.length < 8) return 'At least 8 characters'
            if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter'
            if (!/[0-9]/.test(value)) return 'Must contain a number'
            return true
          },
        },
      ],
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

## ValidatorAdapter

Replace the entire built-in validation engine with a custom adapter:

```ts
interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
```

When provided via the `validator` prop, all validation is delegated to the adapter. The built-in engine is bypassed completely.

```vue
<SchemaForm v-model="formData" :schema="schema" :validator="myValidator" />
```
