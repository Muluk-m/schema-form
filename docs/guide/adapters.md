# 适配器开发指南

v3sf 的核心设计理念是 **UI 无关**。通过适配器（Adapter）机制，可以将任意 Vue 3 组件库接入 v3sf。

## 什么是适配器

适配器是一个 `WidgetAdapter` 对象，告诉 v3sf：

1. **有哪些组件可用**（`widgets`）
2. **组件的 prop 如何映射**（`propsMap` / `globalPropsMap`）

v3sf 内部使用标准化的 prop 名称（`modelValue`、`disabled`、`readonly`、`placeholder`、`error`），适配器负责将这些标准名称映射到具体 UI 库的 prop 名称。

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

- `widgets` — 组件注册表，key 为 widget 名称，value 为组件定义或直接的 Vue 组件
- `globalPropsMap` — 全局 prop 映射，应用于所有组件

## `propsMap` 详解

`propsMap` 用于将 v3sf 标准 prop 名映射到 UI 组件实际接受的 prop 名。

**映射规则：**

```ts
{
  v3sf标准名: UI组件实际prop名
}
```

**示例：** Vant 的 `van-field` 使用 `error-message` 而非 `error`：

```ts
{
  component: VanField,
  propsMap: { error: 'error-message' }
}
```

### 全局映射 vs 组件映射

- `globalPropsMap` — 全局映射，应用于所有组件
- `propsMap`（单个 widget） — 仅应用于该组件

最终的 prop 映射 = `globalPropsMap` + `widget.propsMap`，组件级的映射会覆盖全局映射中的同名项。

```ts
const adapter = defineAdapter({
  globalPropsMap: {
    disabled: 'disabled', // 所有组件通用
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
  widgets: {
    input: {
      component: MyInput,
      propsMap: { error: 'errorMessage' }, // 仅 input 组件使用
    },
    select: {
      component: MySelect,
      propsMap: { readonly: 'readOnly' }, // 覆盖全局的 readonly 映射
    },
  },
})
```

## 使用 `defineAdapter`

`defineAdapter` 是一个类型辅助函数，提供完整的类型推导：

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

## 创建新适配器：完整教程

以下以一个假想的 "AcmeUI" 组件库为例，展示如何从零创建适配器。

### 第 1 步：规划项目结构

```
packages/acme-ui/
├── src/
│   ├── index.ts          # 适配器入口
│   └── widgets/
│       ├── Input.vue      # 包装组件（可选）
│       ├── Select.vue
│       └── Switch.vue
├── package.json
└── tsconfig.json
```

### 第 2 步：分析 UI 库接口

对比 v3sf 标准 props 和 UI 库组件的 props，确定是否需要包装组件或 propsMap：

| v3sf 标准 prop | AcmeUI Input  | 需要映射？                     |
| -------------- | ------------- | ------------------------------ |
| `modelValue`   | `value`       | 是：`{ modelValue: 'value' }`  |
| `disabled`     | `disabled`    | 否                             |
| `readonly`     | `readOnly`    | 是：`{ readonly: 'readOnly' }` |
| `placeholder`  | `placeholder` | 否                             |

### 第 3 步：创建包装组件（可选）

如果 UI 库组件的接口差异较大，或需要额外的事件处理，可以创建包装组件：

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
    :read-only="readonly"
    :placeholder="placeholder"
    @input="emit('update:modelValue', $event)"
  />
</template>
```

如果不需要包装组件，可以直接使用 UI 库原生组件 + `propsMap` 处理映射。

### 第 4 步：定义适配器

```ts
// src/index.ts
import { defineAdapter } from '@v3sf/core'
import Input from './widgets/Input.vue'
import Select from './widgets/Select.vue'
import SwitchWidget from './widgets/Switch.vue'

export const acmeAdapter = defineAdapter({
  widgets: {
    // 注册组件
    input: { component: Input },
    select: { component: Select },
    switch: { component: SwitchWidget },

    // 类型回退映射（当 Schema 中未指定 widget 时，根据 type 匹配）
    string: { component: Input },
    boolean: { component: SwitchWidget },
    number: { component: Input }, // 可以复用 input 或创建专用数字组件
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})
```

### 第 5 步：使用适配器

```ts
import { createSchemaForm } from '@v3sf/core'
import { acmeAdapter } from '@my-scope/acme-adapter'

const SchemaForm = createSchemaForm(acmeAdapter)
```

## 类型回退映射

适配器的 `widgets` 除了注册 widget 名称外，还可以注册 **值类型** 作为回退。当 Schema 中未指定 `widget` 时，v3sf 先通过以下默认映射查找 widget：

```ts
const typeWidgetMap = {
  string: 'input',
  number: 'number',
  boolean: 'switch',
  array: 'checkbox',
  date: 'date',
}
```

如果适配器中没有对应的 widget，则查找以类型名注册的组件。你也可以在适配器中显式注册类型映射来覆盖默认行为：

```ts
widgets: {
  input: { component: Input },
  string: { component: Input },    // type='string' 且无 widget 时使用
  number: { component: Stepper },   // type='number' 且无 widget 时使用
  boolean: { component: Switch },   // type='boolean' 且无 widget 时使用
}
```

## 扩展现有适配器

如果只需要在官方适配器基础上新增几个自定义组件，可以使用展开运算符：

```ts
import { defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import MyRating from './widgets/MyRating.vue'
import MyUpload from './widgets/MyUpload.vue'

export const extendedAdapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets, // 继承所有 Vant 组件
    rating: { component: MyRating },
    upload: { component: MyUpload },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

## 测试适配器

验证适配器是否正常工作的基本步骤：

1. **组件注册** — 确保所有 widget 名称都能正确解析到组件
2. **类型回退** — 验证不指定 widget 时，各 type 能否正确渲染
3. **双向绑定** — 确认 `v-model` 数据更新正常
4. **prop 映射** — 测试 `disabled`、`readonly`、`placeholder` 是否正确传递
5. **选项组件** — 确认 `enum` / `enumNames` 正确渲染为选项

```ts
// 简单测试
import { createSchemaForm } from '@v3sf/core'
import { acmeAdapter } from './adapter'

const SchemaForm = createSchemaForm(acmeAdapter)

const testSchema = {
  type: 'object',
  properties: {
    text: { type: 'string', title: '文本' }, // 应使用 input
    num: { type: 'number', title: '数字' }, // 应使用 number
    flag: { type: 'boolean', title: '开关' }, // 应使用 switch
    choice: {
      type: 'string',
      title: '选择',
      widget: 'select',
      enum: ['a', 'b'],
      enumNames: ['A', 'B'],
    },
  },
}
```

## 现有适配器参考

- [`@v3sf/vant`](https://github.com/Muluk-m/schema-form/tree/main/packages/vant) — Vant 4 移动端适配器
- [`@v3sf/element-plus`](https://github.com/Muluk-m/schema-form/tree/main/packages/element-plus) — Element Plus PC 端适配器

阅读这两个适配器的源码是学习适配器开发的最佳方式。
