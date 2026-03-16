<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import { createSchemaForm } from '@v3sf/core'
import type { FormRef, SchemaRaw } from '@v3sf/core'
import elementPlusAdapter from '@v3sf/element-plus'

const SchemaForm = createSchemaForm(elementPlusAdapter)
const formRef = ref<FormRef>()

const formData = ref({
  name: '张三',
  email: '',
  age: 25,
  gender: '男',
  hobbies: ['阅读'],
  bio: '',
  subscribe: true,
  birthday: '2000-01-01',
})

const schema: SchemaRaw = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      placeholder: '请输入姓名',
    },
    email: {
      type: 'string',
      title: '邮箱',
      required: true,
      rules: [{ pattern: '^[^@]+@[^@]+\\.[^@]+$', message: '请输入正确的邮箱' }],
      placeholder: '请输入邮箱',
    },
    age: {
      type: 'number',
      title: '年龄',
      rules: [{ min: 0, max: 150 }],
    },
    gender: {
      type: 'string',
      title: '性别',
      widget: 'radio',
      enum: ['男', '女'],
    },
    hobbies: {
      type: 'array',
      title: '爱好',
      enum: ['阅读', '运动', '音乐', '旅行'],
    },
    subscribe: {
      type: 'boolean',
      title: '订阅通知',
    },
    birthday: {
      type: 'date',
      title: '生日',
    },
    bio: {
      type: 'string',
      title: '个人简介',
      widget: 'textarea',
      displayType: 'column',
      placeholder: '介绍一下自己...',
      hidden: '{{ !$values.subscribe }}',
    },
  },
}
</script>

<template>
  <div style="max-width: 600px; margin: 40px auto; padding: 20px;">
    <h2>v3sf Element Plus 示例</h2>
    <SchemaForm
      ref="formRef"
      v-model="formData"
      :schema="schema"
    />
    <ElButton type="primary" style="margin-top: 16px;" @click="formRef?.validate()">
      提交
    </ElButton>
    <pre style="margin-top: 16px; font-size: 12px;">{{ JSON.stringify(formData, null, 2) }}</pre>
  </div>
</template>
