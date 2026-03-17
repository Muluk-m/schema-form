# 表单校验

v3sf 内置了一套完整的表单校验系统，支持多种校验规则、自定义校验函数以及外部校验适配器。

::: demo 校验规则示例
validate/rule1
:::

## 基本用法

### 声明式必填

在字段上设置 `required: true`，引擎自动生成必填校验规则：

```json
{
  "username": {
    "type": "string",
    "title": "用户名",
    "required": true
  }
}
```

### 通过 `rules` 定义校验

使用 `rules` 属性定义更丰富的校验规则。支持单条规则对象或规则数组：

```json
{
  "email": {
    "type": "string",
    "title": "邮箱",
    "rules": {
      "pattern": "^[\\w.-]+@[\\w.-]+\\.\\w+$",
      "message": "邮箱格式不正确"
    }
  }
}
```

```json
{
  "username": {
    "type": "string",
    "title": "用户名",
    "rules": [
      { "required": true, "message": "请输入用户名" },
      { "min": 2, "max": 20, "message": "长度 2-20 个字符" },
      { "pattern": "^[a-zA-Z0-9_]+$", "message": "只能包含字母、数字和下划线" }
    ]
  }
}
```

### 触发校验

通过 `ref` 获取表单实例，调用 `validate` 方法触发全部字段校验：

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

async function handleSubmit() {
  const errors = await formRef.value.validate()
  if (errors.length === 0) {
    // 校验通过
    const data = formRef.value.getFormData()
    console.log('表单数据:', data)
  } else {
    // 校验失败，errors 包含错误信息
    console.log('校验失败:', errors)
  }
}
</script>

<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" />
  <button @click="handleSubmit">提交</button>
</template>
```

## 内置校验规则

### required — 必填

校验字段值是否为空。以下情况视为空值：

- `null` 或 `undefined`
- 空字符串或仅含空格的字符串
- 空数组 `[]`

```json
{ "required": true, "message": "此字段不能为空" }
```

### pattern — 正则校验

使用正则表达式校验字段值（仅对非空值生效）：

```json
{ "pattern": "^1[3-9]\\d{9}$", "message": "手机号格式不正确" }
```

`pattern` 支持字符串或 `RegExp` 对象（在 TypeScript 中使用时）。

### min — 最小值/最小长度

根据值的类型自动选择校验方式：

- **字符串** — 校验字符串长度 `value.length >= min`
- **数字** — 校验数值大小 `value >= min`
- **数组** — 校验数组长度 `value.length >= min`

```json
{ "min": 2, "message": "至少输入 2 个字符" }
```

### max — 最大值/最大长度

与 `min` 类似，校验上限：

```json
{ "max": 100, "message": "不能超过 100" }
```

### len — 精确长度

校验字符串或数组的精确长度：

```json
{ "len": 11, "message": "长度必须为 11 位" }
```

### type — 类型校验

校验值的 JavaScript 类型：

```json
{ "type": "number", "message": "必须为数字" }
```

支持的类型值：`string`、`number`、`boolean`、`array`。

## 自定义校验函数

通过 `custom` 属性定义自定义校验逻辑。函数接收当前字段值和整个表单数据，返回 `true` 表示通过，返回字符串表示错误信息。

```ts
const schema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      title: '密码',
      rules: {
        custom: (value, formData) => {
          if (!value) return '请输入密码'
          if (value.length < 8) return '密码至少 8 个字符'
          if (!/[A-Z]/.test(value)) return '密码必须包含大写字母'
          if (!/[0-9]/.test(value)) return '密码必须包含数字'
          return true
        },
      },
    },
    confirmPassword: {
      type: 'string',
      title: '确认密码',
      rules: {
        custom: (value, formData) => {
          if (value !== formData.password) return '两次密码不一致'
          return true
        },
      },
    },
  },
}
```

### 结合其他规则使用

`custom` 可以和内置规则一起使用：

```ts
{
  rules: [
    { required: true, message: '请输入' },
    { min: 6, message: '至少 6 个字符' },
    {
      custom: (value) => {
        if (/\s/.test(value)) return '不能包含空格'
        return true
      },
    },
  ]
}
```

## 错误信息模板

内置规则的 `message` 支持 `${name}` 变量，会被替换为字段的 `title`：

```json
{
  "username": {
    "type": "string",
    "title": "用户名",
    "rules": { "required": true, "message": "${name}不能为空" }
  }
}
```

实际显示的错误信息为 "用户名不能为空"。

### 默认错误信息

如果未指定 `message`，引擎使用以下默认模板（中文）：

| 规则            | 默认信息                      |
| --------------- | ----------------------------- |
| `required`      | `${name}不能为空`             |
| `pattern`       | `${name}格式不正确`           |
| `min`（字符串） | `${name}至少${min}个字符`     |
| `min`（数字）   | `${name}不能小于${min}`       |
| `min`（数组）   | `${name}至少选择${min}项`     |
| `max`（字符串） | `${name}不能超过${max}个字符` |
| `max`（数字）   | `${name}不能大于${max}`       |
| `max`（数组）   | `${name}最多选择${max}项`     |
| `len`           | `${name}长度应为${len}`       |
| `type`          | `${name}类型不正确`           |

## 校验时机

### 提交时校验

调用 `validate()` 校验全部字段：

```ts
const errors = await formRef.value.validate()
```

### 校验指定字段

调用 `validateFields()` 仅校验指定字段：

```ts
const errors = await formRef.value.validateFields(['email', 'phone'])
```

### 值变化时自动重新校验

当字段有校验错误后，修改该字段的值时，引擎会自动重新校验该字段。一旦校验通过，错误信息自动清除。

## scrollToError

`validate()` 和 `validateFields()` 都接受一个 `scrollToError` 参数（默认为 `true`），校验失败时自动滚动到第一个错误字段：

```ts
// 默认滚动到错误字段
await formRef.value.validate()

// 禁止自动滚动
await formRef.value.validate(false)

// validateFields 同理
await formRef.value.validateFields(['email'], false)
```

滚动使用 `scrollIntoView({ behavior: 'smooth', block: 'center' })` 实现平滑居中滚动。

## ValidatorAdapter 外部校验适配器

如果需要使用外部校验库（如 async-validator），可以通过 `validator` prop 传入自定义的校验适配器。

### 接口定义

```ts
interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
```

### 使用方式

```vue
<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" :validator="myValidator" />
</template>
```

```ts
const myValidator: ValidatorAdapter = {
  validate: async (value, rules, fieldSchema) => {
    // 使用外部校验库校验
    // 返回错误信息数组，空数组表示通过
    const errors: string[] = []
    // ...自定义校验逻辑
    return errors
  },
}
```

当传入 `validator` 后，内置校验逻辑会被完全替换，所有校验交由外部适配器处理。

## inlineErrorMessage

通过 `inlineErrorMessage` prop 控制错误信息的显示方式：

```vue
<!-- 默认：错误信息由表单统一管理和显示 -->
<SchemaForm v-model="formData" :schema="schema" />

<!-- 内联模式：将错误信息传给组件自行显示 -->
<SchemaForm v-model="formData" :schema="schema" inline-error-message />
```

## 完整示例

```vue
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)
const formRef = ref()
const formData = ref({})

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      rules: [
        { required: true, message: '请输入姓名' },
        { min: 2, max: 10, message: '姓名长度 2-10 个字符' },
      ],
    },
    phone: {
      type: 'string',
      title: '手机号',
      rules: [
        { required: true, message: '请输入手机号' },
        { pattern: '^1[3-9]\\d{9}$', message: '手机号格式不正确' },
      ],
    },
    email: {
      type: 'string',
      title: '邮箱',
      rules: {
        pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$',
        message: '邮箱格式不正确',
      },
    },
    age: {
      type: 'number',
      title: '年龄',
      widget: 'stepper',
      rules: { min: 1, max: 150, message: '请输入有效年龄' },
    },
    password: {
      type: 'string',
      title: '密码',
      props: { type: 'password' },
      rules: [
        { required: true, message: '请输入密码' },
        {
          custom: (value) => {
            if (value && value.length < 8) return '密码至少 8 个字符'
            if (value && !/[A-Z]/.test(value)) return '必须包含大写字母'
            return true
          },
        },
      ],
    },
  },
}

async function handleSubmit() {
  const errors = await formRef.value.validate()
  if (errors.length === 0) {
    alert('提交成功！')
    console.log(formRef.value.getFormData())
  }
}
</script>

<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" />
  <button @click="handleSubmit">提交</button>
</template>
```
