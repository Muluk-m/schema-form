# Built-in Widgets

v3sf ships built-in widgets through adapters. Each UI library has its own set of widgets.

## Vant Adapter Widgets

For mobile apps. Provided by `@v3sf/vant`.

| Widget Name   | Description                      | Underlying Vant Component  |
| ------------- | -------------------------------- | -------------------------- |
| `input`       | Text input                       | `van-field`                |
| `checkbox`    | Checkbox group                   | `van-checkbox-group`       |
| `switch`      | Toggle switch                    | `van-switch`               |
| `stepper`     | Stepper                          | `van-stepper`              |
| `number`      | Number input (alias for stepper) | `van-stepper`              |
| `radio`       | Radio group                      | `van-radio-group`          |
| `radioButton` | Button-style radio               | `van-radio-group` (button) |
| `picker`      | Scroll picker                    | `van-picker`               |
| `cascader`    | Cascading selector               | `van-cascader`             |
| `date`        | Date picker                      | `van-date-picker`          |

**Automatic type mapping:**

| type      | Default Widget |
| --------- | -------------- |
| `string`  | `input`        |
| `boolean` | `switch`       |
| `number`  | `stepper`      |
| `array`   | `checkbox`     |
| `date`    | `date`         |

## Element Plus Adapter Widgets

For desktop apps. Provided by `@v3sf/element-plus`.

| Widget Name | Description        | Underlying Element Plus Component |
| ----------- | ------------------ | --------------------------------- |
| `input`     | Text input         | `el-input`                        |
| `number`    | Number input       | `el-input-number`                 |
| `switch`    | Toggle switch      | `el-switch`                       |
| `radio`     | Radio group        | `el-radio-group`                  |
| `checkbox`  | Checkbox group     | `el-checkbox-group`               |
| `select`    | Dropdown select    | `el-select`                       |
| `cascader`  | Cascading selector | `el-cascader`                     |
| `date`      | Date picker        | `el-date-picker`                  |
| `textarea`  | Multi-line text    | `el-input` (type=textarea)        |

## Passing Props to Underlying Components

Every widget supports forwarding extra props to the underlying UI component through the schema's `props` field.

```json
{
  "quantity": {
    "type": "number",
    "title": "Quantity",
    "widget": "stepper",
    "props": {
      "min": 1,
      "max": 99,
      "step": 1
    }
  }
}
```

Any prop supported by the underlying component (e.g., `van-stepper` or `el-input-number`) can be passed this way.

## Custom Widgets

When built-in widgets don't meet your needs, you can create custom ones. See the [Custom Widgets](./custom-widgets) guide for full details.

### Quick Example with `defineWidget`

```ts
import { defineWidget } from '@v3sf/core'
import MyColorPicker from './MyColorPicker.vue'

const colorPickerWidget = defineWidget({
  component: MyColorPicker,
  propsMap: {
    modelValue: 'value', // Map the standard modelValue to the component's value prop
    disabled: 'disabled',
  },
})
```

### Registering to an Adapter

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

Then use it in a schema:

```json
{
  "score": {
    "type": "number",
    "title": "Rating",
    "widget": "rating"
  }
}
```
