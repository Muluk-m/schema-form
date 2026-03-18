<script lang="ts" setup>
import Generator from '@v3sf/generator'
import type { WidgetDef } from '@v3sf/generator'
import { vantAdapter } from '@v3sf/vant'

const widgets: WidgetDef[] = [
  {
    label: '输入框',
    type: 'input',
    category: '基础',
    defaultSchema: { type: 'string', title: '输入框', widget: 'input', placeholder: '请输入' },
  },
  {
    label: '数字',
    type: 'number',
    category: '基础',
    defaultSchema: { type: 'number', title: '数字', widget: 'number' },
  },
  {
    label: '文本域',
    type: 'textarea',
    category: '基础',
    defaultSchema: { type: 'string', title: '文本域', widget: 'textarea' },
  },
  {
    label: '开关',
    type: 'switch',
    category: '选择',
    defaultSchema: { type: 'boolean', title: '开关', widget: 'switch' },
  },
  {
    label: '单选',
    type: 'radio',
    category: '选择',
    defaultSchema: {
      type: 'string',
      title: '单选',
      widget: 'radio',
      enum: ['a', 'b'],
      enumNames: ['选项A', '选项B'],
    },
  },
]

function handleChange(schema: any) {
  console.log('Schema changed:', schema)
}
</script>

<template>
  <div class="app">
    <Generator :adapter="vantAdapter" :widgets="widgets" @change="handleChange" />
  </div>
</template>

<style lang="scss" scoped>
.app {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-grow: 1;

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :global(*) {
    box-sizing: border-box;
  }
}
</style>
