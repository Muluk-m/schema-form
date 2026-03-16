# 自定义组件

当内置组件无法满足需求时，v3sf 支持开发和注册自定义组件。

## 概述

自定义组件的开发流程：

1. 创建一个 Vue 组件，遵循标准 props 接口
2. 使用 `defineWidget()` 包装组件（可选）
3. 注册到适配器中
4. 在 Schema 中通过 `widget` 名称引用

## 组件标准 Props

所有 v3sf 组件（内置或自定义）都会接收以下标准 props：

```ts
interface WidgetStandardProps {
  modelValue: any // 字段当前值
  disabled?: boolean // 是否禁用
  readonly?: boolean // 是否只读
  placeholder?: string // 占位文本
  error?: string // 校验错误信息
  addon?: FieldWidgetAddon // 表单上下文（也可通过 useAddon() 获取）
}
```

自定义组件必须：

- 接收 `modelValue` prop
- 通过 `update:modelValue` 事件更新值

## 基本示例：评分组件

### 1. 创建组件

```vue
<!-- widgets/MyRating.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: number
  disabled?: boolean
  readonly?: boolean
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="my-rating">
    <span
      v-for="i in max ?? 5"
      :key="i"
      :class="{ active: i <= modelValue, disabled }"
      @click="!disabled && !readonly && emit('update:modelValue', i)"
    >
      ★
    </span>
  </div>
</template>

<style scoped>
.my-rating span {
  cursor: pointer;
  font-size: 24px;
  color: #ccc;
}
.my-rating span.active {
  color: #f5a623;
}
.my-rating span.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
```

### 2. 注册到适配器

```ts
import { defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import MyRating from './widgets/MyRating.vue'

const customAdapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    rating: { component: MyRating },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

### 3. 在 Schema 中使用

```ts
const schema = {
  type: 'object',
  properties: {
    score: {
      type: 'number',
      title: '评分',
      widget: 'rating',
      props: { max: 10 },
    },
  },
}
```

## 使用 `defineWidget()`

`defineWidget()` 是一个类型辅助函数，用于定义组件配置。它可以指定 `propsMap` 来映射标准 prop 名到组件实际的 prop 名：

```ts
import { defineWidget } from '@v3sf/core'
import MyColorPicker from './MyColorPicker.vue'

const colorPickerWidget = defineWidget({
  component: MyColorPicker,
  propsMap: {
    modelValue: 'color', // 将 modelValue 映射为 color prop
    disabled: 'isDisabled', // 将 disabled 映射为 isDisabled prop
  },
})
```

然后注册到适配器：

```ts
const customAdapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    colorPicker: colorPickerWidget,
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})
```

::: tip 何时需要 propsMap
如果你的组件已经使用 `modelValue` / `disabled` / `readonly` / `placeholder` 等标准命名，则不需要 `propsMap`。只有当组件使用不同的 prop 名称时才需要映射。
:::

## 使用 `useAddon()` 获取表单上下文

在自定义组件中，通过 `useAddon()` hook 可以访问丰富的表单上下文信息：

```vue
<script setup lang="ts">
import { useAddon } from '@v3sf/core'

const addon = useAddon()

// addon.value 包含以下属性：
// - name: string           — 字段名
// - schema: Schema         — 当前字段的 Schema
// - rootSchema: Schema     — 根 Schema
// - disabled?: boolean     — 是否禁用
// - readonly?: boolean     — 是否只读
// - placeholder?: string   — 占位文本
// - className?: string     — 自定义类名
// - required?: boolean     — 是否必填
// - props?: object         — Schema 中的 props 透传
// - setFormData(data)      — 设置表单数据（可以修改其他字段）
// - getFormData()          — 获取整个表单数据
// - validate()             — 触发全部字段校验
// - validateFields(fields) — 校验指定字段
</script>
```

### 示例：地址选择器

使用 `useAddon()` 实现一个能修改多个字段的地址选择器：

```vue
<!-- widgets/AddressPicker.vue -->
<script setup lang="ts">
import { useAddon } from '@v3sf/core'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const addon = useAddon()

// 选择地址后，同时更新省份和城市字段
function onAddressSelect(province: string, city: string) {
  addon.value.setFormData({
    province,
    city,
  })
  emit('update:modelValue', `${province} ${city}`)
}
</script>

<template>
  <div class="address-picker">
    <!-- 自定义地址选择 UI -->
    <select @change="onAddressSelect('浙江', '杭州')">
      <option>请选择地址</option>
      <option>浙江 杭州</option>
      <option>北京 北京</option>
    </select>
  </div>
</template>
```

## 完整示例：颜色选择器

以下是一个完整的颜色选择器自定义组件示例。

### 组件实现

```vue
<!-- widgets/ColorPicker.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAddon } from '@v3sf/core'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
  readonly?: boolean
  colors?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const addon = useAddon()

const presetColors = props.colors ?? [
  '#ff4d4f',
  '#ff7a45',
  '#ffa940',
  '#ffc53d',
  '#73d13d',
  '#36cfc9',
  '#40a9ff',
  '#597ef7',
  '#9254de',
  '#f759ab',
]

const customColor = ref(props.modelValue ?? '#000000')

watch(customColor, (val) => {
  emit('update:modelValue', val)
})

function selectColor(color: string) {
  if (props.disabled || props.readonly) return
  customColor.value = color
  emit('update:modelValue', color)
}
</script>

<template>
  <div class="color-picker" :class="{ disabled }">
    <div class="color-presets">
      <span
        v-for="color in presetColors"
        :key="color"
        class="color-swatch"
        :class="{ selected: modelValue === color }"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
      />
    </div>
    <input
      v-if="!readonly"
      type="color"
      :value="modelValue"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="modelValue" class="color-value">{{ modelValue }}</span>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.color-picker.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.color-presets {
  display: flex;
  gap: 4px;
}
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
}
.color-swatch.selected {
  border-color: #333;
}
.color-value {
  font-family: monospace;
  font-size: 14px;
  color: #666;
}
</style>
```

### 注册和使用

```ts
import { createSchemaForm, defineAdapter } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import ColorPicker from './widgets/ColorPicker.vue'

// 注册到适配器
const adapter = defineAdapter({
  widgets: {
    ...vantAdapter.widgets,
    colorPicker: { component: ColorPicker },
  },
  globalPropsMap: vantAdapter.globalPropsMap,
})

const SchemaForm = createSchemaForm(adapter)

// 在 Schema 中使用
const schema = {
  type: 'object',
  properties: {
    themeColor: {
      type: 'string',
      title: '主题颜色',
      widget: 'colorPicker',
      props: {
        colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
      },
    },
  },
}
```

## 注意事项

1. **`useAddon()` 必须在 `setup` 中调用** — 它基于 Vue 的 `inject` 机制，只能在 SchemaForm 内部的组件中使用。

2. **更新值必须通过 `emit('update:modelValue', newValue')`** — 不要直接修改 props。

3. **通过 `propsMap` 解决 prop 命名冲突** — 如果组件已有 `value` prop 而非 `modelValue`，使用 `propsMap: { modelValue: 'value' }` 映射。

4. **Schema 中的 `props` 会透传给组件** — 可以在 Schema 中通过 `props` 传递额外的配置参数。
