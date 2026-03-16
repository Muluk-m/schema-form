# Migrating from v1

This guide helps you migrate from v1 (`v3-schema-form`) to v2 (`@v3sf/*`).

## Summary of Changes

| Area              | v1                            | v2                                                 |
| ----------------- | ----------------------------- | -------------------------------------------------- |
| Package           | `v3-schema-form`              | `@v3sf/core` + `@v3sf/vant` / `@v3sf/element-plus` |
| Architecture      | Single package, Vant built-in | Core + adapter, UI-agnostic                        |
| Expression engine | Based on `eval`               | Custom AST-based safe engine                       |
| Build tool        | rollup                        | tsdown                                             |
| Type system       | Partial types                 | Full TypeScript with exported types                |
| AI support        | None                          | `@v3sf/ai` package                                 |

## Package Changes

```bash
# v1
npm install v3-schema-form

# v2
npm install @v3sf/core @v3sf/vant          # Mobile
npm install @v3sf/core @v3sf/element-plus  # Desktop
```

## Import Changes

### v1

```ts
import SchemaForm from 'v3-schema-form'
```

`SchemaForm` was a ready-made Vue component with Vant built in.

### v2

```ts
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)
```

You now explicitly choose an adapter and create the component.

## Template Usage Is Unchanged

```vue
<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

`v-model`, `:schema`, `ref`, and other template patterns work exactly the same.

## Schema Format Is Compatible

The v2 schema format is **fully backward-compatible** with v1. All field properties (`type`, `title`, `widget`, `required`, `enum`, `enumNames`, `rules`, `props`, etc.) are unchanged.

## Expression Engine Changes

v2 replaces `eval` with a custom safe expression engine. The syntax remains the same:

```json
{
  "hidden": "{{ !$values.agree }}",
  "required": "{{ $values.type === 'other' }}"
}
```

**Important:** The v2 expression engine does not support function calls (e.g., `{{ $values.list.includes('a') }}`). Only property access, operators, and literals are supported. If your v1 code uses function calls in expressions, rewrite them using operators or handle the logic in a custom widget.

## Custom Widget Changes

### v1

Registered globally:

```ts
app.component('CustomWidget', MyWidget)
```

### v2

Registered through an adapter:

```ts
import { defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const adapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    customWidget: { component: MyWidget },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

Custom widgets can use the `useAddon()` hook to access form context.

## Migration Checklist

Follow these steps to complete the migration:

- [ ] Uninstall `v3-schema-form` and install `@v3sf/core` with the appropriate adapter package
- [ ] Replace `import SchemaForm from 'v3-schema-form'` with `createSchemaForm` + adapter
- [ ] Check expressions for function calls (e.g., `.includes()`, `.length`). Rewrite if needed.
- [ ] Migrate custom widgets to adapter registration
- [ ] Run the project and verify that forms render and validate correctly
- [ ] (Optional) Install `@v3sf/ai` to try AI-powered form generation
