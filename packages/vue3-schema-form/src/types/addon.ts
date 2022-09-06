import { SchemaFormProps, Schema, ErrorMessage } from '.';

export type FormData = Record<string, any>;

export type Widgets = Record<string, any>;

export interface FieldWidgetAddon<FD extends FormData = FormData>
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
  setFormData: (newFormData: Partial<FD>) => void;
  /** 获取表单值 */
  getFormData: () => FD;
  validate: (scrollToError?: boolean) => Promise<ErrorMessage[]>;
  validateFields: (fields: (keyof FD)[], scrollToError?: boolean) => Promise<ErrorMessage[]>;
}
