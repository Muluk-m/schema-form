<p align="center">
  <img src="./logo.svg" width="64" alt="v3sf logo" />
</p>

<h1 align="center">v3sf</h1>

<p align="center">
  AI-Native Form Schema Toolkit
</p>
<p align="center">
  用自然语言生成表单 Schema，自动校验修复，编译为任意框架配置
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@v3sf/core"><img src="https://img.shields.io/npm/v/@v3sf/core?color=a1b858&label=npm" alt="npm version" /></a>
  <a href="https://github.com/Muluk-m/schema-form/actions/workflows/ci.yml"><img src="https://github.com/Muluk-m/schema-form/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/Muluk-m/schema-form/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Muluk-m/schema-form" alt="license" /></a>
</p>

<p align="center">
  <a href="./README.md">中文</a> | <a href="./README.en.md">English</a>
</p>

---

## 特性

- **AI 原生** — `createGenerator()` 一行接入任意 LLM，自然语言 → 表单 Schema，自动校验修复
- **独立表达式引擎** — [`safe-template-expr`](./packages/safe-template-expr) 零依赖、AST 编译、无 eval，可独立使用
- **框架无关 Schema** — [`@v3sf/schema`](./packages/schema) 纯类型 + 校验 + 标准化，不依赖任何 UI 框架
- **UI 适配器** — 通过适配器接入任意组件库（内置 Vant、Element Plus）
- **轻量** — 核心包 gzipped < 8KB，零外部运行时依赖
- **可插拔校验** — 内置轻量校验器覆盖 80% 场景，可选接入 async-validator / zod
- **TypeScript** — 严格模式，完整类型推导
- **可视化构建** — Generator 拖拽构建器 + Playground 在线编辑

## 快速开始

```bash
# 安装核心 + UI 适配器
pnpm add @v3sf/core @v3sf/vant
# 或
pnpm add @v3sf/core @v3sf/element-plus
```

```vue
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import vantAdapter from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)

const formData = ref({ name: '', age: 0, subscribe: false })

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      placeholder: '请输入姓名',
    },
    age: {
      type: 'number',
      title: '年龄',
      rules: { min: 0, max: 150 },
    },
    subscribe: {
      type: 'boolean',
      title: '订阅通知',
    },
    bio: {
      type: 'string',
      title: '个人简介',
      widget: 'textarea',
      hidden: '{{ !$values.subscribe }}',
    },
  },
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

一行代码切换 UI 库：

```ts
// 移动端 → Vant
import vantAdapter from '@v3sf/vant'
const SchemaForm = createSchemaForm(vantAdapter)

// 桌面端 → Element Plus
import elementPlusAdapter from '@v3sf/element-plus'
const SchemaForm = createSchemaForm(elementPlusAdapter)
```

## 包一览

| 包                                            | 说明                              | 版本                                                                                                           |
| --------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [@v3sf/core](./packages/core)                 | UI 无关的表单引擎                 | [![npm](https://img.shields.io/npm/v/@v3sf/core?label=)](https://npmjs.com/package/@v3sf/core)                 |
| [@v3sf/vant](./packages/vant)                 | Vant 4 适配器                     | [![npm](https://img.shields.io/npm/v/@v3sf/vant?label=)](https://npmjs.com/package/@v3sf/vant)                 |
| [@v3sf/element-plus](./packages/element-plus) | Element Plus 适配器               | [![npm](https://img.shields.io/npm/v/@v3sf/element-plus?label=)](https://npmjs.com/package/@v3sf/element-plus) |
| [@v3sf/ai](./packages/ai)                     | AI 工具包（Prompt / 校验 / 示例） | [![npm](https://img.shields.io/npm/v/@v3sf/ai?label=)](https://npmjs.com/package/@v3sf/ai)                     |
| [@v3sf/generator](./packages/generator)       | 可视化拖拽构建器                  | [![npm](https://img.shields.io/npm/v/@v3sf/generator?label=)](https://npmjs.com/package/@v3sf/generator)       |

## 架构

```
@v3sf/core（引擎）
  ├── Schema 解析器
  ├── 表达式引擎（Tokenizer → Parser → AST → Evaluator）
  ├── 校验系统（内置 + ValidatorAdapter 接口）
  └── Widget 适配协议（defineAdapter / createSchemaForm）
        │
    ┌───┴────────────┐
    │                │
@v3sf/vant     @v3sf/element-plus
 (移动端)          (桌面端)
```

## 表达式联动

支持 `{{ }}` 语法实现字段联动，安全的 AST 引擎执行：

```json
{
  "hidden": "{{ $values.age < 18 }}",
  "required": "{{ $values.type === 'vip' }}",
  "disabled": "{{ !$values.agreed }}",
  "props": {
    "rows": "{{ $values.type === 'long' ? 6 : 3 }}"
  }
}
```

## AI 集成

```ts
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

// 1. 用 prompt 引导 LLM 生成 schema
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: generateSchemaPrompt('做一个请假申请表') },
]

// 2. 校验并修复 AI 输出
const { schema, errors, fixed } = validateAndRepair(aiOutput)
```

## 本地开发

```bash
pnpm install          # 安装依赖
pnpm build            # 构建所有库包
pnpm test             # 运行测试（151 tests）
pnpm lint             # ESLint 检查
pnpm dev:vue3         # Vant 示例应用
```

## 文档

- [快速开始](./docs/guide/getting-started.md)
- [Schema 参考](./docs/guide/schema-reference.md)
- [表达式联动](./docs/guide/expressions.md)
- [自定义组件](./docs/guide/custom-widgets.md)
- [适配器开发](./docs/guide/adapters.md)
- [AI 集成](./docs/guide/ai-integration.md)

## 贡献

欢迎提交 Issue 和 Pull Request。请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## License

[MIT](./LICENSE)
