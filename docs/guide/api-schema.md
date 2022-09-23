---
title: Schema
---

# {{ $frontmatter.title }}

> 表单的 Schema 配置，基于[JSON Schema 规范](https://json-schema.org/understanding-json-schema/)

| 属性名      | 类型                                                   | 默认值 | 描述                                                                                                                  |
| ----------- | ------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------- |
| type        | 'string' \| 'array' \| 'number' \| 'boolean' \| 'date' | -      | 表单协议配置                                                                                                          |
| title       | `string`                                               | -      | 用于渲染控件 label，title 为空时，label 不渲染                                                                        |
| border      | `boolean`                                              | true   | 是否展示边框                                                                                                          |
| required    | `boolean`                                              | false  | 是否必填                                                                                                              |
| placeholder | `string`                                               | -      | 空值占位（需对应渲染控件支持 placeholder，才可生效）                                                                  |
| disabled    | `boolean`                                              | false  | 是否禁用                                                                                                              |
| readonly    | `boolean`                                              | false  | 是否只读                                                                                                              |
| hidden      | `boolean`                                              | false  | 是否隐藏当前选项                                                                                                      |
| displayType | 'row' \| 'column'                                      | 'row'  | 指定 Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示                                                 |
| className   | `string`                                               | -      | 控件类名（用来做样式覆盖）                                                                                            |
| widget      | `string`                                               | -      | 指定使用哪个组件来渲染,除内置控件外，自定义控件需要注册才可使用                                                       |
| enum        | `array`                                                | -      | 可用来生成组件的 options 的 value，例: [1,2] => [{label:1 , value:1},{label:2 , value:2}],可使用 enumNames 制定 label |
| enumNames   | `array`                                                | -      | 可用来生成组件的 options 的 label                                                                                     |
| rules       | `Rule` \| `Rule[]`                                     | -      | 指定组件校验逻辑， [Rule](./api-rule.md)                                                                              |
