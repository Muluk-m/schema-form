# v3-schema-form

## [![npm](https://img.shields.io/npm/v/v3-schema-form)](https://www.npmjs.com/package/v3-schema-form)

基于 [JSON Schema](https://json-schema.org/understanding-json-schema/) 规范的表单生成器，适用于 vue3

## Features

- 🚀 快速搭建
- 🪒 完整的表单校验
- ⚙️ 灵活的表单联动
- 🪜 高拓展性的组件注册

## Usage

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

![](https://muluk-m.github.io/schema-form/images/demo.png)

## Installation

### npm

使用 npm 安装。
SchemaForm

```bash
npm install v3-schema-form --save
```
