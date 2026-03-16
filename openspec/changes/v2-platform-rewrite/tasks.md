## 1. 基建清理 (Phase 0)

- [x] 1.1 升级 pnpm 至 10+，更新 pnpm-workspace.yaml 格式
- [x] 1.2 升级 TypeScript 至 5.7+，启用 strict mode，修复所有类型错误
- [x] 1.3 升级 Vue 至 3.5+，更新 @vue/compiler-sfc 和相关依赖
- [x] 1.4 替换构建系统：移除所有 rollup.config.\* 和 Babel 配置，每个包配置 tsdown
- [x] 1.5 替换测试框架：移除 Jest 配置，安装 Vitest，迁移现有测试文件
- [x] 1.6 升级 ESLint 至 9（flat config），移除旧 .eslintrc.js，配置 eslint.config.js
- [x] 1.7 重组包结构：vue3-schema-form 重命名为 @v3sf/core，shared 合入 core，删除空的 packages/core 目录
- [x] 1.8 新建 @v3sf/vant 包骨架（从 core 中拆出 widgets/vant 目录）
- [x] 1.9 更新示例应用的 Vite 至 6.x，确保 dev server 可用
- [x] 1.10 配置 GitHub Actions CI（lint + test + build）
- [x] 1.11 配置 Changesets 用于版本管理和发布

## 2. 表达式引擎 (expression-engine)

- [x] 2.1 实现词法分析器（Tokenizer）：支持标识符、数字、字符串、运算符、分隔符
- [x] 2.2 实现语法解析器（Parser）：生成 AST，支持属性访问、比较、逻辑、三元、算术
- [x] 2.3 实现求值器（Evaluator）：遍历 AST 求值，支持 $values / $selfValue / $deps 上下文
- [x] 2.4 实现 null-safe 属性访问（访问 undefined 属性返回 undefined 而非报错）
- [x] 2.5 实现编译时校验：schema 解析阶段检查 {{ }} 表达式合法性，提供友好错误信息
- [x] 2.6 实现 {{ }} 检测和 passthrough 逻辑（非表达式字符串直接返回）
- [x] 2.7 编写表达式引擎完整测试套件（属性访问、比较、逻辑、三元、安全性、错误场景）

## 3. 校验系统 (pluggable-validator)

- [x] 3.1 定义 ValidatorAdapter 接口类型
- [x] 3.2 实现内置轻量校验器：required、pattern、min/max、type、custom 规则
- [x] 3.3 实现 validateFields（单字段校验）和 validate（全表单校验）方法
- [x] 3.4 实现 scrollToError 功能
- [x] 3.5 编写校验器测试套件（每种规则类型 + 适配器切换 + 边界场景）

## 4. Widget Adapter 协议 (widget-adapter)

- [x] 4.1 定义 WidgetAdapter 接口、WidgetDefinition 类型、标准 widget props 类型
- [x] 4.2 实现 defineAdapter() 函数：接收 widgets map + globalPropsMap，返回 adapter 实例
- [x] 4.3 实现 defineWidget() 函数：创建符合协议的单个 widget
- [x] 4.4 实现 propsMap 映射逻辑：widget 级别优先于 global 级别，未映射 props 透传
- [x] 4.5 实现 createSchemaForm() 工厂函数：接收 adapter，返回配置好的 SchemaForm 组件
- [x] 4.6 实现 unknown widget fallback（警告 + 渲染降级元素）
- [x] 4.7 确保 adapter widgets 支持 tree-shaking
- [x] 4.8 编写 adapter 协议测试套件

## 5. Core 引擎重写 (SchemaForm / Field / Label)

- [x] 5.1 重写 Schema 解析器：集成表达式编译、类型校验
- [x] 5.2 重写 SchemaForm 组件：基于 createSchemaForm 工厂，使用 adapter 渲染
- [x] 5.3 重写 Field 组件：通过 adapter 解析 widget，传递标准化 props
- [x] 5.4 重写 Label 组件：支持 displayType row/column
- [x] 5.5 重写 useAddon hook：提供 name、rootSchema、placeholder、required、setFormData、getFormData
- [x] 5.6 实现表单响应式联动：hidden/disabled/required 支持 {{ }} 表达式动态求值
- [x] 5.7 暴露 FormRef 接口：getFormData、validate、validateFields
- [x] 5.8 编写 core 组件渲染测试 + 联动测试

## 6. Meta Schema (meta-schema)

- [x] 6.1 编写 schema.meta.json：定义所有字段属性、widget 名称枚举、表达式模式、规则结构
- [x] 6.2 添加 TypeScript Schema 类型并确保与 meta-schema 一致
- [x] 6.3 编写 meta-schema 验证测试（正确 schema 通过、错误 schema 被拒绝）

## 7. Vant 4 适配器 (@v3sf/vant)

- [x] 7.1 升级 Vant 依赖至 4.x，声明为 peerDependency
- [x] 7.2 使用 defineAdapter 注册所有 widget：input、checkbox、switch、stepper、radio、picker、cascader、date、radioButton
- [x] 7.3 配置每个 widget 的 propsMap（Vant 4 prop 名称映射）
- [x] 7.4 更新 vue3-example 应用使用 `@v3sf/core` + `@v3sf/vant` 的新 import 方式
- [ ] 7.5 编写 Vant adapter 渲染测试

## 8. Element Plus 适配器 (@v3sf/element-plus)

- [x] 8.1 新建 @v3sf/element-plus 包，声明 element-plus 为 peerDependency
- [x] 8.2 使用 defineAdapter 实现 widget：input、number、switch、radio、checkbox、select、cascader、date、textarea
- [ ] 8.3 实现 displayType row/column 布局（基于 ElFormItem）
- [ ] 8.4 创建 Element Plus 示例应用
- [ ] 8.5 编写跨 adapter schema 兼容性测试（同一 schema 在 Vant 和 Element Plus 下渲染）

## 9. Generator 重写

- [x] 9.1 基于新 core 的 widget registry 重写 Generator 架构
- [x] 9.2 升级或替换拖拽引擎（评估 vuedraggable 最新版 vs pragmatic-drag-and-drop）
- [x] 9.3 实现完整的字段属性编辑面板
- [x] 9.4 实现联动规则可视化配置
- [x] 9.5 实现 undo/redo 历史管理
- [x] 9.6 实现键盘快捷键（删除、复制、撤销等）
- [x] 9.7 实现 schema JSON 导入/导出
- [x] 9.8 移动端/桌面端预览切换
- [ ] 9.9 编写 Generator E2E 测试（Playwright）

## 10. Playground

- [x] 10.1 新建 @v3sf/playground 包，搭建 Vue 3 + Vite 应用骨架
- [x] 10.2 实现三栏布局：组件面板 / 拖拽画布 / Schema 编辑器（集成 Monaco Editor）
- [x] 10.3 实现画布与 JSON 编辑器的双向实时同步
- [x] 10.4 实现移动端/桌面端预览切换
- [x] 10.5 创建示例模板库：登录表单、用户注册、请假申请、问卷调查、联系表单
- [x] 10.6 实现 schema 导入/导出（文件 + 剪贴板）
- [x] 10.7 实现分享链接功能（schema 编码到 URL hash）
- [ ] 10.8 部署 Playground 为独立网站

## 11. AI 集成 (@v3sf/ai)

- [x] 11.1 新建 @v3sf/ai 包，导出 system prompt 模板和 generateSchemaPrompt 函数
- [x] 11.2 编写优化的 system prompt，包含 meta-schema 定义和生成约束
- [x] 11.3 创建示例 schema 语料库（至少 10 个常见表单模板，带注释）
- [x] 11.4 实现 validateAndRepair(schema) 函数：校验 AI 输出并自动修复常见错误
- [x] 11.5 在 Playground 实现 AI 聊天面板 UI
- [x] 11.6 实现 BYOK 配置：API Key 存储在 localStorage，支持配置 endpoint
- [x] 11.7 实现多模型支持：OpenAI / Claude / DeepSeek / 通义千问 的 API 对接
- [x] 11.8 实现增量修改：AI 基于当前 schema 上下文修改部分字段
- [x] 11.9 编写 AI 包测试（prompt 生成、schema 校验修复、模型切换）

## 12. 文档 & 发布

- [x] 12.1 升级 VitePress 至稳定版，重建文档站结构
- [x] 12.2 编写快速开始教程（5 分钟上手）
- [x] 12.3 编写 Schema 配置参考文档
- [x] 12.4 编写 Widget 组件文档（内置 widget 列表 + 自定义 widget 指南）
- [x] 12.5 编写适配器开发指南（如何为新 UI 库创建适配器）
- [x] 12.6 编写 AI 集成指南
- [x] 12.7 编写 v1 → v2 迁移指南
- [x] 12.8 创建 Landing Page
- [ ] 12.9 发布 v2.0 到 npm，创建 GitHub Release
