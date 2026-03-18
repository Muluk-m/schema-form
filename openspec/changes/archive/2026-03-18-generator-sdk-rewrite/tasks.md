## 1. Generator 组件拆分

- [x] 1.1 创建 `GeneratorProvider` 组件：接受 `schema` / `adapter` / `widgets` props，内部调用 `createGlobalState` 并 provide 状态
- [x] 1.2 将现有 Sidebar 重构为独立的 `WidgetPalette` 组件，从 inject 获取状态
- [x] 1.3 将现有 Canvas 重构为独立的 `FormCanvas` 组件，从 inject 获取状态
- [x] 1.4 将现有 Settings 重构为独立的 `FieldSettings` 组件，移除 "Form Schema" JSON tab
- [x] 1.5 重写 `Generator` 组件为默认组合：内部使用 GeneratorProvider + 原子组件，支持 `#sidebar` / `#canvas` / `#settings` slot
- [x] 1.6 移除 Generator 内置的 `MobileSimulator` 组件

## 2. 公共 API

- [x] 2.1 实现 `useGenerator()` hook：封装 inject，返回 schema / fields / selectedField / 操作方法
- [x] 2.2 为原子组件添加 Provider 缺失检测，抛出明确错误信息
- [x] 2.3 为 Generator 组件添加 `@change` / `@select` 事件
- [x] 2.4 为 Generator 组件添加 `defineExpose`：`getSchema()` / `loadSchema()` / `undo()` / `redo()`
- [x] 2.5 更新 `packages/generator/src/index.ts` 导出：Generator（默认）+ 原子组件 + useGenerator + 类型

## 3. 画布交互覆盖层

- [x] 3.1 实现 FieldSlot 组件：真实组件渲染层 + absolute 定位透明覆盖层
- [x] 3.2 实现 hover 态：蓝色虚线 outline，选中字段不叠加 hover
- [x] 3.3 实现选中态：蓝色实线边框 + 底部浮动工具栏（上移/下移/复制/删除）
- [x] 3.4 工具栏按钮功能：上移/下移（边界禁用）、复制（自动去重名）、删除
- [x] 3.5 实现双击穿透：双击覆盖层设置 `pointer-events: none`，点击空白恢复
- [x] 3.6 实现拖拽排序指示线：蓝色水平线标记插入位置
- [x] 3.7 实现画布空状态：虚线框 + "从左侧拖入组件" 引导

## 4. Playground 重构

- [x] 4.1 移除 Playground 现有的自实现拖拽逻辑和组件管理代码
- [x] 4.2 使用 GeneratorProvider + 原子组件重建 Playground 布局
- [x] 4.3 实现右侧 tab 切换：属性 tab（FieldSettings）/ Schema tab（JSON 编辑器）
- [x] 4.4 实现 JSON 编辑器：画布变更自动同步、手动 Apply 回写、格式错误禁用 Apply
- [x] 4.5 实现适配器切换（Vant / Element Plus），保持 schema 数据不变
- [x] 4.6 实现视口模拟：手机模式（模拟器壳包裹 FormCanvas）/ 桌面模式（全宽）
- [x] 4.7 保留模板库和分享功能，适配新的 Generator SDK API

## 5. 收尾

- [x] 5.1 更新 `generator-example` 适配新的组件 API
- [x] 5.2 验证 Generator 独立使用（不依赖 Playground）和嵌入使用两种场景
