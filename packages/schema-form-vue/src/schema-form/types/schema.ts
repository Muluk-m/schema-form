import { RuleItem } from 'async-validator';
import { FormData } from './basic';

export type SchemaType = 'string' | 'object' | 'array' | 'number' | 'boolean' | 'date' | string;

export type PayloadBoolean = boolean | ((data: FormData) => boolean);
interface SchemaBase {
  type: SchemaType;
  title: string;
  /** 默认值 ！暂时不支持，如果有场景需要，可以考虑支持 */
  // default: any;
  /** 是否必填，支持函数表达式 (formData)=> boolean */
  required: boolean | PayloadBoolean;
  placeholder: string;
  /** 改变字段绑定值 用户并不希望纯展示的字段也出现在表单中，此时，使用 bind: false 可避免字段在提交时出现 */
  // bind: false | string | string[];
  /** 是否禁用，支持函数表达式 (formData)=> boolean */
  disabled: boolean | PayloadBoolean;
  /** 是否只读，支持函数表达式 (formData)=> boolean */
  readonly: boolean | PayloadBoolean;
  /** 是否隐藏，隐藏的字段不会在 formData 里透出，支持函数表达式 (formData)=> boolean */
  hidden: boolean | PayloadBoolean;
  /** Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示 */
  displayType: 'row' | 'column' | string;
  /** label宽度 ！暂时不支持，如果有场景需要，可以考虑支持 */
  // labelWidth: number | string;
  className: string;
  /** 指定使用哪个组件来渲染 */
  widget: string;
  properties: Record<string, Schema>;
  /** 多选 */
  enum: Array<string | number>;
  /** 多选label */
  enumNames: Array<string | number>;
  rules: RuleItem | RuleItem[];
  /** 透传到对应渲染组件 */
  props: Record<string, any>;
  /** 是否展示下边框 */
  border: boolean;
}

export type Schema = Partial<SchemaBase>;
