---
title: 校验规则
---

# {{ $frontmatter.title }}

> 基于[async-validate](https://github.com/yiminghe/async-validator)

| 属性名    | 类型                                                                              | 默认值       | 描述                               |
| --------- | --------------------------------------------------------------------------------- | ------------ | ---------------------------------- |
| type      | "`string`" \| "`number`" \| "`boolean`" \| "`object`" \| "enum" \| "`array`" \| - | 校验值的类型 |
| message   | `string`                                                                          | -            | 自定义校验失败时对应的错误提示     |
| required  | `boolean`                                                                         | false        | 是否必填                           |
| pattern   | RegExp \| `string`                                                                | -            | 正则校验                           |
| min       | `number`                                                                          | -            | 值最小范围 ，用来校验`number`      |
| max       | `number`                                                                          | -            | 值最大范围 ，用来校验`number`      |
| len       | `number`                                                                          | -            | 值长度 ，用来校验`array`\|`string` |
| validator | (rule: any) => `boolean`                                                          | -            | 自定义校验逻辑                     |
