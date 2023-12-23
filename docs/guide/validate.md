---
title: 表单校验
---

# 表单校验

## 定制校验规则

在 SchemaForm 中，除基本的 `required` 必填校验外，还提供了一套丰富的校验规则配置
校验规则底层采用了 [async-validate](https://github.com/yiminghe/async-validator)，
语法规则类似 [antd-Rule](https://ant-design.gitee.io/components/form-cn/#Rule)

:::demo 可通过 `rules` 配置校验相关规则
validate/rule1
:::

## 定制校验文案

有时默认的校验展示信息并不满足需求，此时可以使用 rules 中的 message 字段来定制  
支持插值表达式语法 "${schema}"

:::info tips
默认必填校验的 message 规则为 "${title}为必填"
:::

:::demo

validate/rule2

:::
