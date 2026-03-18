## ADDED Requirements

### Requirement: 基于 Generator SDK 构建

Playground 应用 SHALL 使用 `@v3sf/generator` 的原子组件（GeneratorProvider、WidgetPalette、FormCanvas、FieldSettings）构建界面，不再自行实现拖拽和字段管理逻辑。

#### Scenario: 组件来源

- **WHEN** Playground 渲染表单设计界面
- **THEN** 组件面板、画布、属性面板 SHALL 全部来自 `@v3sf/generator` 包的导出

### Requirement: JSON Schema 编辑器

Playground SHALL 在右侧面板提供 JSON Schema 编辑器，与 FieldSettings 以 tab 形式切换。

#### Scenario: 查看 JSON

- **WHEN** 用户切换到 Schema tab
- **THEN** SHALL 显示当前 schema 的格式化 JSON 文本

#### Scenario: 画布变更自动同步到编辑器

- **WHEN** 用户在画布上进行可视化操作（增删改排序字段）
- **THEN** JSON 编辑器内容 SHALL 自动更新为最新 schema

#### Scenario: 手动编辑 JSON 后 Apply

- **WHEN** 用户在 JSON 编辑器中修改文本并点击 Apply 按钮
- **THEN** 画布 SHALL 更新为编辑后的 schema 对应的字段

#### Scenario: JSON 格式错误

- **WHEN** JSON 编辑器内容不是合法 JSON
- **THEN** Apply 按钮 SHALL 禁用，编辑器显示错误提示

### Requirement: 适配器切换

Playground SHALL 支持在 Vant 和 Element Plus 适配器之间切换预览。

#### Scenario: 切换适配器

- **WHEN** 用户在顶部工具栏切换适配器（Vant / Element Plus）
- **THEN** 画布 SHALL 使用新适配器重新渲染所有字段，schema 数据保持不变

### Requirement: 视口模拟

Playground SHALL 提供手机、桌面两种视口模式切换。

#### Scenario: 手机模式

- **WHEN** 用户选择手机视口模式
- **THEN** FormCanvas SHALL 被包裹在手机模拟器壳中（带状态栏、圆角、home indicator）

#### Scenario: 桌面模式

- **WHEN** 用户选择桌面视口模式
- **THEN** FormCanvas SHALL 以全宽渲染，无模拟器壳

### Requirement: 模板库

Playground SHALL 在底部提供预置模板选择栏。

#### Scenario: 选择模板

- **WHEN** 用户点击一个预置模板（如"用户注册"、"商品信息"）
- **THEN** SHALL 加载该模板的 schema 到 Generator，替换当前内容

### Requirement: 分享功能

Playground SHALL 支持将当前 schema 编码为 URL 进行分享。

#### Scenario: 生成分享链接

- **WHEN** 用户点击分享按钮
- **THEN** SHALL 将当前 schema 编码为 URL hash 参数，复制到剪贴板

#### Scenario: 从链接恢复

- **WHEN** 用户访问带有 schema hash 的 Playground URL
- **THEN** SHALL 解码并加载 URL 中的 schema
