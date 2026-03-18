## Context

`@v3sf/generator` 当前是一个三栏布局写死的单体组件，内部通过 Vue provide/inject 管理状态。画布使用 vuedraggable 实现拖拽排序，交互层仅有一个 `FieldMask` 组件提供删除/复制按钮。Playground 应用独立实现了自己的拖拽逻辑（HTML5 原生）、组件面板和 JSON 编辑器，与 Generator 功能大量重叠。

Generator 的消费者（generator-example）直接导入组件使用，无法自定义布局或扩展功能。

## Goals / Non-Goals

**Goals:**

- Generator 拆分为可组合的原子组件 + 开箱即用的默认组合，支持灵活嵌入
- 画布交互层达到低代码平台级别的视觉反馈和操作体验
- Playground 重构为 Generator SDK 的演示应用，不再自行实现拖拽和组件管理
- 保持 Generator 作为纯 SDK 包（发 npm），Playground 作为应用（不发 npm）

**Non-Goals:**

- 不实现布局系统（栅格、flex 容器等），当前只处理扁平字段列表
- 不实现表单联动规则的可视化编辑器
- 不实现协同编辑
- 不升级或更换 vuedraggable 拖拽库
- 不实现 Monaco Editor 集成（Playground 的 JSON 编辑器用 textarea 或 CodeMirror 均可）

## Decisions

### D1: 组件拆分策略 — Provider + 原子组件 + 默认组合

将 Generator 拆为 4 个原子组件 + 1 个状态容器 + 1 个开箱即用组合：

```
GeneratorProvider   → 状态管理容器 (provide/inject)
WidgetPalette       → 左侧组件面板
FormCanvas          → 画布 (真实渲染 + 交互覆盖层)
FieldSettings       → 属性编辑面板
Generator           → 默认三栏组合，slot 可覆盖
```

**替代方案**: 仅用 slot 暴露自定义能力。不够灵活——消费者无法改变整体布局结构（如把 Settings 放到画布下方）。

**替代方案**: 只提供原子组件不提供默认组合。增加入门成本，简单场景用户要自己拼布局。

选择两者兼备：原子组件给高级用户完全控制，`<Generator>` 给简单场景开箱即用。

### D2: 状态管理 — 保留 provide/inject，增加 useGenerator() hook

保留现有的 provide/inject 模式（`createGlobalState`），但新增 `useGenerator()` 作为公共 API：

```typescript
const { schema, fields, selectedField, addField, removeField, undo, redo } = useGenerator()
```

`useGenerator()` 内部调用 inject 获取状态，对外提供类型安全的只读/操作接口。现有的 `useGlobalState` / `useGlobalAction` 降级为内部 API。

**理由**: 单一入口降低 API 认知成本，同时保持内部实现灵活性。

### D3: 画布交互覆盖层 — 透明遮罩 + pointer-events 切换

每个 FieldSlot 由两层组成：

1. **底层**: 真实组件渲染（SchemaForm 产出）
2. **覆盖层**: absolute 定位的透明遮罩，拦截鼠标事件

状态切换：

- 正常态：遮罩不可见，`pointer-events: auto` 拦截点击
- Hover：蓝色虚线边框（`outline`，不影响布局）
- 选中：蓝色实线边框 + 底部浮动工具栏（上移/下移/复制/删除）
- 拖拽中：原位半透明 + 目标位置蓝色插入指示线

**替代方案**: 不用覆盖层，直接在组件上绑定事件。问题：不同 UI 库的组件可能拦截/阻止事件冒泡，行为不可控。覆盖层保证了一致的交互行为。

### D4: Playground 与 Generator 的同步策略 — 单向 + 手动 Apply

- Generator 可视化操作 → 自动更新 JSON 编辑器（只读跟随）
- JSON 编辑器手动编辑 → 点击 Apply 按钮回写 Generator

**理由**: 避免编辑中冲突。面向开发者场景，JSON 编辑器是辅助查看/微调，不是主编辑入口。

### D5: MobileSimulator 归属 — 移出 Generator，移入 Playground

Generator SDK 不内置视口模拟。画布渲染与视口无关——消费者可以把 `<FormCanvas>` 放进任何容器（手机壳、iframe、直接渲染）。

Playground 实现手机/平板/桌面切换，用 CSS container 包裹 `<FormCanvas>`。

## Risks / Trade-offs

- **[覆盖层拦截真实组件交互]** → 选中状态下，用户可能想试试组件的真实交互（点击下拉、输入文字）。提供"预览模式"或双击穿透：双击覆盖层后 `pointer-events: none`，点击画布空白处恢复。
- **[破坏性 API 变更]** → generator-example 需要适配。影响面小（仅内部示例），且新 API 更简洁。
- **[vuedraggable 拖拽体验天花板]** → vuedraggable 的拖拽动画和指示线定制能力有限。当前阶段够用，未来如需更精细控制可考虑 dnd-kit 等方案。Non-goal 明确不升级拖拽库。
- **[原子组件脱离 Provider 使用]** → 原子组件必须在 `<GeneratorProvider>` 内使用，否则 inject 失败。需要在开发时 throw 明确错误信息。
