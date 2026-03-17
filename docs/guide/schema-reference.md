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

字段在表单中的渲染顺序与 `properties` 中的定义顺序一致。

## 字段属性一览

| 属性          | 类型                               | 默认值     | 说明                                            |
| ------------- | ---------------------------------- | ---------- | ----------------------------------------------- |
| `type`        | `ValueType`                        | —          | **必需。** 字段值类型，见下方 [值类型](#值类型) |
| `title`       | `string`                           | —          | 字段显示标签                                    |
| `widget`      | `string`                           | —          | 渲染组件名称，不指定时根据 `type` 自动推断      |
| `required`    | `boolean \| expression`            | `false`    | 是否必填，支持表达式                            |
| `placeholder` | `string`                           | —          | 占位提示文本                                    |
| `disabled`    | `boolean \| expression`            | `false`    | 是否禁用，支持表达式                            |
| `readonly`    | `boolean \| expression`            | `false`    | 是否只读，支持表达式                            |
| `hidden`      | `boolean \| expression`            | `false`    | 是否隐藏，支持表达式                            |
| `displayType` | `'row' \| 'column'`                | 继承组件级 | 标签与输入框的布局方式                          |
| `className`   | `string`                           | —          | 自定义 CSS 类名                                 |
| `border`      | `boolean`                          | 继承组件级 | 是否显示边框                                    |
| `enum`        | `(string \| number)[]`             | —          | 选项值数组，用于 select/radio/checkbox 等       |
| `enumNames`   | `(string \| number)[]`             | —          | 选项标签数组，与 `enum` 一一对应                |
| `rules`       | `ValidatorRule \| ValidatorRule[]` | —          | 校验规则，支持单条或数组                        |
| `props`       | `Record<string, any>`              | —          | 透传给底层 UI 组件的额外属性，值支持表达式      |
| `properties`  | `Record<string, Schema>`           | —          | 嵌套字段定义（`type` 为 `object` 时使用）       |

> `expression` 指 <code v-pre>{{ }}</code> 表达式字符串，详见 [表达式联动](./expressions)。

## 值类型

`type` 属性决定字段的数据类型和默认渲染组件。

| type      | 说明         | 默认 widget             | JS 值类型    |
| --------- | ------------ | ----------------------- | ------------ |
| `string`  | 字符串       | `input`                 | `string`     |
| `number`  | 数字         | `number` / `stepper`    | `number`     |
| `boolean` | 布尔值       | `switch`                | `boolean`    |
| `array`   | 数组（多选） | `checkbox`              | `any[]`      |
| `date`    | 日期         | `date`                  | 取决于适配器 |
| `object`  | 嵌套对象     | 递归渲染子 `properties` | `object`     |

当 Schema 中未指定 `widget` 时，引擎使用以下映射自动选择组件：

```ts
const typeWidgetMap = {
  string: 'input',
  number: 'number',
  boolean: 'switch',
  array: 'checkbox',
  date: 'date',
}
```

## 选项字段

对于 `select`、`radio`、`checkbox`、`picker` 等选项类组件，使用 `enum` 和 `enumNames` 定义选项：

```json
{
  "department": {
    "type": "string",
    "title": "部门",
    "widget": "select",
    "enum": ["engineering", "product", "design"],
    "enumNames": ["工程部", "产品部", "设计部"]
  }
}
```

- `enum` — 选项的实际值，最终存入表单数据
- `enumNames` — 选项的显示标签，与 `enum` 一一对应

## 嵌套对象

当 `type` 为 `object` 时，可以在 `properties` 中定义子字段，实现嵌套数据结构。

```json
{
  "address": {
    "type": "object",
    "title": "地址",
    "properties": {
      "province": {
        "type": "string",
        "title": "省份"
      },
      "city": {
        "type": "string",
        "title": "城市"
      }
    }
  }
}
```

对应的表单数据结构为：

```json
{
  "address": {
    "province": "浙江",
    "city": "杭州"
  }
}
```

## 透传属性

通过 `props` 向底层 UI 组件传递额外属性。`props` 中的值也支持 <code v-pre>{{ }}</code> 表达式。

```json
{
  "quantity": {
    "type": "number",
    "title": "数量",
    "widget": "stepper",
    "props": {
      "min": 1,
      "max": "{{ $values.isVip ? 999 : 99 }}",
      "step": 1
    }
  }
}
```

具体可传哪些属性取决于底层 UI 组件，请参考对应 UI 库的文档。

## 表达式语法

v3sf 支持在 `required`、`disabled`、`readonly`、`hidden` 以及 `props` 中使用 <code v-pre>{{ }}</code> 表达式，实现字段间的动态联动。

### 格式

```
"{{ 表达式 }}"
```

表达式是一个字符串值，以 <code v-pre>{{</code> 开头、<code v-pre>}}</code> 结尾。引擎会实时求值并更新对应属性。

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
- 属性访问：`obj.prop`（支持 null 安全访问）
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

::: warning 安全说明
v3sf 使用自研的表达式引擎（基于 AST 解析 + 求值），**不会调用 `eval` 或 `new Function`**，可安全用于用户输入的 Schema。不支持函数调用和赋值操作。
:::

> 更详细的表达式用法请参阅 [表达式联动](./expressions)。

## 校验规则

通过 `rules` 属性定义字段校验规则，支持单条或数组形式。

### ValidatorRule 属性

| 属性       | 类型                                  | 说明                                                 |
| ---------- | ------------------------------------- | ---------------------------------------------------- |
| `required` | `boolean`                             | 是否必填                                             |
| `pattern`  | `RegExp \| string`                    | 正则校验                                             |
| `min`      | `number`                              | 最小值 / 最小长度                                    |
| `max`      | `number`                              | 最大值 / 最大长度                                    |
| `len`      | `number`                              | 精确长度                                             |
| `type`     | `string`                              | 值类型校验（`string`、`number`、`boolean`、`array`） |
| `message`  | `string`                              | 校验失败提示信息，支持 `${name}` 变量                |
| `custom`   | `(value, formData) => string \| true` | 自定义校验函数                                       |

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
  }
}
```

> 更详细的校验用法请参阅 [表单校验](./validation)。

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
