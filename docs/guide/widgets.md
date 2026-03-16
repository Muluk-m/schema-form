# 内置组件

v3sf 通过适配器提供内置组件，不同 UI 库对应不同的组件集合。

## Vant 适配器组件

适用于移动端，由 `@v3sf/vant` 提供。

| widget 名称   | 说明                   | 对应 Vant 组件             |
| ------------- | ---------------------- | -------------------------- |
| `input`       | 文本输入框             | `van-field`                |
| `checkbox`    | 复选框组               | `van-checkbox-group`       |
| `switch`      | 开关                   | `van-switch`               |
| `stepper`     | 步进器                 | `van-stepper`              |
| `number`      | 数字输入（同 stepper） | `van-stepper`              |
| `radio`       | 单选按钮组             | `van-radio-group`          |
| `radioButton` | 按钮风格单选           | `van-radio-group` (button) |
| `picker`      | 滚动选择器             | `van-picker`               |
| `cascader`    | 级联选择器             | `van-cascader`             |
| `date`        | 日期选择器             | `van-date-picker`          |

**类型自动映射：**

| type      | 默认 widget |
| --------- | ----------- |
| `string`  | `input`     |
| `boolean` | `switch`    |
| `number`  | `stepper`   |
| `array`   | `checkbox`  |
| `date`    | `date`      |

## Element Plus 适配器组件

适用于 PC 端，由 `@v3sf/element-plus` 提供。

| widget 名称 | 说明       | 对应 Element Plus 组件     |
| ----------- | ---------- | -------------------------- |
| `input`     | 文本输入框 | `el-input`                 |
| `number`    | 数字输入   | `el-input-number`          |
| `switch`    | 开关       | `el-switch`                |
| `radio`     | 单选按钮组 | `el-radio-group`           |
| `checkbox`  | 复选框组   | `el-checkbox-group`        |
| `select`    | 下拉选择器 | `el-select`                |
| `cascader`  | 级联选择器 | `el-cascader`              |
| `date`      | 日期选择器 | `el-date-picker`           |
| `textarea`  | 多行文本   | `el-input` (type=textarea) |

## 通过 `props` 透传属性

每个组件都支持通过 Schema 的 `props` 字段向底层 UI 组件透传属性。

```json
{
  "quantity": {
    "type": "number",
    "title": "数量",
    "widget": "stepper",
    "props": {
      "min": 1,
      "max": 99,
      "step": 1
    }
  }
}
```

## 自定义组件

当内置组件无法满足需求时，可以创建自定义组件。

### 使用 `defineWidget`

```ts
import { defineWidget } from '@v3sf/core'
import MyColorPicker from './MyColorPicker.vue'

const colorPickerWidget = defineWidget({
  component: MyColorPicker,
  propsMap: {
    modelValue: 'value', // 将标准的 modelValue 映射到组件的 value prop
    disabled: 'disabled',
  },
})
```

### 自定义组件开发

自定义组件需要接收标准的 `WidgetStandardProps`：

```vue
<!-- MyRating.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: number
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="my-rating">
    <span
      v-for="i in 5"
      :key="i"
      :class="{ active: i <= modelValue, disabled }"
      @click="!disabled && emit('update:modelValue', i)"
    >
      ★
    </span>
  </div>
</template>
```

### 使用 `useAddon` 获取表单上下文

在自定义组件中，可以通过 `useAddon` 访问表单上下文信息。

```vue
<script setup lang="ts">
import { useAddon } from '@v3sf/core'

const addon = useAddon()

// addon.value 包含：
// - schema: 当前字段的 schema
// - name: 字段名
// - rootSchema: 根 schema
// - setFormData: 设置表单数据
// - getFormData: 获取表单数据
// - validate: 触发校验
// - validateFields: 校验指定字段
// - props: schema 中的 props 透传
// - disabled / readonly / placeholder 等
</script>
```

### 注册到适配器

将自定义组件注册到适配器中：

```ts
import { defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import MyRating from './MyRating.vue'

const customAdapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    rating: { component: MyRating },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

然后在 Schema 中使用：

```json
{
  "score": {
    "type": "number",
    "title": "评分",
    "widget": "rating"
  }
}
```
