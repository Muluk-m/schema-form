import type { PropType, ExtractPropTypes } from 'vue';
import { truthProp, makeStringProp } from '../utils';
import { Schema, FormData, Widgets } from '.';

export type ErrorMessage = {
  name: string;
  error: string[];
};

export const schemaFormProps = {
  schema: {
    type: Object as PropType<Schema>,
    default: () => ({}),
  },
  /** 表单值 */
  modelValue: {
    type: Object as PropType<FormData>,
    default: () => ({}),
  },
  /** 自定义组件 */
  widgets: {
    type: Object as PropType<Widgets>,
    default: () => ({}),
  },
  /** 只读模式 */
  readonly: Boolean,
  /** 禁用模式 */
  disabled: Boolean,
  /** 是否过滤hidden字段，默认false */
  removeHiddenData: Boolean,
  /** debug模式 表单值变更时，控制台输出日志 */
  debug: Boolean,
  /** 统一指定Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示 */
  displayType: makeStringProp<'row' | 'column'>('row'),
  /** 是否显示边框 */
  border: truthProp,
  /** 是否展示校验错误信息 */
  inlineErrorMessage: Boolean,
};

export type SchemaFormProps = ExtractPropTypes<typeof schemaFormProps>;

export interface FieldWidgetAddon
  extends Pick<SchemaFormProps, 'schema' | 'disabled' | 'readonly'> {
  /** 对应字段code */
  name: string;
  /** 根节点的schema */
  rootSchema: Schema;
  placeholder?: string;
  className?: string;
  required?: boolean;
  props?: Record<string, any>;
  /**
   * formData = { a:1, b:2 }
   * setFormData({ a:2 })  // formData { a:2, b:2 }
   */
  setFormData: (newFormData: Partial<FormData>) => void;
  /** 获取表单值 */
  getFormData: () => FormData;
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>;
  validateFields: (fields: string[], scrollToError?: boolean) => Promise<ErrorMessage[]>;
}

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
