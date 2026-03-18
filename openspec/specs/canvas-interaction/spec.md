## ADDED Requirements

### Requirement: 字段 Hover 视觉反馈

当鼠标悬停在画布中的字段上时，系统 SHALL 显示蓝色虚线边框（outline，不影响布局）作为 hover 指示。

#### Scenario: 鼠标进入字段区域

- **WHEN** 鼠标进入一个未选中字段的区域
- **THEN** 该字段 SHALL 显示蓝色虚线边框

#### Scenario: 鼠标离开字段区域

- **WHEN** 鼠标离开字段区域
- **THEN** 蓝色虚线边框 SHALL 消失

#### Scenario: 已选中字段不显示 hover 态

- **WHEN** 鼠标悬停在已选中的字段上
- **THEN** SHALL 保持选中态样式（蓝色实线），不叠加 hover 态

### Requirement: 字段选中态

用户点击画布中的字段时，系统 SHALL 以蓝色实线边框标记选中状态，并在字段底部显示操作工具栏。

#### Scenario: 点击选中字段

- **WHEN** 用户点击画布中的一个字段
- **THEN** 该字段 SHALL 显示蓝色实线边框，底部出现工具栏（上移、下移、复制、删除按钮）

#### Scenario: 切换选中

- **WHEN** 用户点击另一个字段
- **THEN** 前一个字段取消选中，新字段进入选中态

#### Scenario: 取消选中

- **WHEN** 用户点击画布空白区域
- **THEN** 所有字段取消选中，工具栏消失

### Requirement: 交互覆盖层

每个画布字段 SHALL 包含一个 absolute 定位的透明覆盖层，覆盖在真实组件之上，拦截鼠标事件以提供一致的交互行为。

#### Scenario: 覆盖层拦截点击

- **WHEN** 用户点击覆盖层
- **THEN** SHALL 触发字段选中，而非触发底层真实组件的交互

#### Scenario: 双击穿透

- **WHEN** 用户双击覆盖层
- **THEN** 覆盖层 SHALL 设置 `pointer-events: none`，允许用户直接与底层真实组件交互

#### Scenario: 退出穿透模式

- **WHEN** 用户在穿透模式下点击画布空白区域
- **THEN** SHALL 恢复覆盖层的 `pointer-events: auto`

### Requirement: 拖拽排序指示

拖拽字段排序时，系统 SHALL 在目标插入位置显示蓝色水平指示线。

#### Scenario: 拖拽中显示指示线

- **WHEN** 用户从组件面板拖拽组件到画布，或在画布内拖拽已有字段
- **THEN** 目标插入位置 SHALL 出现蓝色水平指示线

#### Scenario: 拖拽结束

- **WHEN** 用户释放拖拽
- **THEN** 指示线消失，字段插入到指示位置

### Requirement: 画布空状态

当画布中没有任何字段时，系统 SHALL 显示引导提示。

#### Scenario: 空画布显示引导

- **WHEN** 画布字段列表为空
- **THEN** SHALL 显示"从左侧拖入组件"引导文案和视觉提示（如虚线框 + 图标）

#### Scenario: 添加首个字段后隐藏引导

- **WHEN** 用户拖入或点击添加第一个字段
- **THEN** 空状态引导消失，显示字段

### Requirement: 工具栏操作

选中字段底部的工具栏 SHALL 提供上移、下移、复制、删除四个操作按钮。

#### Scenario: 上移字段

- **WHEN** 用户点击工具栏"上移"按钮
- **THEN** 选中字段与上方字段交换位置；如果已在首位，按钮 SHALL 禁用

#### Scenario: 下移字段

- **WHEN** 用户点击工具栏"下移"按钮
- **THEN** 选中字段与下方字段交换位置；如果已在末位，按钮 SHALL 禁用

#### Scenario: 复制字段

- **WHEN** 用户点击工具栏"复制"按钮
- **THEN** SHALL 在选中字段下方插入一个副本，字段名自动去重

#### Scenario: 删除字段

- **WHEN** 用户点击工具栏"删除"按钮
- **THEN** SHALL 移除选中字段，选中状态清空
