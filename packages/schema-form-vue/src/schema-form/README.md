# schema-form 表单

基于 json-schema 规范，配置化生成表单

## Usage

```vue
<template>
  <schema-form v-model="formData" :schema="schema" />
</template>

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
```

## Props

| 属性名   | 类型    | 默认值 | 描述     |
| -------- | ------- | ------ | -------- |
| schema   | object  | -      | 表单配置 |
| v-model  | object  | -      | 表单数据 |
| disabled | boolean | false  | 禁用     |
| readonly | boolean | false  | 只读     |

## TODO

- Ui
  - 字体大小，颜色，间距等使用 css 变量
- docs
  - demo
  - 自定义组件
