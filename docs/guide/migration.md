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
# v1
npm install v3-schema-form

# v2
npm install @v3sf/core @v3sf/vant    # 移动端
npm install @v3sf/core @v3sf/element-plus  # PC 端
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

需要显式选择适配器并创建组件。

## 模板使用方式不变

```vue
<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

`v-model`、`:schema`、`ref` 等模板写法保持一致。

## Schema 格式兼容

v2 的 Schema 格式与 v1 **完全兼容**。字段属性（`type`、`title`、`widget`、`required`、`enum`、`enumNames`、`rules`、`props` 等）均无变化。

## 表达式引擎变更

v2 使用自研的安全表达式引擎替代了 `eval`，语法保持不变：

```json
{
  "hidden": "{{ !$values.agree }}",
  "required": "{{ $values.type === 'other' }}"
}
```

**注意事项：**

- v2 的表达式引擎不支持函数调用（如 `{{ $values.list.includes('a') }}`），仅支持属性访问、运算符和字面量
- 如果 v1 中使用了函数调用表达式，需要改写为等价的运算符表达式，或使用自定义组件处理

## 自定义组件变更

### v1

直接注册到全局：

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

自定义组件可使用 `useAddon()` hook 获取表单上下文。

## 迁移清单

按以下步骤逐一完成迁移：

- [ ] 卸载 `v3-schema-form`，安装 `@v3sf/core` 和对应的适配器包
- [ ] 将 `import SchemaForm from 'v3-schema-form'` 改为 `createSchemaForm` + 适配器
- [ ] 检查表达式中是否使用了函数调用语法（如 `.includes()`、`.length` 等），如有需改写
- [ ] 如有自定义组件，迁移到适配器注册方式
- [ ] 运行项目，确认表单渲染和校验正常
- [ ] （可选）安装 `@v3sf/ai` 体验 AI 生成表单功能
