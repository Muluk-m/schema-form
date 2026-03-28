# @v3sf/vant

## 2.0.1

### Patch Changes

- fix(vant): 修复所有 Vant widget 双向绑定失效的问题

  JSX `v-model` 与 `{...props}` spread 组合导致 `onUpdate:modelValue` 处理器丢失，
  Radio/Switch/Checkbox/Input 等组件点击后无法更新表单数据。
  全部 9 个 widget 改用 `h()` 函数渲染，显式传递 `modelValue` 和 `onUpdate:modelValue`。

  feat(ai): 优化 AI 表单生成提示词，要求使用多种 widget 类型混合，避免生成单调重复的表单

  feat(core): Field 组件改用 `h()` 渲染 widget，确保事件处理器正确传递

- Updated dependencies
  - @v3sf/core@2.0.1

## 2.0.0

### Major Changes

- f6aedee: v2.0 platform rewrite - UI-agnostic, AI-friendly schema form engine
  - Core engine decoupled from UI frameworks via adapter protocol
  - Self-built safe expression engine (no eval/Function)
  - Pluggable validation with built-in lightweight validator
  - Vant 4 and Element Plus adapters
  - AI toolkit with prompt templates and schema validation
  - Visual generator with undo/redo
  - TypeScript strict mode, 151 tests

### Patch Changes

- Updated dependencies [f6aedee]
  - @v3sf/core@2.0.0
