# Adapter Development

v3sf is UI-agnostic by design. The adapter mechanism lets you plug in any Vue 3 component library.

## What Is an Adapter?

An adapter is a `WidgetAdapter` object that tells v3sf two things:

1. **Which widgets are available** (`widgets`)
2. **How to map props** (`propsMap` / `globalPropsMap`)

v3sf internally uses standardized prop names (`modelValue`, `disabled`, `readonly`, `placeholder`). The adapter maps these standard names to whatever prop names the target UI library expects.

## Type Definitions

```ts
interface WidgetAdapter {
  widgets: Record<string, WidgetDefinition | Component>
  globalPropsMap?: Record<string, string>
}

interface WidgetDefinition {
  component: Component
  propsMap?: Record<string, string>
}
```

## `propsMap` in Detail

`propsMap` maps v3sf standard prop names to the UI component's actual prop names.

**Mapping format:**

```
{ standardName: actualPropName }
```

**Example:** Vant's `van-field` uses `error-message` instead of `error`:

```ts
{
  component: VanField,
  propsMap: { error: 'error-message' }
}
```

- `globalPropsMap` -- applied to all widgets in the adapter
- `propsMap` (per widget) -- applied only to that widget, merged with `globalPropsMap`

## Using `defineAdapter`

`defineAdapter` is a type-helper function that provides full TypeScript inference.

```ts
import { defineAdapter } from '@v3sf/core'

const myAdapter = defineAdapter({
  widgets: {
    input: { component: MyInput },
    select: { component: MySelect, propsMap: { modelValue: 'value' } },
    switch: MySwitch, // Pass a component directly when no propsMap is needed
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})
```

## Creating a New Adapter: Full Example

Here's a complete walkthrough for creating an adapter for a hypothetical "AcmeUI" component library.

### 1. Project Structure

```
packages/acme-ui/
├── src/
│   ├── index.ts          # Adapter entry
│   └── widgets/
│       ├── Input.vue      # Wrapper component
│       ├── Select.vue
│       └── Switch.vue
└── package.json
```

### 2. Wrapper Components

If the UI library's component interface doesn't match v3sf's standard, create a thin wrapper:

```vue
<!-- widgets/Input.vue -->
<script setup>
import { AcmeInput } from 'acme-ui'

defineProps<{
  modelValue: string
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <AcmeInput
    :value="modelValue"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
    @input="emit('update:modelValue', $event)"
  />
</template>
```

### 3. Define the Adapter

```ts
// src/index.ts
import { defineAdapter } from '@v3sf/core'
import Input from './widgets/Input.vue'
import Select from './widgets/Select.vue'
import SwitchWidget from './widgets/Switch.vue'

export const acmeAdapter = defineAdapter({
  widgets: {
    input: { component: Input },
    select: { component: Select },
    switch: { component: SwitchWidget },
    // Type fallback mapping
    string: { component: Input },
    boolean: { component: SwitchWidget },
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})
```

### 4. Use It

```ts
import { createSchemaForm } from '@v3sf/core'
import { acmeAdapter } from '@my-scope/acme-adapter'

const SchemaForm = createSchemaForm(acmeAdapter)
```

## Type Fallback Mapping

In addition to widget names, you can register **value types** as keys in `widgets`. When a schema field doesn't specify a `widget`, v3sf falls back to looking up the component by `type`:

```ts
// Default type-to-widget mapping
const typeWidgetMap = {
  string: 'input',
  number: 'number',
  boolean: 'switch',
  array: 'checkbox',
  date: 'date',
}
```

You can override this default by explicitly registering type keys in your adapter:

```ts
widgets: {
  input: { component: Input },
  string: { component: Input },    // type='string' -> Input
  number: { component: Stepper },   // type='number' -> Stepper
  boolean: { component: Switch },   // type='boolean' -> Switch
}
```

## Testing an Adapter

A basic test to verify your adapter works:

```ts
import { mount } from '@vue/test-utils'
import { createSchemaForm } from '@v3sf/core'
import { acmeAdapter } from './index'

describe('AcmeUI Adapter', () => {
  it('renders a text input', () => {
    const SchemaForm = createSchemaForm(acmeAdapter)
    const wrapper = mount(SchemaForm, {
      props: {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Name' },
          },
        },
        modelValue: { name: '' },
      },
    })

    expect(wrapper.find('input').exists()).toBe(true)
  })
})
```

## Existing Adapters

Use these as references when building your own:

- [`@v3sf/vant`](https://github.com/Muluk-m/schema-form/tree/main/packages/vant) -- Vant 4 mobile adapter
- [`@v3sf/element-plus`](https://github.com/Muluk-m/schema-form/tree/main/packages/element-plus) -- Element Plus desktop adapter
