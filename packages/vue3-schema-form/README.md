# v3-schema-form 表单

基于 json-schema 协议，使用一段 json 配置化生成表单  
vue3.0 中后台表单解决方案  
对`vant ui`的依赖是 peerDependency，默认用户是使用了 vant 的

## Usage

```vue
<template>
  <schema-form ref="formRef" v-model="formData" :schema="schema" />
</template>

<script setup>
import { ref } from 'vue';
import SchemaForm , { FormRef } from 'schema-form-vue';

const formRef = ref<FormRef>()
const formData = ref({
  userName: '王小明',
  age: 18,
  bio: '酷！',
});

const schema = {
  type: '`object`',
  properties: {
    userName: {
      type: '`string`',
      title: '用户名',
      required: true,
    },
    age: {
      type: '`number`',
      title: '年龄',
    },
    bio: {
      type: '`string`',
      title: '签名',
    },
  },
};
</script>
```

## Props

> Schema-form 组件的 props

| 属性名             | 类型              | 默认值 | 描述                                                                      |
| ------------------ | ----------------- | ------ | ------------------------------------------------------------------------- |
| schema             | `object`          | {}     | 表单协议配置                                                              |
| v-model            | `object`          | {}     | 表单 data                                                                 |
| disabled           | `boolean`         | false  | 全局禁用                                                                  |
| readonly           | `boolean`         | false  | 全局只读                                                                  |
| removeHiddenData   | `boolean`         | false  | getValue 时是否过滤 hidden 为 true 的字段                                 |
| debug              | `boolean`         | false  | 表单值变更时，控制台输出日志                                              |
| displayType        | 'row' \| 'column' | 'row'  | 统一指定 Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示 |
| border             | `boolean`         | true   | 是否展示边框                                                              |
| inlineErrorMessage | `boolean`         | false  | 是否在行内展示校验错误信息                                                |

## Schema

> 表单的 schema 配置，基于[json-schema 规范](https://json-schema.apifox.cn/)

| 属性名      | 类型                                                                         | 默认值 | 描述                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| type        | '`string`' \| '`object`' \| '`array`' \| '`number`' \| '`boolean`' \| 'date' | {}     | 表单协议配置                                                                                                          |
| title       | `string`                                                                     | -      | 用于渲染控件 label，title 为空时，label 不渲染                                                                        |
| border      | `boolean`                                                                    | true   | 是否展示边框                                                                                                          |
| required    | `boolean` \| `Function`                                                      | false  | 是否必填，支持函数表达式 (formData)=> `boolean`                                                                       |
| placeholder | `string`                                                                     | -      | 空值占位（需对应渲染控件支持 placeholder，才可生效）                                                                  |
| disabled    | `boolean` \| `Function`                                                      | false  | 是否禁用，支持函数表达式 (formData)=> `boolean`                                                                       |
| readonly    | `boolean` \| `Function`                                                      | false  | 是否只读，支持函数表达式 (formData)=> `boolean`                                                                       |
| hidden      | `boolean` \| `Function`                                                      | false  | 是否隐藏当前选项，支持函数表达式 (formData)=> `boolean`                                                               |
| displayType | 'row' \| 'column'                                                            | 'row'  | 指定 Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示                                                 |
| className   | `string`                                                                     | -      | 控件类名（用来做样式覆盖）                                                                                            |
| widget      | `string`                                                                     | -      | 指定使用哪个组件来渲染,除内置控件外，自定义控件需要注册才可使用                                                       |
| enum        | `array`                                                                      | -      | 可用来生成组件的 options 的 value，例: [1,2] => [{label:1 , value:1},{label:2 , value:2}],可使用 enumNames 制定 label |
| enumNames   | `array`                                                                      | -      | 可用来生成组件的 options 的 label                                                                                     |
| rules       | `Rule` \| `Rule`[]                                                           | -      | 指定组件校验逻辑， [Rule](#Rule)                                                                                      |

## Ref

> 可通过 ref 拿到组件暴露的方法

| 属性名        | 类型                                                                   | 描述                                                                           |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| getFormData   | () => FormData                                                         | 获取表单数据(如果配置 removeHiddenData 则过滤掉 hidden 字段)                   |
| validate      | (scrollToError?: `boolean`) => Promise<ErrorMessage[]>                 | 触发整个表单校验(scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项) |
| validateField | (name: `string`, scrollToError?: `boolean`) => Promise<ErrorMessage[]> | 校验单个字段                                                                   |

## widgets

> 内置的控件

| 组件名称    | 值类型               | 描述                           |
| ----------- | -------------------- | ------------------------------ |
| input       | `string`             | 普通输入框，van-field 的封装   |
| checkbox    | `array`              | 复选框                         |
| switch      | `boolean`            | 切换开关                       |
| stepper     | `number`             | 数字输入框，van-stepper 的封装 |
| radio       | `string` \| `number` | 单选框                         |
| picker      | `string` \| `number` | 弹出选择器                     |
| cascader    | `array`              | 弹出-级联选择器                |
| date        | `string`             | 日期选择器                     |
| radioButton | `string` \| `number` | 单选框（按钮选项）             |

## Rule

> 校验规则
> 基于[async-validate](https://github.com/yiminghe/async-validator)

| 属性名    | 类型                                                                                                                                                                                      | 默认值 | 描述                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------- |
| type      | "`string`" \| "`number`" \| "`boolean`" \| "`object`" \| "enum" \| "`array`" \| "date" \| "pattern" \| "url" \| "email" \| "method" \| "regexp" \| "integer" \| "float" \| "hex" \| "any" | -      | 校验值的类型                       |
| message   | `string`                                                                                                                                                                                  | -      | 自定义校验失败时对应的错误提示     |
| required  | `boolean`                                                                                                                                                                                 | false  | 是否必填                           |
| pattern   | RegExp \| `string`                                                                                                                                                                        | -      | 正则校验                           |
| min       | `number`                                                                                                                                                                                  | -      | 值最小范围 ，用来校验`number`      |
| max       | `number`                                                                                                                                                                                  | -      | 值最大范围 ，用来校验`number`      |
| len       | `number`                                                                                                                                                                                  | -      | 值长度 ，用来校验`array`\|`string` |
| validator | (rule: any) => `boolean`                                                                                                                                                                  | -      | 自定义校验逻辑                     |

## Addon

> 自定义组件时，可在组件内部通过 props.addon 拿到当前组件的配置

| 属性名            | 类型                                        | 描 述                                                  |
| ----------------- | ------------------------------------------- | ------------------------------------------------------ |
| name              | `string`                                    | 表单项的 key                                           |
| rootSchema        | [Schema](#Schema)                           | 根节点的 schema                                        |
| placeholder       | `string`                                    | 占位符（当前节点 schema 配置时，可通过次属性拿到）     |
| className         | `string`                                    | 类名                                                   |
| required          | `boolean`                                   | 是否必填                                               |
| props             | `object`                                    | 当前控件的 props 注入                                  |
| changeValueByName | (name: `string`, value: any) => void        | 可在自定义控件内，使用该方法通过 name 变更其他控件的值 |
| batchChangeValue  | (values: Record<`string`, unknown>) => void | 批量更新数据                                           |
| getFormData       | () => any                                   | 获取表单值                                             |

## TODO

- Ui
  - 字体大小，颜色，间距等使用 css 变量
- docs
  - demo
  - 自定义组件
