## Why

v3sf 是一个基于 JSON Schema 的 Vue 3 表单生成器，但项目已停滞两年多：核心依赖（TypeScript 4.2、Vue 3.2、Rollup 2、ESLint 7）严重落后，与 Vant UI 强绑定限制了适用场景，表达式引擎存在安全漏洞（`Function()` 任意执行），测试覆盖率不足 10%。同时，市面上没有一个 Vue schema form 方案同时做到"UI 无关 + 真正轻量 + AI 友好"。现在是重写为 v2.0 平台的最佳时机。

## What Changes

- **BREAKING** 核心包从 `v3-schema-form` 重命名为 `@v3sf/core`，与 UI 组件完全解耦
- **BREAKING** Vant widget 拆出为独立适配器包 `@v3sf/vant`（升级至 Vant 4）
- **BREAKING** 构建系统从 Rollup 2 替换为 tsdown
- **BREAKING** 测试框架从 Jest 27 迁移至 Vitest
- 新增 `@v3sf/element-plus` 适配器包
- 新增 Widget Adapter 协议（`defineAdapter` / `defineWidget`），支持任意 UI 库接入
- 自研轻量表达式引擎替换 `Function()` 实现，支持编译时校验
- 校验系统重构为 pluggable 架构，内置轻量校验器 + 可选外部适配
- Generator 基于新 core 重写，补全 undo/redo、键盘快捷键等功能
- 新增 Playground 应用：拖拽构建 + schema 编辑 + AI 对话生成
- 新增 `@v3sf/ai` 包：Meta Schema 定义、prompt 模板、schema 校验工具
- 全面升级依赖：TypeScript 5.7+、Vue 3.5+、pnpm 10+、ESLint 9
- 启用 TypeScript strict mode，消除所有 `any`
- 发布 Schema 的 Meta Schema（`schema.meta.json`），让 AI 和 IDE 都能校验 schema

## Capabilities

### New Capabilities

- `widget-adapter`: UI 无关的适配器协议，定义 `defineAdapter` / `defineWidget` API 和 propsMap 映射机制，让一份 schema 能在不同 UI 框架中渲染
- `expression-engine`: 自研安全的轻量表达式引擎，支持 `{{ }}` 语法的属性访问、比较、逻辑运算和三元表达式，带编译时校验
- `pluggable-validator`: 可插拔校验架构，内置轻量校验器覆盖 80% 场景（required/min/max/pattern），可选接入 async-validator 或 zod
- `meta-schema`: Schema 的 Schema 定义（JSON Schema 格式），用于 AI 生成校验、IDE 补全、运行时 schema 合法性检查
- `element-plus-adapter`: Element Plus UI 适配器，实现桌面端 widget 集合
- `playground`: 在线可视化 playground，三栏布局（组件面板/画布/schema 编辑器），内置示例模板
- `ai-integration`: AI 工具包，包含 prompt 模板、多模型对接（BYOK）、自然语言生成/修改 schema

### Modified Capabilities

## Impact

- **包结构**: `shared` 合入 `core`；`vue3-schema-form` 重命名为 `@v3sf/core`；新增 5 个包（vant/element-plus/ai/playground/generator 重写）
- **API 破坏**: 用户需从 `@v3sf/core` + `@v3sf/vant` 分开导入；widget 注册方式变更为 `defineAdapter`
- **依赖变化**: 移除 Babel、Rollup、Jest；引入 tsdown、Vitest；核心包零外部运行时依赖
- **构建产物**: 仍输出 ESM + CJS + d.ts，但由 tsdown 生成
- **现有用户迁移**: 需要提供 v1 → v2 迁移指南
