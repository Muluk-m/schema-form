# Schema API

v3sf Schema 的完整类型定义参考。

## Schema

`Schema` 是 `Partial<SchemaBase>` 的类型别名，所有属性均为可选。

```ts
type Schema = Partial<SchemaBase>
```

## SchemaBase

`SchemaBase` 是 Schema 的完整接口定义，包含所有可用属性。

```ts
interface SchemaBase {
  type: ValueType
  title: string
  required: boolean
  placeholder: string
  disabled: boolean
  readonly: boolean
  hidden: boolean
  displayType: 'row' | 'column'
  className: string
  widget: string
  properties: Record<string, Schema>
  enum: Array<string | number>
  enumNames: Array<string | number>
  rules: ValidatorRule | ValidatorRule[]
  props: Record<string, any>
  border: boolean
}
```

### 属性说明

| 属性          | 类型                               | 说明                                                                 |
| ------------- | ---------------------------------- | -------------------------------------------------------------------- |
| `type`        | `ValueType`                        | 字段值类型                                                           |
| `title`       | `string`                           | 字段显示标签                                                         |
| `required`    | `boolean`                          | 是否必填。在 Schema 中也可以使用 <code v-pre>{{ }}</code> 表达式     |
| `placeholder` | `string`                           | 占位提示文本                                                         |
| `disabled`    | `boolean`                          | 是否禁用。在 Schema 中也可以使用 <code v-pre>{{ }}</code> 表达式     |
| `readonly`    | `boolean`                          | 是否只读。在 Schema 中也可以使用 <code v-pre>{{ }}</code> 表达式     |
| `hidden`      | `boolean`                          | 是否隐藏。在 Schema 中也可以使用 <code v-pre>{{ }}</code> 表达式     |
| `displayType` | `'row' \| 'column'`                | 标签与输入框的布局方式。`row` 为水平排列，`column` 为垂直排列        |
| `className`   | `string`                           | 自定义 CSS 类名，添加到字段容器上                                    |
| `widget`      | `string`                           | 渲染组件名称。未指定时根据 `type` 自动推断                           |
| `properties`  | `Record<string, Schema>`           | 嵌套字段定义，当 `type` 为 `object` 时使用                           |
| `enum`        | `Array<string \| number>`          | 选项值数组，用于 select/radio/checkbox 等组件                        |
| `enumNames`   | `Array<string \| number>`          | 选项标签数组，与 `enum` 一一对应                                     |
| `rules`       | `ValidatorRule \| ValidatorRule[]` | 校验规则，支持单条或数组                                             |
| `props`       | `Record<string, any>`              | 透传给底层 UI 组件的额外属性，值支持 <code v-pre>{{ }}</code> 表达式 |
| `border`      | `boolean`                          | 是否显示边框                                                         |

## SchemaRaw

`SchemaRaw` 是 Schema 在原始输入时的类型，允许属性值为 <code v-pre>{{ }}</code> 表达式字符串。

```ts
type Stringify<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? Stringify<T[K]> : T[K] | `{{${string}}}`
}

type SchemaRaw = Stringify<SchemaBase>
```

`SchemaRaw` 与 `Schema` 的区别在于：`SchemaRaw` 中的属性值可以是 <code v-pre>{{ }}</code> 表达式字符串，而 `Schema` 中的属性值是表达式求值后的实际值。

## ValueType

```ts
type ValueType = 'string' | 'object' | 'array' | 'number' | 'boolean' | 'date' | (string & {}) // 允许自定义类型
```

| 值          | 说明     | 默认 widget           |
| ----------- | -------- | --------------------- |
| `'string'`  | 字符串   | `input`               |
| `'number'`  | 数字     | `number`              |
| `'boolean'` | 布尔值   | `switch`              |
| `'array'`   | 数组     | `checkbox`            |
| `'date'`    | 日期     | `date`                |
| `'object'`  | 嵌套对象 | 递归渲染 `properties` |

`ValueType` 使用 `(string & {})` 扩展允许传入自定义类型字符串，同时保留类型提示。

## ValidatorRule

校验规则对象的类型定义。

```ts
interface ValidatorRule {
  required?: boolean
  pattern?: RegExp | string
  min?: number
  max?: number
  len?: number
  type?: string
  message?: string
  custom?: (value: any, formData: FormData) => string | true
}
```

详见 [校验规则 API](./rules)。

## FormData

```ts
type FormData = Record<string, any>
```

表单数据对象，key 为字段名，value 为字段值。

## Deps

```ts
type Deps = Record<string, any>
```

外部依赖数据对象，通过组件 `deps` prop 传入，在表达式中通过 `$deps` 访问。

## ErrorMessage

```ts
interface ErrorMessage {
  name: string // 字段名
  error: string[] // 错误信息列表
}
```

校验返回的错误信息结构。`name` 对应字段名，`error` 为该字段的所有错误信息。

## Options

```ts
interface Options {
  label: string
  value: string | number
  props?: Record<string, any>
}
```

选项数据结构，内部将 `enum` / `enumNames` 转换为此格式。
