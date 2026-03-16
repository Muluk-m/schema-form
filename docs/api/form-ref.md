# 表单实例 API

通过 `ref` 获取 SchemaForm 组件实例后，可以调用以下方法。

## 获取实例

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()
</script>

<template>
  <SchemaForm ref="formRef" v-model="formData" :schema="schema" />
</template>
```

## FormRef 类型

```ts
interface FormRef {
  getFormData: () => FormData
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>
  validateFields: (fields: string[], scrollToError?: boolean) => Promise<ErrorMessage[]>
}
```

## 方法

### getFormData()

获取当前表单数据。

- **返回值：** `FormData`（`Record<string, any>`）

```ts
const data = formRef.value.getFormData()
console.log(data) // { name: '张三', age: 25 }
```

当组件开启 `removeHiddenData` prop 时，返回的数据会排除被 `hidden` 隐藏的字段。

### validate(scrollToError?)

校验全部可见字段。

- **参数：**
  - `scrollToError`（可选，默认 `true`）— 校验失败时是否自动滚动到第一个错误字段
- **返回值：** `Promise<ErrorMessage[]>` — 错误信息数组，空数组表示全部通过

```ts
// 校验并滚动到错误字段（默认行为）
const errors = await formRef.value.validate()

// 校验但不自动滚动
const errors = await formRef.value.validate(false)

if (errors.length === 0) {
  // 校验通过
  console.log('表单数据:', formRef.value.getFormData())
} else {
  // 校验失败
  errors.forEach(({ name, error }) => {
    console.log(`${name}: ${error.join(', ')}`)
  })
}
```

### validateFields(fields, scrollToError?)

校验指定字段。

- **参数：**
  - `fields` — 要校验的字段名数组
  - `scrollToError`（可选，默认 `true`）— 校验失败时是否自动滚动到第一个错误字段
- **返回值：** `Promise<ErrorMessage[]>` — 错误信息数组

```ts
// 仅校验 email 和 phone 字段
const errors = await formRef.value.validateFields(['email', 'phone'])

// 校验但不自动滚动
const errors = await formRef.value.validateFields(['email'], false)
```

## ErrorMessage 类型

```ts
interface ErrorMessage {
  name: string // 字段名（对应 Schema properties 中的 key）
  error: string[] // 该字段的错误信息列表
}
```

### 示例返回值

```ts
;[
  { name: 'username', error: ['请输入用户名'] },
  { name: 'email', error: ['邮箱格式不正确'] },
  { name: 'password', error: ['密码至少 8 个字符', '必须包含大写字母'] },
]
```

## scrollToError 行为

当 `scrollToError` 为 `true`（默认）且存在校验错误时，表单会自动滚动到第一个错误字段。

滚动实现：

```ts
element.scrollIntoView({ behavior: 'smooth', block: 'center' })
```

- 使用 `smooth` 平滑滚动
- 使用 `center` 将错误字段滚动到视口中间

## 自动重新校验

当字段存在校验错误后，修改该字段的值时，引擎会自动重新校验该字段：

1. 字段有错误信息
2. 用户修改字段值
3. 引擎自动校验该字段
4. 如果通过，错误信息自动清除
5. 如果仍不通过，更新错误信息

此行为无需手动触发，由引擎内部通过 `watch` 实现。
