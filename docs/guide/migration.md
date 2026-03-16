# v1 到 v2 迁移指南

本文档帮助你从 v1（`v3-schema-form`）迁移到 v2（`@v3sf/*`）。

## 主要变更概览

| 项目       | v1               | v2                                                 |
| ---------- | ---------------- | -------------------------------------------------- |
| 包名       | `v3-schema-form` | `@v3sf/core` + `@v3sf/vant` / `@v3sf/element-plus` |
| 架构       | 单包，内置 Vant  | 核心 + 适配器，UI 无关                             |
| 表达式引擎 | 基于 `eval`      | 自研 AST 安全引擎                                  |
| 构建工具   | rollup           | tsdown                                             |
| 类型系统   | 部分类型         | 全量 TypeScript，完整类型导出                      |
| AI 支持    | 无               | `@v3sf/ai` 包                                      |

## 包名变更

```bash
# 卸载 v1
pnpm remove v3-schema-form

# 安装 v2（移动端）
pnpm add @v3sf/core @v3sf/vant

# 安装 v2（PC 端）
pnpm add @v3sf/core @v3sf/element-plus
```

## 导入方式变更

### v1

```ts
import SchemaForm from 'v3-schema-form'
```

`SchemaForm` 是一个现成的 Vue 组件，内置了 Vant。

### v2

```ts
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)
```

需要显式选择适配器并创建组件。这一设计使得核心库不依赖任何特定 UI 框架。

## 模板使用方式不变

```vue
<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

`v-model`、`:schema`、`ref` 等模板写法保持一致，无需修改。

## Schema 格式兼容

v2 的 Schema 格式与 v1 **完全兼容**。以下属性均无变化：

- `type`、`title`、`widget`
- `required`、`placeholder`、`disabled`、`readonly`、`hidden`
- `enum`、`enumNames`
- `rules`、`props`
- `displayType`、`className`、`border`
- `properties`（嵌套对象）

## 表达式引擎变更

v2 使用自研的安全表达式引擎替代了 `eval`，语法保持不变：

```json
{
  "hidden": "{{ !$values.agree }}",
  "required": "{{ $values.type === 'other' }}"
}
```

### 不兼容的变更

v2 的表达式引擎**不支持函数调用**。以下 v1 中可用的写法在 v2 中不再支持：

```json
// v1 可用，v2 不可用
{
  "hidden": "{{ $values.list.includes('a') }}",
  "required": "{{ $values.name.length > 0 }}"
}
```

**替代方案：**

| v1 写法                      | v2 替代写法                               |
| ---------------------------- | ----------------------------------------- |
| `$values.list.includes('a')` | 使用自定义组件处理逻辑                    |
| `$values.name.length > 0`    | `$values.name !== ''` 或 `!!$values.name` |
| `$values.arr.length`         | 使用 `$deps` 传入计算值                   |

### 安全性提升

v2 的表达式引擎基于 AST 解析，不使用 `eval` 或 `new Function`，可安全处理用户输入的 Schema。

## 自定义组件变更

### v1

直接注册到 Vue 全局：

```ts
app.component('CustomWidget', MyWidget)
```

### v2

通过适配器注册：

```ts
import { defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const adapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    customWidget: { component: MyWidget },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

### 获取表单上下文

v2 中自定义组件可使用 `useAddon()` hook 获取表单上下文：

```ts
import { useAddon } from '@v3sf/core'

const addon = useAddon()
// addon.value.getFormData()
// addon.value.setFormData({ ... })
// addon.value.validate()
```

## 新增功能

v2 带来了以下新功能，迁移后可以立即使用：

### Element Plus 适配器

v2 新增 PC 端支持，使用完全相同的 Schema：

```ts
import { createSchemaForm } from '@v3sf/core'
import { elementPlusAdapter } from '@v3sf/element-plus'

const SchemaForm = createSchemaForm(elementPlusAdapter)
```

### AI 生成表单

安装 `@v3sf/ai` 即可使用 AI 生成 Schema：

```ts
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'
```

详见 [AI 集成](./ai-integration)。

### 完整的 TypeScript 支持

v2 导出了所有类型定义：

```ts
import type {
  Schema,
  SchemaBase,
  FormRef,
  ErrorMessage,
  ValidatorRule,
  WidgetAdapter,
  WidgetDefinition,
  WidgetStandardProps,
  FieldWidgetAddon,
} from '@v3sf/core'
```

## 迁移清单

按以下步骤逐一完成迁移：

- [ ] 卸载 `v3-schema-form`，安装 `@v3sf/core` 和对应的适配器包
- [ ] 将 `import SchemaForm from 'v3-schema-form'` 改为 `createSchemaForm` + 适配器
- [ ] 检查表达式中是否使用了函数调用语法（如 `.includes()`、`.length` 等），如有需改写
- [ ] 如有自定义组件，迁移到适配器注册方式
- [ ] 运行项目，确认表单渲染和校验正常
- [ ] （可选）安装 `@v3sf/ai` 体验 AI 生成表单功能
- [ ] （可选）将类型导入改为 `@v3sf/core` 的类型
