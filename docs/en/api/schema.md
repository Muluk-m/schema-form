# Schema API

Complete API reference for the v3sf schema format.

## Root Schema

The root of every schema must have `type: 'object'` and a `properties` map.

```ts
interface RootSchema {
  type: 'object'
  properties: Record<string, FieldSchema>
}
```

## FieldSchema

Each key in `properties` defines a form field.

| Property      | Type                               | Default              | Description                                                                             |
| ------------- | ---------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| `type`        | `ValueType`                        | -                    | **Required.** The field's value type.                                                   |
| `title`       | `string`                           | -                    | Display label                                                                           |
| `widget`      | `string`                           | Inferred from `type` | Widget name to render                                                                   |
| `required`    | `boolean \| string`                | `false`              | Whether the field is required. Accepts an expression string.                            |
| `placeholder` | `string`                           | -                    | Placeholder text                                                                        |
| `disabled`    | `boolean \| string`                | `false`              | Disabled state. Accepts an expression string.                                           |
| `readonly`    | `boolean \| string`                | `false`              | Read-only state. Accepts an expression string.                                          |
| `hidden`      | `boolean \| string`                | `false`              | Hidden state. Accepts an expression string.                                             |
| `displayType` | `'row' \| 'column'`                | Inherited            | Layout direction for label and input                                                    |
| `className`   | `string`                           | -                    | Custom CSS class on the field wrapper                                                   |
| `border`      | `boolean`                          | Inherited            | Whether to show a border                                                                |
| `enum`        | `(string \| number)[]`             | -                    | Option values for selection widgets                                                     |
| `enumNames`   | `(string \| number)[]`             | -                    | Option labels, corresponding 1:1 with `enum`                                            |
| `rules`       | `ValidatorRule \| ValidatorRule[]` | -                    | Validation rules                                                                        |
| `props`       | `Record<string, any>`              | -                    | Extra props forwarded to the underlying UI component. Values can be expression strings. |
| `properties`  | `Record<string, FieldSchema>`      | -                    | Nested fields when `type` is `'object'`                                                 |

## ValueType

```ts
type ValueType = 'string' | 'object' | 'array' | 'number' | 'boolean' | 'date' | (string & {}) // extensible
```

| Type      | JS Type          | Default Widget                         |
| --------- | ---------------- | -------------------------------------- |
| `string`  | `string`         | `input`                                |
| `number`  | `number`         | `number` / `stepper`                   |
| `boolean` | `boolean`        | `switch`                               |
| `array`   | `any[]`          | `checkbox`                             |
| `date`    | `string \| Date` | `date`                                 |
| `object`  | `object`         | Recursive render of child `properties` |

## SchemaRaw

The raw schema type before expression resolution. Any `boolean`, `string`, or `number` property can also be an expression string `"{{ ... }}"`.

```ts
type SchemaRaw = Stringify<SchemaBase>
```

## Expression Strings

Any field property that accepts `boolean | string` can be given an expression like `"{{ $values.age >= 18 }}"`. Values inside `props` can also be expressions.

Available context variables:

| Variable     | Description                                |
| ------------ | ------------------------------------------ |
| `$values`    | Full form data object                      |
| `$selfValue` | Current field's value                      |
| `$deps`      | External dependencies from the `deps` prop |

## Example

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Full Name",
      "required": true,
      "placeholder": "Enter your name"
    },
    "role": {
      "type": "string",
      "title": "Role",
      "widget": "select",
      "enum": ["developer", "designer", "manager"],
      "enumNames": ["Developer", "Designer", "Manager"]
    },
    "teamSize": {
      "type": "number",
      "title": "Team Size",
      "widget": "stepper",
      "hidden": "{{ $values.role !== 'manager' }}",
      "required": "{{ $values.role === 'manager' }}",
      "props": {
        "min": 1,
        "max": "{{ $deps.maxTeamSize || 50 }}"
      }
    }
  }
}
```
