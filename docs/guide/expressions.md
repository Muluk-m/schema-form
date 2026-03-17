# 表达式联动

v3sf 内置了一个安全的表达式引擎，通过 <code v-pre>{{ }}</code> 语法实现字段间的动态联动。

::: demo 表达式联动示例
linkage/demo1
:::

## 基本语法

表达式以字符串形式写在 Schema 属性值中，格式为：

```
"{{ 表达式内容 }}"
```

引擎会在表单数据变化时实时求值，并将结果更新到对应属性。

### 支持表达式的属性

以下 Schema 属性支持 <code v-pre>{{ }}</code> 表达式：

- `required` — 动态必填
- `disabled` — 动态禁用
- `readonly` — 动态只读
- `hidden` — 动态显隐
- `props` 中的任意值 — 动态组件属性

```json
{
  "discountCode": {
    "type": "string",
    "title": "优惠码",
    "hidden": "{{ !$values.hasDiscount }}",
    "required": "{{ $values.hasDiscount }}",
    "disabled": "{{ $values.isLocked }}",
    "props": {
      "maxlength": "{{ $values.isVip ? 20 : 10 }}"
    }
  }
}
```

## 可用变量

表达式中可以使用以下变量访问数据：

| 变量         | 类型                  | 说明               |
| ------------ | --------------------- | ------------------ |
| `$values`    | `Record<string, any>` | 整个表单的数据对象 |
| `$selfValue` | `any`                 | 当前字段自身的值   |
| `$deps`      | `Record<string, any>` | 外部依赖数据       |

### `$values` — 表单数据

通过 `$values.字段名` 访问表单中任意字段的当前值：

```json
{
  "hidden": "{{ $values.type !== 'other' }}",
  "required": "{{ $values.age >= 18 }}"
}
```

### `$selfValue` — 当前字段值

用于在 `props` 表达式中引用当前字段自身的值：

```json
{
  "score": {
    "type": "number",
    "title": "评分",
    "props": {
      "class": "{{ $selfValue >= 80 ? 'high-score' : 'low-score' }}"
    }
  }
}
```

### `$deps` — 外部依赖

通过组件的 `deps` prop 传入的外部数据，在表达式中通过 `$deps` 访问：

```vue
<template>
  <SchemaForm v-model="formData" :schema="schema" :deps="{ userRole: 'admin' }" />
</template>
```

```json
{
  "adminOnly": {
    "type": "string",
    "title": "管理员配置",
    "hidden": "{{ $deps.userRole !== 'admin' }}"
  }
}
```

## 支持的运算符

### 比较运算符

| 运算符 | 说明       | 示例                                                 |
| ------ | ---------- | ---------------------------------------------------- |
| `===`  | 严格等于   | <code v-pre>{{ $values.status === 'active' }}</code> |
| `!==`  | 严格不等于 | <code v-pre>{{ $values.type !== 'default' }}</code>  |
| `==`   | 宽松等于   | <code v-pre>{{ $values.count == 0 }}</code>          |
| `!=`   | 宽松不等于 | <code v-pre>{{ $values.name != '' }}</code>          |
| `<`    | 小于       | <code v-pre>{{ $values.age < 18 }}</code>            |
| `<=`   | 小于等于   | <code v-pre>{{ $values.score <= 60 }}</code>         |
| `>`    | 大于       | <code v-pre>{{ $values.price > 100 }}</code>         |
| `>=`   | 大于等于   | <code v-pre>{{ $values.quantity >= 1 }}</code>       |

### 逻辑运算符

| 运算符 | 说明   | 示例                                                         |
| ------ | ------ | ------------------------------------------------------------ |
| `&&`   | 逻辑与 | <code v-pre>{{ $values.agree && $values.age >= 18 }}</code>  |
| `\|\|` | 逻辑或 | <code v-pre>{{ $values.isVip \|\| $values.isMember }}</code> |
| `!`    | 逻辑非 | <code v-pre>{{ !$values.disabled }}</code>                   |

### 算术运算符

| 运算符 | 说明 | 示例                                                          |
| ------ | ---- | ------------------------------------------------------------- |
| `+`    | 加法 | <code v-pre>{{ $values.price + $values.tax }}</code>          |
| `-`    | 减法 | <code v-pre>{{ $values.total - $values.discount }}</code>     |
| `*`    | 乘法 | <code v-pre>{{ $values.quantity * $values.unitPrice }}</code> |
| `/`    | 除法 | <code v-pre>{{ $values.total / $values.count }}</code>        |
| `%`    | 取模 | <code v-pre>{{ $values.index % 2 }}</code>                    |

### 三元运算符

```json
{
  "props": {
    "label": "{{ $values.age >= 18 ? '成人' : '未成年' }}"
  }
}
```

### 属性访问

支持点号（`.`）链式访问对象属性，内置 null 安全机制（当对象为 `null` 或 `undefined` 时返回 `undefined` 而不是报错）：

```json
{
  "hidden": "{{ $values.address.province === '北京' }}"
}
```

### 字面量

表达式中可以使用以下字面量：

- 数字：`0`、`3.14`、`-1`
- 字符串：`'hello'`、`"world"`
- 布尔值：`true`、`false`
- 空值：`null`、`undefined`

## 常见模式

### 条件显隐

根据其他字段的值控制当前字段的显示和隐藏：

```json
{
  "employeeType": {
    "type": "string",
    "title": "员工类型",
    "widget": "radio",
    "enum": ["fulltime", "parttime", "intern"],
    "enumNames": ["全职", "兼职", "实习"]
  },
  "salary": {
    "type": "number",
    "title": "月薪",
    "hidden": "{{ $values.employeeType === 'intern' }}"
  },
  "internDuration": {
    "type": "number",
    "title": "实习时长（月）",
    "hidden": "{{ $values.employeeType !== 'intern' }}"
  }
}
```

### 动态必填

根据条件控制字段是否必填：

```json
{
  "hasInvoice": {
    "type": "boolean",
    "title": "需要发票",
    "widget": "switch"
  },
  "invoiceTitle": {
    "type": "string",
    "title": "发票抬头",
    "required": "{{ $values.hasInvoice }}",
    "hidden": "{{ !$values.hasInvoice }}"
  },
  "taxNumber": {
    "type": "string",
    "title": "税号",
    "required": "{{ $values.hasInvoice }}",
    "hidden": "{{ !$values.hasInvoice }}"
  }
}
```

### 动态 props

根据表单数据动态调整组件属性：

```json
{
  "level": {
    "type": "string",
    "title": "等级",
    "widget": "radio",
    "enum": ["normal", "vip"],
    "enumNames": ["普通", "VIP"]
  },
  "amount": {
    "type": "number",
    "title": "购买数量",
    "widget": "stepper",
    "props": {
      "max": "{{ $values.level === 'vip' ? 999 : 10 }}",
      "min": 1
    }
  }
}
```

### 联合条件

使用逻辑运算符组合多个条件：

```json
{
  "specialField": {
    "type": "string",
    "title": "特殊字段",
    "hidden": "{{ !($values.role === 'admin' && $values.mode === 'advanced') }}"
  }
}
```

### 使用外部依赖

通过 `$deps` 引用组件外部传入的数据：

```json
{
  "managerSection": {
    "type": "string",
    "title": "管理配置",
    "hidden": "{{ $deps.currentUser.role !== 'manager' }}"
  }
}
```

## 安全限制

v3sf 的表达式引擎基于自研的 AST（抽象语法树）解析器和求值器，具有以下安全特性：

**不支持的操作：**

- 函数调用 — `$values.list.includes('a')` 不可用
- 赋值操作 — `$values.name = 'test'` 不可用
- `new` 操作符 — 不可创建对象
- 方括号属性访问 — `$values['name']` 不可用
- 模板字符串 — `` `hello ${name}` `` 不可用

**安全保障：**

- 不使用 `eval` 或 `new Function`，完全基于 AST 解析和求值
- 只能读取上下文中的数据，不能修改
- 表达式错误不会导致整个表单崩溃

## 错误处理

当表达式解析或求值失败时：

1. 在开发环境（`NODE_ENV !== 'production'`）下，控制台会输出错误信息
2. 表达式返回 `undefined`
3. 表单继续正常工作，不会崩溃

常见错误及排查方式：

| 错误场景                   | 原因                    | 解决方案                     |
| -------------------------- | ----------------------- | ---------------------------- |
| 字段一直隐藏               | 表达式结果始终为 `true` | 检查变量名是否拼写正确       |
| 控制台报 `ExpressionError` | 表达式语法错误          | 检查括号、引号是否匹配       |
| 值为 `undefined`           | 字段尚未赋值            | 确保初始表单数据包含所需字段 |
| 函数调用报错               | 不支持函数调用          | 改用运算符实现等价逻辑       |

## 编程式使用

v3sf 导出了 `compileExpression` 函数，可以在代码中单独使用表达式引擎：

```ts
import { compileExpression } from '@v3sf/core'

const expr = compileExpression('$values.age >= 18 && $values.agree')

const result = expr({
  $values: { age: 20, agree: true },
})
// result: true
```
