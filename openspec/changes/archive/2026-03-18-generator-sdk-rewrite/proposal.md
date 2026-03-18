## Why

当前 `@v3sf/generator` 是一个三栏写死的单体组件，无法被外部应用灵活嵌入和定制布局。同时画布交互层体验粗糙（操作按钮遮挡内容、缺少 hover/选中视觉反馈、无拖拽指示线），距离低代码平台级别的拖拽体验差距明显。Playground 应用与 Generator 功能大量重叠但各自实现，需要统一架构：Generator 作为可嵌入 SDK，Playground 作为演示应用包装 Generator。

## What Changes

- **BREAKING** `<Generator>` 组件拆分为原子组件：`<GeneratorProvider>` + `<WidgetPalette>` + `<FormCanvas>` + `<FieldSettings>`
- **BREAKING** 移除 Generator 内置的 `MobileSimulator`，视口模拟由消费者（Playground）实现
- **BREAKING** 移除 Settings 中的 "Form Schema" JSON 导入导出 tab，JSON 编辑器由消费者实现
- 新增 `<Generator>` 开箱即用组件，内部组合原子组件 + 支持 `#sidebar` / `#canvas` / `#settings` slot 覆盖
- 新增 `useGenerator()` hook，暴露 schema、fields、undo/redo 等操作给外部
- 新增 `@change` / `@select` 标准 Vue 事件
- 新增 `expose`: `getSchema()` / `loadSchema()` / `undo()` / `redo()`
- 画布交互层重写：hover 蓝色虚线、选中蓝色实线 + 底部工具栏、拖拽插入指示线、空状态引导
- Playground 应用重写，基于 Generator SDK 构建，新增 JSON 编辑器（tab 切换）、适配器/视口切换、模板库、手机模拟器壳

## Capabilities

### New Capabilities

- `generator-component-api`: Generator SDK 的组件 API 设计，包括 GeneratorProvider、原子组件、开箱即用 Generator 组件、slots、events、expose 接口
- `canvas-interaction`: 画布交互覆盖层，hover/选中/拖拽三种状态的视觉反馈和交互行为
- `playground-app`: Playground 演示应用，包装 Generator SDK，提供 JSON 编辑器、适配器切换、视口模拟、模板库

### Modified Capabilities

## Impact

- **包结构**: `@v3sf/generator` 导出内容变化（新增原子组件和 hook 导出），Playground 改为依赖 Generator SDK 而非自行实现拖拽
- **API 破坏**: 现有 `<Generator>` 的 props 签名变化（移除 `settingWidgets`，统一为 `schema` / `adapter` / `widgets`）；内置 MobileSimulator 和 JSON tab 被移除
- **依赖变化**: Playground 移除自身拖拽逻辑，改为导入 `@v3sf/generator` 组件；Generator 保留 vuedraggable 依赖
- **现有消费者**: `generator-example` 需要适配新的组件 API
