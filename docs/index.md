---
layout: home

hero:
  name: v3sf
  text: AI-Native Form Schema Toolkit
  tagline: 用自然语言生成表单 · 自动校验修复 · 编译为任意框架配置
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线体验
      link: https://muluk-m.github.io/schema-form/playground/

features:
  - icon: ✨
    title: AI 原生
    details: createGenerator() 一行接入任意 LLM，自然语言描述 → 表单 Schema，自动校验修复，多轮对话迭代。
  - icon: 🧩
    title: 多目标编译器
    details: 同一份 Schema 编译为 Element Plus、Ant Design、Formily、HTML 配置。写一次，到处用。
  - icon: ⚡
    title: 独立表达式引擎
    details: safe-template-expr — 零依赖、AST 编译、无 eval 的安全模板表达式引擎，可独立于 v3sf 使用。
  - icon: 🔌
    title: UI 框架无关
    details: 核心引擎与 UI 解耦，通过适配器协议接入任意组件库。内置 Vant 和 Element Plus 适配器。
  - icon: 🪶
    title: 轻量极速
    details: 核心包仅 7KB gzipped，零外部运行时依赖，内置校验器覆盖 80% 场景。
  - icon: 🔒
    title: 安全可靠
    details: 自研 AST 表达式引擎安全求值，TypeScript strict mode 全覆盖，257 个测试用例。
---
