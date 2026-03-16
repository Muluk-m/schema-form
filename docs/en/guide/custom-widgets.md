# Custom Widgets

When built-in widgets don't cover your use case, you can create custom widgets and register them with an adapter.

## Defining a Widget with `defineWidget`

`defineWidget` creates a widget definition that can be registered in an adapter.

```ts
import { defineWidget } from '@v3sf/core'
import MyColorPicker from './MyColorPicker.vue'

const colorPickerWidget = defineWidget({
  component: MyColorPicker,
  propsMap: {
    modelValue: 'value', // Map standard modelValue to the component's "value" prop
    disabled: 'disabled',
  },
})
```

### Parameters

| Property    | Type                     | Description                                                        |
| ----------- | ------------------------ | ------------------------------------------------------------------ |
| `component` | `Component`              | The Vue component to render                                        |
| `propsMap`  | `Record<string, string>` | Maps v3sf standard prop names to the component's actual prop names |

If your component already uses `modelValue`, `disabled`, `readonly`, and `placeholder` as prop names, you can omit `propsMap` entirely.

## Standard Props

v3sf passes these standard props to every widget:

| Prop          | Type               | Description                      |
| ------------- | ------------------ | -------------------------------- |
| `modelValue`  | `any`              | The field's current value        |
| `disabled`    | `boolean`          | Whether the field is disabled    |
| `readonly`    | `boolean`          | Whether the field is read-only   |
| `placeholder` | `string`           | Placeholder text                 |
| `error`       | `string`           | Current validation error message |
| `addon`       | `FieldWidgetAddon` | Form context object (see below)  |

Your component should emit `update:modelValue` to update the field value.

## The `useAddon` Hook

Inside a custom widget, call `useAddon()` to access the full form context.

```vue
<script setup lang="ts">
import { useAddon } from '@v3sf/core'

const addon = useAddon()

// addon.value contains:
// - schema: Schema       -- current field's schema
// - name: string         -- field name
// - rootSchema: Schema   -- the root schema
// - disabled: boolean
// - readonly: boolean
// - placeholder: string
// - className: string
// - required: boolean
// - props: object        -- pass-through props from schema
// - setFormData(data)    -- update form data
// - getFormData()        -- read form data
// - validate()           -- trigger full validation
// - validateFields(fields) -- validate specific fields
</script>
```

### Reading Other Fields

```vue
<script setup>
import { useAddon } from '@v3sf/core'

const addon = useAddon()

// Read another field's value
const otherValue = addon.value.getFormData().otherField

// Update another field
addon.value.setFormData({ otherField: 'new value' })
</script>
```

## Full Example

### 1. Create the Widget Component

```vue
<!-- MyRating.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: number
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="my-rating">
    <span
      v-for="i in 5"
      :key="i"
      :class="{ active: i <= modelValue, disabled }"
      @click="!disabled && emit('update:modelValue', i)"
    >
      ★
    </span>
  </div>
</template>
```

### 2. Register with an Adapter

```ts
import { defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import MyRating from './MyRating.vue'

const customAdapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    rating: { component: MyRating },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

### 3. Use in Schema

```ts
import { createSchemaForm } from '@v3sf/core'

const SchemaForm = createSchemaForm(customAdapter)

const schema = {
  type: 'object',
  properties: {
    score: {
      type: 'number',
      title: 'Rating',
      widget: 'rating',
    },
  },
}
```

## Advanced: Widget with `useAddon`

A more advanced example that uses `useAddon` to interact with other form fields:

```vue
<!-- CitySelector.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAddon } from '@v3sf/core'

defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const addon = useAddon()

const cities = computed(() => {
  const country = addon.value.getFormData().country
  if (country === 'US') return ['New York', 'Los Angeles', 'Chicago']
  if (country === 'UK') return ['London', 'Manchester', 'Birmingham']
  return []
})
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="">Select a city</option>
    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
  </select>
</template>
```

## Tips

- Always emit `update:modelValue` so v3sf can track changes and trigger validation.
- Use `propsMap` when your component's prop names differ from the v3sf standard.
- The `addon` prop and `useAddon()` hook provide the same data. Use whichever is more convenient.
- Custom widgets receive all extra `props` defined in the schema, merged with the standard props.
