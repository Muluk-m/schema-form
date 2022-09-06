import { ErrorMessage } from '.';

export type FormRef = {
  /**
   * 获取表单数据
   * 如果配置removeHiddenData 则过滤掉hidden字段
   */
  getFormData: () => FormData;
  /**
   * 触发整个表单校验
   * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
   */
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>;
  /**
   * 校验一组字段
   * @param {string[]} fields 要校验的字段名
   * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
   */
  validateFields: (fields: string[], scrollToError?: boolean) => Promise<ErrorMessage[]>;
};
