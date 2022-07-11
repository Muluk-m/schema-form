import type { PropType, ExtractPropTypes } from 'vue';
import { pick, makeRequiredProp, truthProp } from '@/utils';
import { Schema, FormData, Widgets } from '.';

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
  displayType: {
    type: String as PropType<'row' | 'column'>,
    default: 'row',
  },
  /** 是否显示边框 */
  border: truthProp,
  /** 是否展示校验错误信息 */
  inlineErrorMessage: truthProp,
};

export type SchemaFormProps = ExtractPropTypes<typeof schemaFormProps>;

export const fieldWidgetAddon = {
  /** 表单项的key */ name: makeRequiredProp(String),
  /** 根节点的schema */
  rootSchema: schemaFormProps.schema,
  placeholder: {
    type: String as PropType<string>,
  },
  className: {
    type: String as PropType<string>,
  },
  required: Boolean,
  /** 可在自定义控件内，使用该方法通过name变更其他控件的值 */
  changeValueByName: Function as PropType<(name: string, value: any) => void>,
  /** 批量更新数据 */
  batchChangeValue: Function as PropType<(values: Record<string, unknown>) => void>,
  ...pick(schemaFormProps, ['schema', 'disabled', 'readonly']),
};

export interface FieldWidgetAddon
  extends Pick<SchemaFormProps, 'schema' | 'disabled' | 'readonly'> {
  /** 表单项的key */
  name: string;
  /** 根节点的schema */
  rootSchema: Schema;
  placeholder?: string;
  className?: string;
  required?: boolean;
  props?: Record<string, any>;
  /** 可在自定义控件内，使用该方法通过name变更其他控件的值 */
  changeValueByName: (name: string, value: any) => void;
  /** 批量更新数据 */
  batchChangeValue: (values: Record<string, unknown>) => void;
  /** 获取表单值 */
  getValues: () => any;
}

export const widgetAddonDefine = {
  type: Object as PropType<FieldWidgetAddon>,
  default: () => ({}),
};

type ErrorMessage = {
  name: string;
  error: string[];
};

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
   * 校验单个字段
   * @param {string} name 要校验的字段名
   * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
   */
  validateField: (name: string, scrollToError?: boolean) => Promise<string[]>;
};
