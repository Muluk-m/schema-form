# 适配器 API

v3sf 适配器相关的类型和函数参考。

## 函数

### createSchemaForm(adapter)

创建一个绑定了指定适配器的 SchemaForm Vue 组件。

```ts
function createSchemaForm(adapter: WidgetAdapter): Component
```

**参数：**

- `adapter` — 适配器对象

**返回值：** Vue 组件（可在模板中使用）

```ts
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)
```

### defineAdapter(config)

定义一个适配器，类型辅助函数。

```ts
function defineAdapter(config: WidgetAdapter): WidgetAdapter
```

**参数：**

- `config` — 适配器配置对象

**返回值：** 适配器对象（原样返回，提供类型推导）

```ts
import { defineAdapter } from '@v3sf/core'

const myAdapter = defineAdapter({
  widgets: {
    input: { component: MyInput },
    switch: MySwitch,
  },
  globalPropsMap: {
    disabled: 'disabled',
  },
})
```

### defineWidget(definition)

定义一个组件配置，类型辅助函数。

```ts
function defineWidget(definition: WidgetDefinition & { name?: string }): WidgetDefinition
```

**参数：**

- `definition` — 组件定义对象，包含 `component` 和可选的 `propsMap`
- `definition.name` — 可选的名称标识（不会被保留在返回值中）

**返回值：** `WidgetDefinition` 对象

```ts
import { defineWidget } from '@v3sf/core'
import MyColorPicker from './MyColorPicker.vue'

const colorPickerWidget = defineWidget({
  component: MyColorPicker,
  propsMap: {
    modelValue: 'color',
    disabled: 'isDisabled',
  },
})
```

### useAddon()

在自定义组件内部获取表单上下文的 hook。

```ts
function useAddon<FD extends FormData = FormData>(): Ref<FieldWidgetAddon<FD>>
```

**返回值：** 一个 Vue `Ref`，其 `.value` 为 `FieldWidgetAddon` 对象

**注意事项：**

- 必须在 `setup` 函数中调用
- 只能在 SchemaForm 渲染的组件内部使用
- 在开发环境中，如果在 SchemaForm 外部调用会抛出错误

```vue
<script setup lang="ts">
import { useAddon } from '@v3sf/core'

const addon = useAddon()

// 获取字段名
console.log(addon.value.name)

// 获取整个表单数据
const allData = addon.value.getFormData()

// 修改其他字段数据
addon.value.setFormData({ otherField: 'new value' })

// 触发校验
await addon.value.validate()
</script>
```

### compileExpression(expression)

编译表达式字符串为可复用的求值函数。

```ts
function compileExpression(expression: string): CompiledExpression
```

**参数：**

- `expression` — 表达式字符串（不含 `{{ }}`）

**返回值：** `CompiledExpression` 函数对象

**异常：** 表达式语法错误时抛出 `ExpressionError`

```ts
import { compileExpression } from '@v3sf/core'

const fn = compileExpression('$values.age >= 18')
const result = fn({ $values: { age: 20 } })
// result: true
```

## 接口

### WidgetAdapter

适配器接口定义。

```ts
interface WidgetAdapter {
  widgets: Record<string, WidgetDefinition | any>
  globalPropsMap?: Record<string, string>
}
```

| 属性             | 类型                                            | 说明                                                                      |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| `widgets`        | `Record<string, WidgetDefinition \| Component>` | 组件注册表。key 为 widget 名称或类型名，value 为组件定义或直接的 Vue 组件 |
| `globalPropsMap` | `Record<string, string>`                        | 全局 prop 名映射，应用于所有组件                                          |

### WidgetDefinition

单个组件的定义。

```ts
interface WidgetDefinition {
  component: any
  propsMap?: Record<string, string>
}
```

| 属性        | 类型                     | 说明                                               |
| ----------- | ------------------------ | -------------------------------------------------- |
| `component` | `Component`              | Vue 组件                                           |
| `propsMap`  | `Record<string, string>` | 组件级 prop 名映射，与 `globalPropsMap` 合并后使用 |

### WidgetStandardProps

所有 widget 组件接收的标准 props。

```ts
interface WidgetStandardProps {
  modelValue: any
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  error?: string
  addon?: FieldWidgetAddon
}
```

| 属性          | 类型               | 说明           |
| ------------- | ------------------ | -------------- |
| `modelValue`  | `any`              | 字段当前值     |
| `disabled`    | `boolean`          | 是否禁用       |
| `readonly`    | `boolean`          | 是否只读       |
| `placeholder` | `string`           | 占位文本       |
| `error`       | `string`           | 校验错误信息   |
| `addon`       | `FieldWidgetAddon` | 表单上下文对象 |

### FieldWidgetAddon

表单上下文对象，通过 `useAddon()` 或组件的 `addon` prop 获取。

```ts
interface FieldWidgetAddon<FD extends FormData = FormData> {
  schema: Schema
  name: string
  rootSchema: Schema
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  className?: string
  required?: boolean
  props?: Record<string, any>
  setFormData: (newFormData: Partial<FD>) => void
  getFormData: () => FD
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>
  validateFields: (fields: (keyof FD)[], scrollToError?: boolean) => Promise<ErrorMessage[]>
}
```

| 属性/方法                                | 类型                                                  | 说明                                 |
| ---------------------------------------- | ----------------------------------------------------- | ------------------------------------ |
| `schema`                                 | `Schema`                                              | 当前字段的 Schema 定义               |
| `name`                                   | `string`                                              | 字段名                               |
| `rootSchema`                             | `Schema`                                              | 根 Schema                            |
| `disabled`                               | `boolean`                                             | 当前字段是否禁用                     |
| `readonly`                               | `boolean`                                             | 当前字段是否只读                     |
| `placeholder`                            | `string`                                              | 当前字段的占位文本                   |
| `className`                              | `string`                                              | 当前字段的自定义类名                 |
| `required`                               | `boolean`                                             | 当前字段是否必填                     |
| `props`                                  | `Record<string, any>`                                 | Schema 中 props 和字段状态的合并结果 |
| `setFormData(data)`                      | `(Partial<FD>) => void`                               | 合并更新表单数据                     |
| `getFormData()`                          | `() => FD`                                            | 获取整个表单数据                     |
| `validate(scrollToError?)`               | `(boolean?) => Promise<ErrorMessage[]>`               | 触发全部字段校验                     |
| `validateFields(fields, scrollToError?)` | `((keyof FD)[], boolean?) => Promise<ErrorMessage[]>` | 校验指定字段                         |

### ValidatorAdapter

外部校验适配器接口。

```ts
interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
```

| 参数          | 类型                | 说明                         |
| ------------- | ------------------- | ---------------------------- |
| `value`       | `any`               | 字段当前值                   |
| `rules`       | `ValidatorRule[]`   | 合并后的校验规则数组         |
| `fieldSchema` | `Schema`            | 字段的完整 Schema            |
| 返回值        | `Promise<string[]>` | 错误信息数组，空数组表示通过 |

## 导出总览

`@v3sf/core` 的完整导出列表：

```ts
// 函数
export { createSchemaForm } from '@v3sf/core'
export { defineAdapter } from '@v3sf/core'
export { defineWidget } from '@v3sf/core'
export { useAddon } from '@v3sf/core'
export { compileExpression } from '@v3sf/core'

// 类型
export type {
  Schema,
  SchemaBase,
  SchemaRaw,
  ValueType,
  FormData,
  Deps,
  ErrorMessage,
  FormRef,
  Options,
  FieldWidgetAddon,
  WidgetAdapter,
  WidgetDefinition,
  WidgetStandardProps,
  ValidatorAdapter,
  ValidatorRule,
} from '@v3sf/core'
```
