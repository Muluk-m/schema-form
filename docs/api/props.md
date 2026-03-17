# 组件 Props

SchemaForm 组件的 Props 参考。

## 概述

`SchemaForm` 组件通过 `createSchemaForm(adapter)` 创建，接受以下 props：

```vue
<SchemaForm
  v-model="formData"
  :schema="schema"
  :deps="deps"
  :disabled="false"
  :readonly="false"
  :border="true"
  display-type="row"
  :remove-hidden-data="false"
  :debug="false"
  :inline-error-message="false"
  :validator="customValidator"
/>
```

## Props 列表

| Prop                 | 类型                | 默认值      | 说明                                      |
| -------------------- | ------------------- | ----------- | ----------------------------------------- |
| `schema`             | `SchemaRaw`         | `{}`        | 表单 Schema 定义                          |
| `modelValue`         | `FormData`          | `{}`        | 表单数据，支持 `v-model` 双向绑定         |
| `deps`               | `Deps`              | `{}`        | 外部依赖数据，在表达式中通过 `$deps` 访问 |
| `disabled`           | `boolean`           | `false`     | 全局禁用。设为 `true` 时所有字段禁用      |
| `readonly`           | `boolean`           | `false`     | 全局只读。设为 `true` 时所有字段只读      |
| `border`             | `boolean`           | `true`      | 是否显示字段边框                          |
| `displayType`        | `'row' \| 'column'` | `'row'`     | 全局标签布局方式                          |
| `removeHiddenData`   | `boolean`           | `false`     | `getFormData()` 是否排除隐藏字段的数据    |
| `debug`              | `boolean`           | `false`     | 开启调试模式，数据变化时在控制台输出日志  |
| `inlineErrorMessage` | `boolean`           | `false`     | 是否将错误信息传给组件自行显示            |
| `validator`          | `ValidatorAdapter`  | `undefined` | 外部校验适配器，替代内置校验逻辑          |

## 详细说明

### schema

表单的核心配置，定义所有字段的类型、组件、校验规则等。根节点必须有 `type: 'object'` 和 `properties`。

```ts
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: '姓名', required: true },
  },
}
```

Schema 中的 `required`、`disabled`、`readonly`、`hidden` 以及 `props` 中的值支持 <code v-pre>{{ }}</code> 表达式字符串。

### modelValue / v-model

表单数据对象，使用 `v-model` 双向绑定：

```vue
<SchemaForm v-model="formData" :schema="schema" />
```

数据结构与 `properties` 中的字段名一一对应：

```ts
// schema.properties 有 name, age, gender
formData.value = {
  name: '张三',
  age: 25,
  gender: 'male',
}
```

### deps

外部依赖数据，在 Schema 表达式中通过 `$deps` 访问。适用于将组件外部的状态传入表达式引擎：

```vue
<SchemaForm v-model="formData" :schema="schema" :deps="{ userRole, config }" />
```

```json
{
  "hidden": "{{ $deps.userRole !== 'admin' }}"
}
```

### disabled / readonly

全局禁用或只读开关。字段级别的 `disabled` / `readonly` 会覆盖全局设置：

```vue
<!-- 全局禁用 -->
<SchemaForm v-model="formData" :schema="schema" disabled />
```

优先级：字段级 > 全局级。

### displayType

控制标签与输入框的布局方式：

- `'row'` — 标签和输入框水平排列（默认）
- `'column'` — 标签和输入框垂直排列

字段级别的 `displayType` 会覆盖全局设置。

### border

是否为字段显示边框。字段级别的 `border` 会覆盖全局设置。

### removeHiddenData

当设为 `true` 时，调用 `getFormData()` 返回的数据会排除被 `hidden` 隐藏的字段：

```vue
<SchemaForm v-model="formData" :schema="schema" remove-hidden-data />
```

```ts
// 如果 hiddenField 被隐藏
const data = formRef.value.getFormData()
// data 中不包含 hiddenField
```

### debug

开启调试模式后，每次表单数据变化时会在控制台输出：

- 当前表单数据
- 解析后的 Schema

仅在开发环境（`NODE_ENV !== 'production'`）下生效。

### inlineErrorMessage

控制错误信息的显示方式：

- `false`（默认）— 错误信息由 SchemaForm 统一管理，通过 `error` prop 传给组件
- `true` — 错误信息作为 `error` prop 传给组件，由组件自行决定如何显示

### validator

外部校验适配器。传入后，内置校验逻辑会被完全替换：

```ts
const customValidator: ValidatorAdapter = {
  validate: async (value, rules, fieldSchema) => {
    // 返回错误信息数组
    return []
  },
}
```

```vue
<SchemaForm v-model="formData" :schema="schema" :validator="customValidator" />
```

## Events

| 事件                | 参数       | 说明                                     |
| ------------------- | ---------- | ---------------------------------------- |
| `update:modelValue` | `FormData` | 表单数据更新时触发（`v-model` 内部使用） |
