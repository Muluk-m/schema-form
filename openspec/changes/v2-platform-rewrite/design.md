## Context

v3sf 是一个 Vue 3 JSON Schema 表单生成器，当前版本 0.4.0。核心问题：与 Vant UI 强绑定、表达式引擎有安全漏洞、依赖全面落后 2-4 年、测试覆盖不足 10%。目标是重写为 UI 无关、AI 友好、轻量（core < 10KB gzipped）的 v2.0 平台。

当前包结构：

- `vue3-schema-form` (core + vant widgets 混在一起)
- `@v3sf/shared` (小型工具函数)
- `@v3sf/generator` (半成品拖拽构建器)
- 两个 example 应用 + 一个 docs 站

## Goals / Non-Goals

**Goals:**

- Core 引擎与 UI 框架完全解耦，通过 Adapter 协议接入任意 UI 库
- 核心包零运行时外部依赖，gzipped < 10KB
- 表达式引擎安全无漏洞，支持编译时校验
- 校验系统可插拔，内置轻量校验器覆盖常见场景
- 完善的 TypeScript 类型，strict mode，schema 类型推导
- AI 友好：Meta Schema 自描述、prompt 模板、BYOK AI 生成
- Generator 功能完整可用，Playground 独立部署
- 首批提供 Vant 4 和 Element Plus 两个适配器

**Non-Goals:**

- 不做 React / Svelte 版本（仅 Vue 3）
- 不做 SSR 支持（表单场景极少需要）
- 不做后端服务（AI 集成采用 BYOK 前端直调）
- 不做 CLI 脚手架工具
- 不做 Naive UI 适配器（留给社区或后续版本）
- 不做表单数据持久化/提交逻辑

## Decisions

### 1. UI 解耦：Adapter 协议 + propsMap 映射

**决策**: 采用带 propsMap 的适配器模式（方案 B），而非简单组件映射表。

**原因**: 不同 UI 库的 prop 命名差异大（Vant 用 `error-message`，Element Plus 用 `validateMessage`）。propsMap 让用户写一份 schema 可以无缝切换 UI 库，不会把 UI 差异泄漏到业务代码。

**替代方案**:

- 简单组件映射表（方案 A）：更轻但用户 schema 会绑定特定 UI 库的 prop 名
- HOC 包装（每个 widget 包一层）：过重，增加运行时开销

**API 设计**:

```ts
// @v3sf/vant
export default defineAdapter({
  widgets: {
    input: {
      component: VanField,
      propsMap: { error: 'error-message', label: 'label' },
    },
    number: { component: VanStepper },
    switch: { component: VanSwitch },
    // ...
  },
  // 全局 props 映射（所有 widget 共享）
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})

// 用户代码
import { createSchemaForm } from '@v3sf/core'
import vantAdapter from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)
```

### 2. 构建工具：tsdown

**决策**: 从 Rollup 2 迁移至 tsdown。

**原因**: tsdown（rspack 团队出品）基于 Rollup 的 API 但使用 Rust 加速，开箱支持 TypeScript + Vue JSX，配置极简。对比 tsup，tsdown 更新更活跃，性能更好。

**替代方案**:

- Rollup 4：需要手动配一堆插件，当前 6 个 rollup config 文件维护成本高
- tsup：成熟但社区活跃度下降
- unbuild：unjs 生态，但对 Vue JSX 支持不够好

### 3. 表达式引擎：自研 tiny-eval

**决策**: 自研一个约 1-2KB 的表达式引擎，支持词法分析 → AST → 求值。

**支持的表达式语法**:

```
属性访问:   $values.name / $values.address.city
比较:       === !== > < >= <=
逻辑:       && || !
三元:       condition ? a : b
字面量:     true false null 数字 字符串
算术:       + - * / %（基础数学）
```

**原因**: 分析现有 schema 用例，表达式复杂度不超过上述范围。jexl（8KB）和 expr-eval（5KB）都过重。自研可以做到：

- 编译时校验表达式合法性，提前报错
- 提供友好错误信息（指出表达式哪里写错了）
- 完全沙箱化，零安全风险
- 结果可缓存（相同输入直接返回）

**替代方案**:

- jexl：功能全但体积大，且 Mozilla 已不活跃维护
- expr-eval：不支持属性访问链
- 沿用 Function()：安全风险不可接受

### 4. 校验系统：pluggable 架构

**决策**: core 内置极简校验器，高级校验通过 adapter 接入。

**内置校验器** (~2KB):

- `required`: 非空检查
- `pattern`: 正则匹配
- `min` / `max`: 数值范围 / 字符串长度
- `type`: 基础类型检查
- `custom`: 用户自定义函数 `(value, formData) => string | true`

**可选适配器**:

- `@v3sf/validator-async`: async-validator 适配（向后兼容）
- 未来可加 zod / valibot 适配

**原因**: 80% 的表单只用到 required + pattern + min/max。内置这些让核心包保持轻量，复杂场景按需引入。

### 5. 测试框架：Vitest

**决策**: 从 Jest 27 迁移至 Vitest。

**原因**: 与 Vite 生态统一、原生 ESM 支持、配置更简单、速度更快。当前 Jest 配置需要 Babel 转译 Vue JSX，Vitest 原生支持。

### 6. shared 包合入 core

**决策**: 删除独立的 `@v3sf/shared` 包，工具函数直接放入 `@v3sf/core/utils`。

**原因**: shared 仅 ~200 行代码（UID、数组工具、BEM 命名），独立发包增加维护成本和依赖管理复杂度。合入 core 后通过 tree-shaking 不会增加用户 bundle 大小。

### 7. AI 集成：BYOK + Meta Schema

**决策**: AI 生成功能采用 BYOK（Bring Your Own Key），用户在 Playground 中填入自己的 API Key，前端直调 LLM API。

**原因**: 零后端成本、零运维、用户数据不经过第三方服务器。

**Meta Schema**: 发布一份 JSON Schema 格式的 `schema.meta.json`，描述 v3sf schema 自身的结构。用途：

- AI 生成 schema 时作为 function calling 的参数定义
- IDE 中 JSON 编辑时提供自动补全
- 运行时校验用户 schema 合法性

### 8. Playground 架构

**决策**: 基于 Generator 扩展，增加 AI 对话栏 + 示例模板 + 独立部署。

**技术栈**: Vue 3 + Vite，不依赖 @vue/repl（太重且偏开发者）。三栏布局：组件面板 / 拖拽画布 / Schema 编辑器（Monaco Editor），顶部 AI 对话栏。

## Risks / Trade-offs

**[自研表达式引擎复杂度]** → 限制支持的语法范围，保持 <500 行代码。充分测试边界场景。如果后续需要更复杂表达式，可以替换为 jexl 而不影响用户 API（{{ }} 语法不变）。

**[Vant 3 → 4 Breaking Changes]** → Vant 4 有大量 API 变更。由于 widget 本身在独立包 `@v3sf/vant` 中，影响范围被隔离。需要逐个 widget 检查 API 兼容性。

**[BYOK AI 的 CORS 限制]** → 部分 LLM API 不支持浏览器直调（如 OpenAI 部分端点）。Mitigation: 支持多家模型 API（DeepSeek、通义千问等国内模型通常支持），Playground 可选配代理地址。

**[Core < 10KB 目标]** → 表达式引擎 + 内置校验器 + Schema 解析器 + Widget Registry + 渲染器全放在一起可能超标。Mitigation: 持续监控 bundle size，表达式引擎和校验器支持 tree-shake（用户不用联动/校验时不打包）。

**[迁移成本]** → v1 用户需要拆 import 路径、注册 adapter、调整 schema（如果用了 Vant 特有 props）。Mitigation: 提供 codemod 脚本 + 迁移文档。
