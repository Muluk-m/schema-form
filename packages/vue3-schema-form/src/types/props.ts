import type { PropType, ExtractPropTypes } from 'vue';
import { truthProp, makeStringProp } from '../utils';
import { SchemaRaw, FormData, Widgets } from '.';

export const schemaFormProps = {
  schema: {
    type: Object as PropType<SchemaRaw>,
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
  /**
   * 依赖的外部状态，用于插值表达式中的 $deps
   */
  deps: {
    type: Object,
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
