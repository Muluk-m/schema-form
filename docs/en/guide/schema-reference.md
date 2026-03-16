# Schema Reference

Complete reference for the v3sf schema structure and field properties.

## Root Structure

Every schema root must be an object with `type: 'object'`. Form fields are defined in `properties`.

```json
{
  "type": "object",
  "properties": {
    "fieldName": {
      "type": "string",
      "title": "Field Label"
    }
  }
}
```

## Field Properties

| Property      | Type                    | Description                                                             |
| ------------- | ----------------------- | ----------------------------------------------------------------------- |
| `type`        | `ValueType`             | **Required.** Value type of the field. See [Value Types](#value-types). |
| `title`       | `string`                | Display label for the field                                             |
| `widget`      | `string`                | Widget name to render. When omitted, inferred from `type`.              |
| `required`    | `boolean \| expression` | Whether the field is required                                           |
| `placeholder` | `string`                | Placeholder text                                                        |
| `disabled`    | `boolean \| expression` | Whether the field is disabled                                           |
| `readonly`    | `boolean \| expression` | Whether the field is read-only                                          |
| `hidden`      | `boolean \| expression` | Whether the field is hidden                                             |
| `displayType` | `'row' \| 'column'`     | Layout direction for label and input                                    |
| `className`   | `string`                | Custom CSS class                                                        |
| `border`      | `boolean`               | Whether to show a border                                                |
| `enum`        | `(string \| number)[]`  | Option values for select / radio / checkbox widgets                     |
| `enumNames`   | `(string \| number)[]`  | Option labels, corresponding 1:1 with `enum`                            |
| `rules`       | `Rule \| Rule[]`        | Validation rules                                                        |
| `props`       | `object`                | Extra props passed through to the underlying UI component               |
| `properties`  | `Record<string, Field>` | Nested fields (used when `type` is `object`)                            |

## Value Types

| type      | Description          | Default Widget                         |
| --------- | -------------------- | -------------------------------------- |
| `string`  | String               | `input`                                |
| `number`  | Number               | `number` / `stepper`                   |
| `boolean` | Boolean              | `switch`                               |
| `array`   | Array (multi-select) | `checkbox`                             |
| `date`    | Date                 | `date`                                 |
| `object`  | Nested object        | Recursively renders child `properties` |

## Expression Syntax

v3sf supports `{{ }}` expressions in `required`, `disabled`, `readonly`, `hidden`, and `props` to create dynamic field interactions.

### Format

```
"{{ expression }}"
```

An expression is a string wrapped in `{{` and `}}`. The engine evaluates it in real time and updates the corresponding property.

### Available Variables

| Variable     | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `$values`    | The full form data object. Access any field via `$values.fieldName`. |
| `$selfValue` | The current field's own value                                        |
| `$deps`      | External dependency data (passed via the component's `deps` prop)    |

### Supported Operators

- Comparison: `===`, `!==`, `==`, `!=`, `<`, `<=`, `>`, `>=`
- Logical: `&&`, `||`, `!`
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Ternary: `condition ? valueA : valueB`
- Property access: `obj.prop`
- Literals: numbers, strings (`'...'` or `"..."`), `true`, `false`, `null`, `undefined`

### Examples

```json
{
  "hidden": "{{ $values.type !== 'other' }}",
  "required": "{{ $values.age >= 18 }}",
  "disabled": "{{ !$values.agree }}",
  "props": {
    "max": "{{ $values.quantity > 10 ? 100 : 50 }}"
  }
}
```

::: warning Security Note
v3sf uses a custom expression engine based on AST parsing and evaluation. It **never calls `eval` or `new Function`**, so it is safe to use with user-supplied schemas.
:::

## Validation Rules

Define validation rules with the `rules` property. Accepts a single rule object or an array of rules.

### Rule Properties

| Property   | Type                                  | Description                                                                 |
| ---------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `required` | `boolean`                             | Whether the field is required                                               |
| `pattern`  | `RegExp \| string`                    | Regular expression to match against                                         |
| `min`      | `number`                              | Minimum value / minimum length                                              |
| `max`      | `number`                              | Maximum value / maximum length                                              |
| `len`      | `number`                              | Exact length                                                                |
| `type`     | `string`                              | Value type validation                                                       |
| `message`  | `string`                              | Error message shown on failure                                              |
| `custom`   | `(value, formData) => string \| true` | Custom validator. Return `true` to pass, or a string for the error message. |

### Example

```json
{
  "username": {
    "type": "string",
    "title": "Username",
    "rules": [
      { "required": true, "message": "Username is required" },
      { "min": 2, "max": 20, "message": "Must be 2-20 characters" },
      { "pattern": "^[a-zA-Z0-9_]+$", "message": "Only letters, numbers, and underscores" }
    ]
  },
  "email": {
    "type": "string",
    "title": "Email",
    "rules": {
      "pattern": "^[\\w.-]+@[\\w.-]+\\.\\w+$",
      "message": "Invalid email format"
    }
  }
}
```

### Custom Validation

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
          if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter'
          return true
        },
      },
    },
  },
}
```

## FormRef Methods

After obtaining a form instance via `ref`, the following methods are available:

| Method                                   | Type                                              | Description                             |
| ---------------------------------------- | ------------------------------------------------- | --------------------------------------- |
| `getFormData()`                          | `() => FormData`                                  | Returns the current form data           |
| `validate(scrollToError?)`               | `(boolean?) => Promise<ErrorMessage[]>`           | Validates all fields and returns errors |
| `validateFields(fields, scrollToError?)` | `(string[], boolean?) => Promise<ErrorMessage[]>` | Validates specific fields               |

`ErrorMessage` structure:

```ts
interface ErrorMessage {
  name: string // Field name
  error: string[] // List of error messages
}
```

## Full Example

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "required": true,
      "placeholder": "Enter your name",
      "rules": { "required": true, "message": "Name is required" }
    },
    "gender": {
      "type": "string",
      "title": "Gender",
      "widget": "radio",
      "enum": ["male", "female"],
      "enumNames": ["Male", "Female"]
    },
    "age": {
      "type": "number",
      "title": "Age",
      "widget": "stepper",
      "rules": { "min": 1, "max": 150, "message": "Please enter a valid age" }
    },
    "department": {
      "type": "string",
      "title": "Department",
      "widget": "select",
      "enum": ["engineering", "product", "design"],
      "enumNames": ["Engineering", "Product", "Design"]
    },
    "startDate": {
      "type": "date",
      "title": "Start Date",
      "widget": "date",
      "required": true
    },
    "isManager": {
      "type": "boolean",
      "title": "Manager",
      "widget": "switch"
    },
    "teamSize": {
      "type": "number",
      "title": "Team Size",
      "widget": "stepper",
      "hidden": "{{ !$values.isManager }}",
      "required": "{{ $values.isManager }}"
    }
  }
}
```
