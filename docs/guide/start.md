---
title: 快速开始
---

# {{ $frontmatter.title }}

<script setup>
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
  }
}
</script>

## npm

```bash
npm install v3-schema-form
```

## 使用

```vue
<script setup>
import { ref } from 'vue';
import SchemaForm from 'v3-schema-form';

const formData = ref({
  userName: '王小明',
  age: 18,
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
  },
};
</script>

<template>
  <SchemaForm
    v-model="formData"
    :schema="schema"
  />
</template>
```

<Demo :schema="JSON.stringify(schema,null,2)" description="" path=""/>

详细规则参见 [基本使用](./using)
