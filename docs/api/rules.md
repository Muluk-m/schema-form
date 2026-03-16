# 校验规则 API

`ValidatorRule` 接口的完整属性参考。

## ValidatorRule

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

## 属性说明

### required

- **类型：** `boolean`
- **说明：** 是否必填

校验值是否为空。以下情况视为空值：

- `null` 或 `undefined`
- 空字符串或仅含空格的字符串（`''`、`'  '`）
- 空数组（`[]`）

```ts
{ required: true, message: '此字段不能为空' }
```

### pattern

- **类型：** `RegExp | string`
- **说明：** 正则校验

使用正则表达式校验字段值。仅在值非空时校验。

```ts
// 字符串形式
{ pattern: '^1[3-9]\\d{9}$', message: '手机号格式不正确' }

// RegExp 对象（仅在 TypeScript 代码中可用，JSON Schema 中请使用字符串）
{ pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' }
```

### min

- **类型：** `number`
- **说明：** 最小值/最小长度

根据值的类型选择校验方式：

| 值类型   | 校验规则              | 默认错误信息              |
| -------- | --------------------- | ------------------------- |
| `string` | `value.length >= min` | `${name}至少${min}个字符` |
| `number` | `value >= min`        | `${name}不能小于${min}`   |
| `array`  | `value.length >= min` | `${name}至少选择${min}项` |

```ts
{ min: 2, message: '至少 2 个字符' }
```

### max

- **类型：** `number`
- **说明：** 最大值/最大长度

与 `min` 类似，校验上限：

| 值类型   | 校验规则              | 默认错误信息                  |
| -------- | --------------------- | ----------------------------- |
| `string` | `value.length <= max` | `${name}不能超过${max}个字符` |
| `number` | `value <= max`        | `${name}不能大于${max}`       |
| `array`  | `value.length <= max` | `${name}最多选择${max}项`     |

```ts
{ max: 100, message: '不能超过 100' }
```

### len

- **类型：** `number`
- **说明：** 精确长度

校验字符串或数组的精确长度：

```ts
{ len: 11, message: '长度必须为 11 位' }
```

### type

- **类型：** `string`
- **说明：** 值类型校验

校验值的 JavaScript 类型。支持的类型：

| type 值     | 校验方式                                     |
| ----------- | -------------------------------------------- |
| `'string'`  | `typeof value === 'string'`                  |
| `'number'`  | `typeof value === 'number' && !isNaN(value)` |
| `'boolean'` | `typeof value === 'boolean'`                 |
| `'array'`   | `Array.isArray(value)`                       |

```ts
{ type: 'number', message: '必须为数字' }
```

### message

- **类型：** `string`
- **说明：** 校验失败提示信息

自定义错误提示信息，支持 `${name}` 等变量模板：

```ts
{ required: true, message: '${name}不能为空' }
// 如果字段 title 为 "用户名"，则显示 "用户名不能为空"
```

支持的模板变量：

| 变量      | 来源            |
| --------- | --------------- |
| `${name}` | 字段的 `title`  |
| `${min}`  | 规则的 `min` 值 |
| `${max}`  | 规则的 `max` 值 |
| `${len}`  | 规则的 `len` 值 |

如果未指定 `message`，使用内置的默认中文错误信息。

### custom

- **类型：** `(value: any, formData: FormData) => string | true`
- **说明：** 自定义校验函数

返回值规则：

- 返回 `true` — 校验通过
- 返回字符串 — 校验失败，字符串为错误信息

```ts
{
  custom: (value, formData) => {
    if (value !== formData.password) return '两次密码不一致'
    return true
  }
}
```

`custom` 函数的两个参数：

- `value` — 当前字段的值
- `formData` — 整个表单的数据对象

## 使用方式

### 单条规则

```ts
rules: { required: true, message: '请输入' }
```

### 多条规则（数组）

```ts
rules: [
  { required: true, message: '请输入用户名' },
  { min: 2, max: 20, message: '长度 2-20 个字符' },
  { pattern: '^[a-zA-Z0-9_]+$', message: '只能包含字母、数字和下划线' },
]
```

### 结合 required 字段属性

Schema 中的 `required: true` 会自动生成一条 `{ required: true }` 规则。如果同时在 `rules` 中也定义了 `required`，两者都会执行。

```ts
// 以下两种写法等价
{
  required: true
}
{
  rules: {
    required: true
  }
}
```

## ValidatorAdapter

外部校验适配器接口，用于替换内置校验逻辑。

```ts
interface ValidatorAdapter {
  validate: (value: any, rules: ValidatorRule[], fieldSchema: Schema) => Promise<string[]>
}
```

- `value` — 字段当前值
- `rules` — 合并后的校验规则数组（包含 Schema 级 `required` 和 `rules` 中的规则）
- `fieldSchema` — 字段的完整 Schema
- 返回 — 错误信息数组，空数组表示通过
