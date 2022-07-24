# v3-schema-form

> vue3 中后台表单解决方案

## Features

- 简介的语法，高可读性、高维护性
- 完整的表单校验能力
- 灵活的自定义组件拓展能力
- 自定义注册 ui 库
- 支持表单组件的组合使用

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

> React

```tsx
import React, { useState } from 'react';
import SchemaForm from 'schema-form-react';

const Demo = () => {
  const [formData, setFormData] = useState({
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

  return <SchemaForm schema={schema} data={formData} onChange={setFormData} />;
};
```
