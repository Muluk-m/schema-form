---
title: 表单联动
---

<script setup>
import { ref } from 'vue';
import { Checkbox } from 'vant';

const requiredAll = ref(false)
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      placeholder: '请输入',
      required: "{{ $deps.requiredAll }}",
    },
    age: {
      type: 'number',
      title: '年龄',
      required: "{{ $deps.requiredAll }}",
    },
  }
}
</script>

# 表单联动

SchemaForm 提供了一种插值表达式的语法，"{{ logic }}", 来满足一些*逻辑计算*与*数据绑定*等表单联动诉求

## 插值表达式

schema 的配置中的每一项都可以使用插值表达式的语法，基本规则如下

1. 表达式值为字符串
2. 表达式使用双花括号包裹"{{ }}"
3. 表达式计算后返回的值作为实际生效配置

例：

```js
{
  required: '{{ $selfValue === 1 }}'; // { required : true }
}
```

并且内置了一些**变量**,用于在表达式中书写**状态绑定**的逻辑
| 变量名 | 类型 | 描述 |
| ---------- | ------ | ----------------------- |
| $values | object | 整个表单的值 |
| $selfValue | any | 当前表单项的值 |
| $deps | object | 外部注入的依赖，map 形式 |

## 示例

::: demo
linkage/demo1
:::

## 插值表达式中使用外部依赖

在一些场景下，表单的联动逻辑需要依赖外部环境的状态  
此时可通过 `deps` 注入依赖，在插值表达式中，使用变量 `$deps` 进行消费

```vue {5,23-25,33,38}
<template>
  <SchemaForm
    v-model="formData"
    :schema="schema"
    :deps="deps"
  />
  <div style="display:flex; justify-content:space-between; margin:15px">
    <label>是否全部必填</label>
    <Checkbox v-model="requiredAll" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Checkbox } from 'vant';
import SchemaForm from 'v3-schema-form';

const requiredAll = ref(false);
const formData = ref({
  name: '',
  age: 1,
});
const deps = {
  requiredAll,
};
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      placeholder: '请输入',
      required: '{{ $deps.requiredAll }}',
    },
    age: {
      type: 'number',
      title: '年龄',
      required: '{{ $deps.requiredAll }}',
    },
  },
};
</script>
```

<Demo :schema="JSON.stringify(schema,null,2)" :deps="{requiredAll}">
  <template #operate>
  <div style="display:flex;justify-content:space-between; margin:15px">
    <label>是否全部必填</label>
    <Checkbox v-model="requiredAll" />
  </div>
  </template>
</Demo>
