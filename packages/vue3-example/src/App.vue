<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'vant';
import SchemaForm, { FormRef, Schema } from '../../vue3-schema-form/src';
import Test from './widgets/Test.vue';

const formRef = ref<FormRef>();

const formData = ref({
  string1: '123',
  string2: '选项2',
  string3: '选项2',
  string4: '选项1',
  string5: '1234',
  number: 2,
  boolean: true,
  array: ['选项1', '选项2'],
  date: '2022-06-30',
});

const schema = {
  type: 'object',
  properties: {
    string1: {
      type: 'string',
      title: '字符串1',
      required: '{{ $values.string3 === "选项2" }}',
      placeholder: '请输入内容',
    },
    string2: {
      type: 'string',
      title: '字符串2',
      widget: 'picker',
      enum: ['选项1', '选项2'],
    },
    string3: {
      type: 'string',
      title: '字符串3',
      displayType: 'column',
      widget: 'radio',
      enum: ['选项1', '选项2'],
    },
    string4: {
      type: 'string',
      title: '字符串4',
      widget: 'radioButton',
      enum: ['选项1', '选项2'],
    },
    array: {
      type: 'array',
      title: '数组',
      enum: ['选项1', '选项2', '选项3'],
    },
    number: {
      type: 'number',
      title: '数值',
    },
    boolean: {
      type: 'boolean',
      widget: 'test',
      title: '布尔',
    },
    date: {
      type: 'date',
      title: '日期',
    },
    string5: {
      type: 'string',
      title: '文本域',
      displayType: 'column',
      required: true,
      rules: [{ min: 10, message: 'min is 10' }],
      props: {
        rows: 2,
        autosize: true,
        type: 'textarea',
        maxlength: 50,
        showWordLimit: true,
      },
    },
  },
} as unknown as Schema;
</script>

<template>
  <div class="container">
    <SchemaForm
      ref="formRef"
      v-model="formData"
      class="form"
      debug
      :schema="schema"
      :widgets="{
        test: Test,
      }"
    />
    <Button
      block
      round
      size="small"
      type="primary"
      @click="formRef?.validate(false)"
    >
      测试
    </Button>
  </div>
</template>

<style lang="scss">
.container {
  padding: 15px;

  .form {
    border-radius: 5px;
  }
}
</style>
