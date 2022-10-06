<script lang="ts" setup>
import Generator, { GeneratorProps, WidgetConfig } from '../../generator/src';

const widgets = [
  {
    text: '测试',
    name: 'test',
    schema: {
      type: 'string',
      title: '字符串1',
    },
    setting: {
      placeholder: {
        type: 'string',
        title: '占位符',
        placeholder: '请输入',
      },
      text: {
        type: 'string',
        title: '文本',
        placeholder: '请输入',
      },
    },
  },
];

const settingWidgets = [
  { scope: 'basic', text: '基础组件', widgets },
  { scope: 'business', text: '业务组件', widgets },
];
</script>

<template>
  <div class="app">
    <Generator :setting-widgets="settingWidgets" />
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
