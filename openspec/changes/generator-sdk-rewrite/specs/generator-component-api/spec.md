## ADDED Requirements

### Requirement: GeneratorProvider 状态容器

系统 SHALL 提供 `<GeneratorProvider>` 组件作为状态管理容器，接受 `schema`、`adapter`、`widgets` 三个 props，通过 Vue provide/inject 向子组件树提供状态。

#### Scenario: 基本使用

- **WHEN** 消费者将原子组件包裹在 `<GeneratorProvider :schema="schema" :adapter="adapter" :widgets="widgets">` 内
- **THEN** 所有子组件可通过 `useGenerator()` hook 访问共享状态

#### Scenario: 缺少 Provider 时报错

- **WHEN** 原子组件（WidgetPalette / FormCanvas / FieldSettings）在 `<GeneratorProvider>` 外使用
- **THEN** 组件 SHALL 抛出明确错误信息：`"<ComponentName> must be used inside <GeneratorProvider>"`

### Requirement: useGenerator hook

系统 SHALL 提供 `useGenerator()` hook 作为唯一的公共状态访问 API，返回以下属性和方法：

- `schema: Ref<SchemaRaw>` — 当前完整 schema（只读）
- `fields: Ref<FieldItem[]>` — 当前字段列表（只读）
- `selectedField: Ref<string | null>` — 当前选中字段名
- `addField(field: FieldItem, index?: number): void`
- `removeField(name: string): void`
- `updateField(name: string, schema: Partial<SchemaRaw>): void`
- `selectField(name: string | null): void`
- `moveField(fromIndex: number, toIndex: number): void`
- `undo(): void` / `redo(): void`
- `canUndo: Ref<boolean>` / `canRedo: Ref<boolean>`

#### Scenario: 外部读取 schema

- **WHEN** Playground 调用 `useGenerator()` 获取 `schema`
- **THEN** 返回的 schema ref SHALL 实时反映画布上的所有字段变更

#### Scenario: 外部加载 schema

- **WHEN** 外部调用 expose 的 `loadSchema(newSchema)` 方法
- **THEN** 画布 SHALL 更新为新 schema 对应的字段列表，并清空选中状态

### Requirement: Generator 开箱即用组件

系统 SHALL 提供 `<Generator>` 组件作为默认三栏布局组合，内部组合 GeneratorProvider + WidgetPalette + FormCanvas + FieldSettings。

#### Scenario: 默认布局

- **WHEN** 消费者使用 `<Generator :schema="schema" :adapter="adapter" :widgets="widgets" />`
- **THEN** 渲染三栏布局：左侧组件面板、中间画布、右侧属性编辑

#### Scenario: Slot 覆盖

- **WHEN** 消费者提供 `#sidebar`、`#canvas`、`#settings` 任意 slot
- **THEN** 对应栏位 SHALL 渲染 slot 内容替代默认组件

#### Scenario: 事件触发

- **WHEN** 画布上字段发生增删改排序操作
- **THEN** Generator SHALL 触发 `@change` 事件，payload 为完整的 SchemaRaw 对象

#### Scenario: 选中事件

- **WHEN** 用户在画布上点击选中一个字段
- **THEN** Generator SHALL 触发 `@select` 事件，payload 为字段名或 null（取消选中）

### Requirement: Generator expose 方法

Generator 组件 SHALL 通过 Vue defineExpose 暴露以下方法：

- `getSchema(): SchemaRaw`
- `loadSchema(schema: SchemaRaw): void`
- `undo(): void`
- `redo(): void`

#### Scenario: 父组件通过 ref 调用

- **WHEN** 父组件通过 template ref 调用 `generatorRef.value.getSchema()`
- **THEN** SHALL 返回当前画布对应的完整 SchemaRaw 对象

### Requirement: 组件导出结构

`@v3sf/generator` 包 SHALL 导出以下内容：

- 组件：`Generator`（默认导出）、`GeneratorProvider`、`WidgetPalette`、`FormCanvas`、`FieldSettings`
- Hook：`useGenerator`
- 类型：`GeneratorProps`、`WidgetDef`、`FieldItem`

#### Scenario: 按需导入原子组件

- **WHEN** 消费者执行 `import { GeneratorProvider, FormCanvas, WidgetPalette, useGenerator } from '@v3sf/generator'`
- **THEN** 导入成功，组件可正常使用
