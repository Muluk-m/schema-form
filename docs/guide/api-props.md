---
title: Props
---

# {{ $frontmatter.title }}

> SchemaForm 组件的 props

| 属性名             | 类型              | 默认值 | 描述                                                                      |
| ------------------ | ----------------- | ------ | ------------------------------------------------------------------------- |
| schema             | `object`          | {}     | 表单协议配置                                                              |
| v-model            | `object`          | {}     | 表单 data                                                                 |
| disabled           | `boolean`         | false  | 全局禁用                                                                  |
| readonly           | `boolean`         | false  | 全局只读                                                                  |
| removeHiddenData   | `boolean`         | false  | getFormData 时是否过滤 hidden 为 true 的字段                              |
| debug              | `boolean`         | false  | 表单值变更时，控制台输出日志                                              |
| displayType        | 'row' \| 'column' | 'row'  | 统一指定 Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示 |
| border             | `boolean`         | true   | 是否展示边框                                                              |
| inlineErrorMessage | `boolean`         | false  | 是否在行内展示校验错误信息                                                |
