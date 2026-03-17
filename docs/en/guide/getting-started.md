# Getting Started

Build your first v3sf form in under 5 minutes.

## Installation

v3sf uses a core + adapter architecture. Install `@v3sf/core` along with a UI adapter for your target platform.

::: code-group

```bash [Vant (Mobile)]
npm install @v3sf/core @v3sf/vant
```

```bash [Element Plus (Desktop)]
npm install @v3sf/core @v3sf/element-plus
```

:::

## Basic Usage

### 1. Create the Form Component

Bind the core engine to a UI adapter with `createSchemaForm` to produce a ready-to-use Vue component.

::: code-group

```ts [Vant]
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)
```

```ts [Element Plus]
import { createSchemaForm } from '@v3sf/core'
import { elementPlusAdapter } from '@v3sf/element-plus'

const SchemaForm = createSchemaForm(elementPlusAdapter)
```

:::

### 2. Define a Schema

A schema is a JSON object whose root `type` is `object`. Individual fields are declared inside `properties`.

```ts
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      required: true,
      placeholder: 'Enter your username',
    },
    age: {
      type: 'number',
      title: 'Age',
      widget: 'stepper',
      rules: { min: 1, max: 150, message: 'Please enter a valid age' },
    },
    gender: {
      type: 'string',
      title: 'Gender',
      widget: 'radio',
      enum: ['male', 'female'],
      enumNames: ['Male', 'Female'],
    },
  },
}
```

### 3. Render the Form

Use `v-model` for two-way data binding.

```vue
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)

const formData = ref({})
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      required: true,
      placeholder: 'Enter your username',
    },
    age: {
      type: 'number',
      title: 'Age',
      widget: 'stepper',
    },
  },
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

## Form Validation

Get a reference to the form instance and call `validate` to trigger validation.

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

async function handleSubmit() {
  const errors = await formRef.value.validate()
  if (errors.length === 0) {
    console.log('Submit succeeded', formRef.value.getFormData())
  }
}
</script>

<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" />
  <button @click="handleSubmit">Submit</button>
</template>
```

## Reactive Expressions

Use <code v-pre>{{ }}</code> expressions in properties like `required`, `disabled`, and `hidden` to create dependencies between fields.

```ts
const schema = {
  type: 'object',
  properties: {
    hasDiscount: {
      type: 'boolean',
      title: 'Has discount code',
      widget: 'switch',
    },
    discountCode: {
      type: 'string',
      title: 'Discount code',
      hidden: '{{ !$values.hasDiscount }}',
      required: '{{ $values.hasDiscount }}',
      placeholder: 'Enter discount code',
    },
  },
}
```

When `hasDiscount` is `false`, the `discountCode` field is automatically hidden. When `hasDiscount` is `true`, `discountCode` becomes required.

## Next Steps

- [Schema Reference](./schema-reference) -- Full field properties and expression syntax
- [Built-in Widgets](./widgets) -- Available widgets for each adapter
- [Adapter Development](./adapters) -- Integrate a custom UI library
- [AI Integration](./ai-integration) -- Generate form schemas with AI
