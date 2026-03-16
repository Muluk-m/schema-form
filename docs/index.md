---
layout: home

title: v3sf
titleTemplate: UI-agnostic JSON Schema form engine for Vue 3

hero:
  name: v3sf
  text: JSON Schema 表单引擎
  tagline: 轻量、UI 无关、AI 友好的 Vue 3 配置化表单方案
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/Muluk-m/schema-form

features:
  - title: UI 无关
    details: 核心引擎与 UI 库完全解耦，通过适配器接入 Vant、Element Plus 或任意组件库
  - title: AI 友好
    details: 内置 @v3sf/ai 包，提供 system prompt、function calling schema 和自动修复，开箱即用
  - title: 轻量高效
    details: 核心包零运行时依赖，自研安全表达式引擎替代 eval，tree-shaking 友好
  - title: 类型安全
    details: 全量 TypeScript 编写，完整的类型推导，Schema 定义和自定义组件均有类型提示
---

<div style="max-width: 688px; margin: 2rem auto; padding: 0 24px;">

## 30 秒示例

```vue
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)

const formData = ref({})
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      required: true,
      placeholder: '请输入用户名',
    },
    agree: {
      type: 'boolean',
      title: '同意协议',
      widget: 'switch',
    },
  },
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

</div>
