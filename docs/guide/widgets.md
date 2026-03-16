# 内置组件

v3sf 通过适配器提供内置组件，不同 UI 库对应不同的组件集合。

## Vant 适配器组件

适用于移动端，由 `@v3sf/vant` 提供。

| widget 名称   | 说明                   | 对应 Vant 组件                  | 适用 type |
| ------------- | ---------------------- | ------------------------------- | --------- |
| `input`       | 文本输入框             | `van-field`                     | `string`  |
| `stepper`     | 步进器                 | `van-stepper`                   | `number`  |
| `number`      | 数字输入（同 stepper） | `van-stepper`                   | `number`  |
| `switch`      | 开关                   | `van-switch`                    | `boolean` |
| `radio`       | 单选按钮组             | `van-radio-group`               | `string`  |
| `radioButton` | 按钮风格单选           | `van-radio-group` (button 样式) | `string`  |
| `checkbox`    | 复选框组               | `van-checkbox-group`            | `array`   |
| `picker`      | 滚动选择器             | `van-picker`                    | `string`  |
| `cascader`    | 级联选择器             | `van-cascader`                  | `array`   |
| `date`        | 日期选择器             | `van-date-picker`               | `date`    |

### Vant 类型自动映射

当 Schema 中未指定 `widget` 时，根据 `type` 自动选择组件：

| type      | 默认 widget |
| --------- | ----------- |
| `string`  | `input`     |
| `number`  | `stepper`   |
| `boolean` | `switch`    |
| `array`   | `checkbox`  |
| `date`    | `date`      |

## Element Plus 适配器组件

适用于 PC 端，由 `@v3sf/element-plus` 提供。

| widget 名称 | 说明       | 对应 Element Plus 组件     | 适用 type |
| ----------- | ---------- | -------------------------- | --------- |
| `input`     | 文本输入框 | `el-input`                 | `string`  |
| `textarea`  | 多行文本   | `el-input` (type=textarea) | `string`  |
| `number`    | 数字输入   | `el-input-number`          | `number`  |
| `switch`    | 开关       | `el-switch`                | `boolean` |
| `radio`     | 单选按钮组 | `el-radio-group`           | `string`  |
| `checkbox`  | 复选框组   | `el-checkbox-group`        | `array`   |
| `select`    | 下拉选择器 | `el-select`                | `string`  |
| `cascader`  | 级联选择器 | `el-cascader`              | `array`   |
| `date`      | 日期选择器 | `el-date-picker`           | `date`    |

### Element Plus 类型自动映射

| type      | 默认 widget |
| --------- | ----------- |
| `string`  | `input`     |
| `number`  | `number`    |
| `boolean` | `switch`    |
| `array`   | `checkbox`  |
| `date`    | `date`      |

## 组件对照表

以下表格展示两个适配器的组件差异，帮助你在移动端和 PC 端之间切换时调整 Schema：

| 功能     | Vant widget             | Element Plus widget |
| -------- | ----------------------- | ------------------- |
| 文本输入 | `input`                 | `input`             |
| 多行文本 | `input` + props         | `textarea`          |
| 数字输入 | `stepper` / `number`    | `number`            |
| 开关     | `switch`                | `switch`            |
| 单选     | `radio` / `radioButton` | `radio`             |
| 多选     | `checkbox`              | `checkbox`          |
| 下拉选择 | `picker`                | `select`            |
| 级联选择 | `cascader`              | `cascader`          |
| 日期选择 | `date`                  | `date`              |

## 通过 `props` 透传属性

每个组件都支持通过 Schema 的 `props` 字段向底层 UI 组件透传属性。可传递的属性取决于底层 UI 组件本身。

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

### 常见 props 示例

**密码输入（Vant）：**

```json
{
  "password": {
    "type": "string",
    "title": "密码",
    "props": { "type": "password" }
  }
}
```

**日期格式（Element Plus）：**

```json
{
  "birthday": {
    "type": "date",
    "title": "生日",
    "widget": "date",
    "props": { "format": "YYYY-MM-DD", "valueFormat": "YYYY-MM-DD" }
  }
}
```

**数字范围（Element Plus）：**

```json
{
  "price": {
    "type": "number",
    "title": "价格",
    "widget": "number",
    "props": { "min": 0, "max": 99999, "precision": 2, "step": 0.01 }
  }
}
```

## 组件标准 Props

所有组件（内置或自定义）都会接收以下标准 props：

| prop          | 类型               | 说明                                          |
| ------------- | ------------------ | --------------------------------------------- |
| `modelValue`  | `any`              | 字段当前值，通过 `update:modelValue` 事件更新 |
| `disabled`    | `boolean`          | 是否禁用                                      |
| `readonly`    | `boolean`          | 是否只读                                      |
| `placeholder` | `string`           | 占位文本                                      |
| `error`       | `string`           | 校验错误信息                                  |
| `addon`       | `FieldWidgetAddon` | 表单上下文对象（也可通过 `useAddon()` 获取）  |

适配器通过 `propsMap` 将标准 prop 名映射到 UI 组件实际的 prop 名。例如 Vant 的 `input` 组件将 `error` 映射为 `error-message`。

## 下一步

- [自定义组件](./custom-widgets) — 当内置组件无法满足需求时，开发自定义组件
- [适配器开发](./adapters) — 接入其他 UI 库
