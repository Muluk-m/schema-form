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

## 渲染组件的 Props

SchemaForm 中 `string` 类型，默认使用的是 vant 中的 [field](https://vant-contrib.gitee.io/vant/v4/#/zh-CN/field) 组件，
当我们需要给渲染组件传递 props 参数时，可直接在 schema 的描述项中指定 `props` 信息

:::demo 例如我们想要定制 输入框组件

basic/props

:::
