---
title: 自定义控件
---

# 自定义控件

`widget` 作为表单的基本渲染单元，除了 SchemaForm 提供的内置控件外，还提供了注册控件的机制

## 示例

在内置控件不满足场景的情况下，通过 SchemaForm 的 `widgets` 注册控件，然后通过 schema 中的 `widget` 字段指定对应的 key 并使用；

### 注册 & 使用

操作流程

1. 引入组件
2. 注册组件
3. 在 `schema` 中指定 `widget` 的 key

```vue {5,23,28-30}
<template>
  <SchemaForm
    v-model="formData"
    :schema="schema"
    :widgets="widgets"
  />
</template>

<script setup>
import { ref } from 'vue';
import Rate from './Rate';
import SchemaForm, { FormRef } from 'v3-schema-form';

const formData = ref({
  rate: 3,
});
const schema = {
  type: 'object',
  properties: {
    rate: {
      type: 'string',
      title: 'Rate',
      widget: 'rate'
      required: true,
    },
  }
};
const widgets = {
  rate: Rate
}
</script>
```

### 自定义控件的 props

每个自定义控件都是通过 `v-model` 的双向绑定，来关联到 SchemaForm 的表单数据
所以每个控件需要定义 `modelValue` 和 `update:modelValue`，也就是 `v-model` 的对外实现

例如我们要实现一个自定义的 Rate 控件：

```tsx
import { defineComponent, computed } from 'vue';
import { Rate } from 'vant';
import { useAddon } from 'v3-schema-form';

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: String,
  },
  setup: (props, { emit }) => {
    const addon = useAddon();

    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    return () => (
      <div>
        <Rate
          v-model={value.value}
          {...addon.value.props}
        />
      </div>
    );
  },
});
```

### useAddon

通过这个 hook 可以拿到整个 SchemaForm 操作方法和属性，帮助定制一些特殊场景的逻辑

:::info tips
注意 useAddon 拿到的是响应式数据，使用 ES6 结构会破坏掉响应式
:::

```js
const addon = useAddon();

// 触发表达校验
addon.value.validate();
```

type

```ts
interface FieldWidgetAddon<FD extends FormData> {
  /** 控件对应的 schema */
  schema: Schema;
  disabled: boolean;
  readonly: boolean;
  /** 对应字段code */
  name: string;
  /** 根节点的 schema */
  rootSchema: Schema;
  placeholder?: string;
  className?: string;
  required?: boolean;
  props?: Record<string, any>;
  /** 设置表单值 */
  setFormData: (newFormData: Partial<FD>) => void;
  /** 获取当前表单值 */
  getFormData: () => FD;
  /** 触发整个表单校验 */
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>;
  /** 触发指定字段的校验 */
  validateFields: (fields: (keyof FD)[], scrollToError?: boolean) => Promise<ErrorMessage[]>;
}
```
