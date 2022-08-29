---
title: Instance
---

# Instance

> 可通过 ref 拿到组件暴露的方法

| 属性名        | 类型                                                                   | 描述                                                                           |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| getFormData   | () => FormData                                                         | 获取表单数据(如果配置 removeHiddenData 则过滤掉 hidden 字段)                   |
| validate      | (scrollToError?: `boolean`) => Promise<ErrorMessage[]>                 | 触发整个表单校验(scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项) |
| validateField | (name: `string`, scrollToError?: `boolean`) => Promise<ErrorMessage[]> | 校验单个字段                                                                   |
