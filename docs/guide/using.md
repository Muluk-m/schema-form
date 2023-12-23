---
title: 基本使用
---

# 基本使用

SchemaForm 是一个声明式表单组件，组件需要一份描述表单信息的 `Schema` 和一个用于数据双向绑定的 `data` 声明，即可渲染出一个最基本的表单
::: info tips

由于 `SchemaForm` 内置使用了移动端 `vant` 组件库做为渲染方案，
所以文档中的 Demo 演示皆为移动端场景效果

:::

## 一个简单的例子

```js
{
  "type": "object",               // schema的顶层 type 总是 "object"
  "properties": {                 // properties 中存放所有的表单元素的描述
    "name": {                     // 表单元素的 key，双向绑定数据对应的字段名
      "title": "名称",             // 表单项的 label
      "type": "string",           // 表单项的数据类型
      "placeholder": "请输入名称",  // 输入框的 placeholder
      "required": true            // 是否必填
    }
  }
}

```

:::demo

basic/simple

:::

## 注入组件 Props

例如 SchemaForm 中 `string` 类型，默认渲染控件使用的是 vant 中的 [field](https://vant-contrib.gitee.io/vant/v4/#/zh-CN/field) 组件，
当我们需要给渲染组件传递 props 参数时，可直接在 schema 的描述项中指定 `props` 信息

:::demo 例如我们想要定制 输入框组件

basic/props

:::

## 内置的控件

SchemaForm 中的表单项渲染控件，默认是基于 schema 中的 `type` 来生成的。  
这意味着，在 SchemaForm 中内置了许多组件可供使用
内置控件如下：

```js
const fieldMapping = {
  input: defineAsyncComponent(() => import('./vant/Input')),
  checkbox: defineAsyncComponent(() => import('./vant/Checkbox')),
  switch: defineAsyncComponent(() => import('./vant/Switch')),
  stepper: defineAsyncComponent(() => import('./vant/Stepper')),
  radio: defineAsyncComponent(() => import('./vant/Radio')),
  picker: defineAsyncComponent(() => import('./vant/Picker')),
  cascader: defineAsyncComponent(() => import('./vant/Cascader')),
  date: defineAsyncComponent(() => import('./vant/Date')),
  radioButton: defineAsyncComponent(() => import('./vant/RadioButton')),
};

const typeMapping = {
  string: fieldMapping.input,
  array: fieldMapping.checkbox,
  boolean: fieldMapping.switch,
  number: fieldMapping.stepper,
  date: fieldMapping.date,
};
```

:::demo 可通过 widget 字段指定

basic/inbuilt

:::

这也表示，通过注册同名的自定义控件，可以覆盖内置的渲染控件
