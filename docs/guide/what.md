---
title: 什么是 SchemaForm
---

# {{ $frontmatter.title }}

## 简介

SchemaForm 是一个声明式框架，它使用[JSON Schema](https://json-schema.org/understanding-json-schema/) 定义的结构化数据模型作为输入，生成的一份具有数据绑定、数据校验、表单联动等能力的表单

> API 灵感参考 [XRender](https://xrender.fun/form-render)

## 为什么要使用 SchemaForm

手动编写一份定制化的表单是很困难的，尤其是在承接日益复杂的表单场景需求中。此外，表单通常不仅仅是输入数据的功能，还需要更高级的功能，例如表单校验、展示联动。

SchemaForm 利用 `JSON Schema` 协议，提供了一种简单且声明性的方式来描述表单。然后使用 UI 库或框架呈现表单。

## 工作原理

SchemaForm 中渲染的每个表单项，都对应一个`JSON Schema`中的字段描述  
例如：

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "名称",
      "placeholder": "请输入",
      "required": true
    },
    "description": {
      "type": "string",
      "placeholder": "请输入",
      "title": "描述"
    },
    "done": {
      "type": "boolean",
      "title": "已完成"
    }
  }
}
```

::: demo 渲染效果

what/basic

:::

这是一份基本的 JSON Schema，他描述了表单中每项的`title`、`type`、`placeholder`以及`required`，  
SchemaForm 为所有数据类型 `type`, 提供了默认的内置渲染控件，但是，您可以通过自定义`widget`的来更改渲染方式

::: demo 如下

what/custom

:::

<br/>
<br/>

关于 `schema` 配置详细信息请参阅 [Schema](./api-schema)部分
