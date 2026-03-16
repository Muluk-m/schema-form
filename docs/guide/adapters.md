# 适配器开发指南

v3sf 的核心设计理念是 **UI 无关**。通过适配器（Adapter）机制，可以将任意 Vue 3 组件库接入 v3sf。

## 什么是适配器

适配器是一个 `WidgetAdapter` 对象，告诉 v3sf：

1. **有哪些组件可用**（`widgets`）
2. **组件的 prop 如何映射**（`propsMap` / `globalPropsMap`）

v3sf 内部使用标准化的 prop 名称（`modelValue`、`disabled`、`readonly`、`placeholder`），适配器负责将这些标准名称映射到具体 UI 库的 prop 名称。

## 适配器类型定义

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

## `propsMap` 详解

`propsMap` 用于将 v3sf 标准 prop 名映射到 UI 组件实际接受的 prop 名。

**映射规则：**

```
{ v3sf标准名: UI组件实际prop名 }
```

**示例：** Vant 的 `van-field` 使用 `error-message` 而非 `error`：

```ts
{
  component: VanField,
  propsMap: { error: 'error-message' }
}
```

- `globalPropsMap`：全局映射，应用于所有组件
- `propsMap`（单个 widget）：仅应用于该组件，会与 `globalPropsMap` 合并

## 使用 `defineAdapter`

`defineAdapter` 是一个类型辅助函数，提供完整的类型推导。

```ts
import { defineAdapter } from '@v3sf/core'

const myAdapter = defineAdapter({
  widgets: {
    input: { component: MyInput },
    select: { component: MySelect, propsMap: { modelValue: 'value' } },
    switch: MySwitch, // 直接传组件也可以（无需 propsMap 时）
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})
```

## 创建新适配器：完整示例

以下示例展示如何为一个假想的 "AcmeUI" 组件库创建适配器。

### 1. 项目结构

```
packages/acme-ui/
├── src/
│   ├── index.ts          # 适配器入口
│   └── widgets/
│       ├── Input.vue      # 包装组件
│       ├── Select.vue
│       └── Switch.vue
└── package.json
```

### 2. 包装组件

如果 UI 库组件的接口与 v3sf 标准不一致，创建一个薄包装层：

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

### 3. 定义适配器

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
    // 类型回退映射
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

### 4. 使用

```ts
import { createSchemaForm } from '@v3sf/core'
import { acmeAdapter } from '@my-scope/acme-adapter'

const SchemaForm = createSchemaForm(acmeAdapter)
```

## 类型回退映射

适配器的 `widgets` 除了注册 widget 名称外，还可以注册 **值类型** 作为回退。当 Schema 中未指定 `widget` 时，v3sf 会根据 `type` 查找对应组件：

```ts
const typeWidgetMap = {
  string: 'input',
  number: 'number',
  boolean: 'switch',
  array: 'checkbox',
  date: 'date',
}
```

在适配器中显式注册类型映射可以覆盖这个默认行为：

```ts
widgets: {
  input: { component: Input },
  string: { component: Input },    // type='string' 时使用 Input
  number: { component: Stepper },   // type='number' 时使用 Stepper
  boolean: { component: Switch },   // type='boolean' 时使用 Switch
}
```

## 现有适配器参考

- [`@v3sf/vant`](https://github.com/Muluk-m/schema-form/tree/main/packages/vant) — Vant 4 移动端适配器
- [`@v3sf/element-plus`](https://github.com/Muluk-m/schema-form/tree/main/packages/element-plus) — Element Plus PC 端适配器
