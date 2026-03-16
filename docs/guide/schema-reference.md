# Schema 配置参考

完整的 v3sf Schema 结构和字段属性说明。

## 根节点结构

每个 Schema 的根节点必须是一个 `type: 'object'` 对象，通过 `properties` 定义表单字段。

```json
{
  "type": "object",
  "properties": {
    "fieldName": {
      "type": "string",
      "title": "字段标签"
    }
  }
}
```

## 字段属性

| 属性          | 类型                    | 说明                                            |
| ------------- | ----------------------- | ----------------------------------------------- |
| `type`        | `string`                | **必需。** 字段值类型，见下方 [值类型](#值类型) |
| `title`       | `string`                | 字段显示标签                                    |
| `widget`      | `string`                | 渲染组件名称，不指定时根据 `type` 自动推断      |
| `required`    | `boolean \| expression` | 是否必填                                        |
| `placeholder` | `string`                | 占位提示文本                                    |
| `disabled`    | `boolean \| expression` | 是否禁用                                        |
| `readonly`    | `boolean \| expression` | 是否只读                                        |
| `hidden`      | `boolean \| expression` | 是否隐藏                                        |
| `displayType` | `'row' \| 'column'`     | 标签与输入框的布局方式                          |
| `className`   | `string`                | 自定义 CSS 类名                                 |
| `border`      | `boolean`               | 是否显示边框                                    |
| `enum`        | `(string \| number)[]`  | 选项值数组，用于 select/radio/checkbox 等       |
| `enumNames`   | `(string \| number)[]`  | 选项标签数组，与 `enum` 一一对应                |
| `rules`       | `Rule \| Rule[]`        | 校验规则                                        |
| `props`       | `object`                | 透传给底层组件的额外属性                        |
| `properties`  | `Record<string, Field>` | 嵌套字段（`type` 为 `object` 时使用）           |

## 值类型

| type      | 说明         | 默认组件                |
| --------- | ------------ | ----------------------- |
| `string`  | 字符串       | `input`                 |
| `number`  | 数字         | `number` / `stepper`    |
| `boolean` | 布尔值       | `switch`                |
| `array`   | 数组（多选） | `checkbox`              |
| `date`    | 日期         | `date`                  |
| `object`  | 嵌套对象     | 递归渲染子 `properties` |

## 表达式语法

v3sf 支持在 `required`、`disabled`、`readonly`、`hidden` 以及 `props` 中使用 `{{ }}` 表达式，实现字段间的动态联动。

### 格式

```
"{{ 表达式 }}"
```

表达式是一个字符串值，以 `{{` 开头、`}}` 结尾。引擎会实时求值并更新对应属性。

### 可用变量

| 变量         | 说明                                                        |
| ------------ | ----------------------------------------------------------- |
| `$values`    | 整个表单的数据对象，通过 `$values.fieldName` 访问任意字段值 |
| `$selfValue` | 当前字段自身的值                                            |
| `$deps`      | 外部依赖数据（通过组件的 `deps` prop 传入）                 |

### 支持的运算符

- 比较：`===`、`!==`、`==`、`!=`、`<`、`<=`、`>`、`>=`
- 逻辑：`&&`、`||`、`!`
- 算术：`+`、`-`、`*`、`/`、`%`
- 三元：`条件 ? 值A : 值B`
- 属性访问：`obj.prop`
- 字面量：数字、字符串（`'...'` 或 `"..."`）、`true`、`false`、`null`、`undefined`

### 示例

```json
{
  "hidden": "{{ $values.type !== 'other' }}",
  "required": "{{ $values.age >= 18 }}",
  "disabled": "{{ !$values.agree }}",
  "props": {
    "max": "{{ $values.quantity > 10 ? 100 : 50 }}"
  }
}
```

::: warning 安全提示
v3sf 使用自研的表达式引擎（基于 AST 解析 + 求值），**不会调用 `eval` 或 `new Function`**，可安全用于用户输入的 Schema。
:::

## 校验规则

通过 `rules` 属性定义字段校验规则，支持单条或数组形式。

### Rule 属性

| 属性       | 类型                                  | 说明                                                         |
| ---------- | ------------------------------------- | ------------------------------------------------------------ |
| `required` | `boolean`                             | 是否必填                                                     |
| `pattern`  | `RegExp \| string`                    | 正则校验                                                     |
| `min`      | `number`                              | 最小值 / 最小长度                                            |
| `max`      | `number`                              | 最大值 / 最大长度                                            |
| `len`      | `number`                              | 精确长度                                                     |
| `type`     | `string`                              | 值类型校验                                                   |
| `message`  | `string`                              | 校验失败提示信息                                             |
| `custom`   | `(value, formData) => string \| true` | 自定义校验函数，返回 `true` 表示通过，返回字符串表示错误信息 |

### 示例

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
  },
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

### 自定义校验

```ts
const schema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      title: '密码',
      rules: {
        custom: (value, formData) => {
          if (value && value.length < 8) return '密码至少 8 个字符'
          if (!/[A-Z]/.test(value)) return '密码必须包含大写字母'
          return true
        },
      },
    },
  },
}
```

## FormRef 实例方法

通过 `ref` 获取表单实例后，可调用以下方法：

| 方法                                     | 类型                                              | 说明                       |
| ---------------------------------------- | ------------------------------------------------- | -------------------------- |
| `getFormData()`                          | `() => FormData`                                  | 获取当前表单数据           |
| `validate(scrollToError?)`               | `(boolean?) => Promise<ErrorMessage[]>`           | 校验全部字段，返回错误列表 |
| `validateFields(fields, scrollToError?)` | `(string[], boolean?) => Promise<ErrorMessage[]>` | 校验指定字段               |

`ErrorMessage` 结构：

```ts
interface ErrorMessage {
  name: string // 字段名
  error: string[] // 错误信息列表
}
```

## 完整示例

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "姓名",
      "required": true,
      "placeholder": "请输入姓名",
      "rules": { "required": true, "message": "请输入姓名" }
    },
    "gender": {
      "type": "string",
      "title": "性别",
      "widget": "radio",
      "enum": ["male", "female"],
      "enumNames": ["男", "女"]
    },
    "age": {
      "type": "number",
      "title": "年龄",
      "widget": "stepper",
      "rules": { "min": 1, "max": 150, "message": "请输入有效年龄" }
    },
    "department": {
      "type": "string",
      "title": "部门",
      "widget": "select",
      "enum": ["engineering", "product", "design"],
      "enumNames": ["工程部", "产品部", "设计部"]
    },
    "startDate": {
      "type": "date",
      "title": "入职日期",
      "widget": "date",
      "required": true
    },
    "isManager": {
      "type": "boolean",
      "title": "是否管理层",
      "widget": "switch"
    },
    "teamSize": {
      "type": "number",
      "title": "团队人数",
      "widget": "stepper",
      "hidden": "{{ !$values.isManager }}",
      "required": "{{ $values.isManager }}"
    }
  }
}
```
