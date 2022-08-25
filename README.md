# v3-schema-form

> 基于 vue3 的表单场景解决方案

## Features

- 只需配置极少的 schema
- 完整的表单校验
- 灵活的自定义组件注册
- 轻量、快速的

## Usage

> Vue3

```vue
<script setup>
import { ref } from 'vue';
import SchemaForm from 'schema-form-vue';

const formData = ref({
  userName: '王小明',
  age: 18,
  bio: '酷！',
});

const schema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      title: '用户名',
      required: true,
    },
    age: {
      type: 'number',
      title: '年龄',
    },
    bio: {
      type: 'string',
      title: '签名',
    },
  },
};
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

## Installation

### npm

使用 npm 安装。

```bash
npm i -D v3-schema-form
```
