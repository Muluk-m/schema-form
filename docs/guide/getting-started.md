# 快速开始

5 分钟内完成第一个 v3sf 表单。

## 安装

v3sf 采用核心 + 适配器的架构，需要同时安装 `@v3sf/core` 和一个 UI 适配器。

::: code-group

```bash [Vant（移动端）]
pnpm add @v3sf/core @v3sf/vant
```

```bash [Element Plus（PC 端）]
pnpm add @v3sf/core @v3sf/element-plus
```

:::

> 也可以使用 `npm install` 或 `yarn add`。

## 基本使用

### 1. 创建表单组件

通过 `createSchemaForm` 将核心引擎与 UI 适配器绑定，生成一个可直接使用的 Vue 组件。

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

### 2. 定义 Schema

Schema 是一个 JSON 对象，根节点 `type` 为 `object`，在 `properties` 中定义各个字段。

```ts
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      required: true,
      placeholder: '请输入用户名',
    },
    age: {
      type: 'number',
      title: '年龄',
      widget: 'stepper',
      rules: { min: 1, max: 150, message: '请输入有效年龄' },
    },
    gender: {
      type: 'string',
      title: '性别',
      widget: 'radio',
      enum: ['male', 'female'],
      enumNames: ['男', '女'],
    },
  },
}
```

### 3. 渲染表单

使用 `v-model` 双向绑定表单数据。

::: code-group

```vue [Vant 完整示例]
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
      title: '用户名',
      required: true,
      placeholder: '请输入用户名',
    },
    age: {
      type: 'number',
      title: '年龄',
      widget: 'stepper',
    },
    gender: {
      type: 'string',
      title: '性别',
      widget: 'radio',
      enum: ['male', 'female'],
      enumNames: ['男', '女'],
    },
  },
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

```vue [Element Plus 完整示例]
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { elementPlusAdapter } from '@v3sf/element-plus'

const SchemaForm = createSchemaForm(elementPlusAdapter)

const formData = ref({})
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      required: true,
      placeholder: '请输入用户名',
    },
    age: {
      type: 'number',
      title: '年龄',
      widget: 'number',
    },
    department: {
      type: 'string',
      title: '部门',
      widget: 'select',
      enum: ['engineering', 'product', 'design'],
      enumNames: ['工程部', '产品部', '设计部'],
    },
  },
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

:::

## 表单校验

通过 `ref` 获取表单实例，调用 `validate` 方法触发校验。

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

async function handleSubmit() {
  const errors = await formRef.value.validate()
  if (errors.length === 0) {
    console.log('提交成功', formRef.value.getFormData())
  }
}
</script>

<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" />
  <button @click="handleSubmit">提交</button>
</template>
```

`validate()` 返回一个 `ErrorMessage[]` 数组。数组为空表示校验通过。默认会自动滚动到第一个错误字段。

## 表达式联动

在 `required`、`disabled`、`hidden` 等属性中使用 `{{ }}` 表达式实现字段联动。

```ts
const schema = {
  type: 'object',
  properties: {
    hasDiscount: {
      type: 'boolean',
      title: '有优惠码',
      widget: 'switch',
    },
    discountCode: {
      type: 'string',
      title: '优惠码',
      hidden: '{{ !$values.hasDiscount }}',
      required: '{{ $values.hasDiscount }}',
      placeholder: '请输入优惠码',
    },
  },
}
```

当 `hasDiscount` 为 `false` 时，`discountCode` 字段自动隐藏；为 `true` 时变为必填。

## 下一步

- [Schema 配置参考](./schema-reference) — 完整的字段属性和类型说明
- [表达式联动](./expressions) — 表达式引擎详细用法
- [表单校验](./validation) — 校验规则详解
- [内置组件](./widgets) — 各适配器支持的组件列表
- [自定义组件](./custom-widgets) — 开发和注册自定义组件
- [适配器开发](./adapters) — 接入自定义 UI 库
- [AI 集成](./ai-integration) — 用 AI 生成表单 Schema
