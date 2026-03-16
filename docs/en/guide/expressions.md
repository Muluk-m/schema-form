# Expressions

Expressions let you create dynamic, reactive relationships between form fields. When one field's value changes, any dependent fields update automatically.

## Syntax

Wrap a JavaScript-like expression in double curly braces:

```
"{{ expression }}"
```

Expressions can be used in these field properties: `required`, `disabled`, `readonly`, `hidden`, and any value inside `props`.

```json
{
  "hidden": "{{ $values.type !== 'other' }}",
  "required": "{{ $values.age >= 18 }}",
  "disabled": "{{ !$values.agree }}"
}
```

## Context Variables

Three variables are available inside every expression:

| Variable     | Type                  | Description                                                             |
| ------------ | --------------------- | ----------------------------------------------------------------------- |
| `$values`    | `FormData`            | The entire form data object. Access any field with `$values.fieldName`. |
| `$selfValue` | `any`                 | The current field's own value.                                          |
| `$deps`      | `Record<string, any>` | External dependencies passed to the form via the `deps` prop.           |

### Accessing `$values`

```json
{
  "hidden": "{{ $values.country !== 'US' }}",
  "required": "{{ $values.role === 'admin' }}"
}
```

### Using `$selfValue`

Useful when a field's props depend on its own value:

```json
{
  "props": {
    "helperText": "{{ $selfValue > 100 ? 'High value' : '' }}"
  }
}
```

### Using `$deps`

Pass external data into expressions through the component's `deps` prop:

```vue
<SchemaForm v-model="formData" :schema="schema" :deps="{ maxItems: 10 }" />
```

```json
{
  "props": {
    "max": "{{ $deps.maxItems }}"
  }
}
```

## Supported Operators

| Category        | Operators                                                                   |
| --------------- | --------------------------------------------------------------------------- | --- | ------ |
| Comparison      | `===`, `!==`, `==`, `!=`, `<`, `<=`, `>`, `>=`                              |
| Logical         | `&&`, `                                                                     |     | `, `!` |
| Arithmetic      | `+`, `-`, `*`, `/`, `%`                                                     |
| Ternary         | `condition ? valueA : valueB`                                               |
| Property access | `obj.prop`                                                                  |
| Literals        | Numbers, strings (`'...'` or `"..."`), `true`, `false`, `null`, `undefined` |

## Common Patterns

### Conditional Visibility

Show a field only when another field has a certain value:

```json
{
  "otherReason": {
    "type": "string",
    "title": "Please specify",
    "hidden": "{{ $values.reason !== 'other' }}"
  }
}
```

### Conditional Requirement

Make a field required based on another field:

```json
{
  "companyName": {
    "type": "string",
    "title": "Company Name",
    "required": "{{ $values.employmentType === 'employed' }}"
  }
}
```

### Dynamic Props

Adjust widget props based on form state:

```json
{
  "quantity": {
    "type": "number",
    "title": "Quantity",
    "widget": "stepper",
    "props": {
      "max": "{{ $values.isPremium ? 1000 : 100 }}",
      "step": "{{ $values.bulkMode ? 10 : 1 }}"
    }
  }
}
```

### Combining Conditions

```json
{
  "hidden": "{{ !$values.enableNotifications || $values.role === 'guest' }}",
  "disabled": "{{ $values.status === 'locked' && !$deps.isAdmin }}"
}
```

## Security

::: warning Safe by Design
v3sf uses a custom expression engine built on AST parsing and evaluation. It **never calls `eval` or `new Function`**, making it safe to evaluate expressions from user-supplied or AI-generated schemas.
:::

The expression engine only supports the operators and syntax listed above. Function calls (e.g., `$values.list.includes('a')`) are **not** supported. If you need more complex logic, use a [custom widget](./custom-widgets) instead.
