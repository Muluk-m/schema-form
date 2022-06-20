import { inject } from 'vue';
import fieldsWidgetMap from '../widgets';
import { SFPropsKey } from '../constants';
import { Schema, FormData, PayloadBoolean, SchemaFormProps } from '../types';
import { isFunction } from '@/utils';

export const getPayloadBoolean = (
  payload: PayloadBoolean | undefined,
  data: FormData,
  globalState?: boolean
) => {
  if (payload) {
    return isFunction(payload) ? payload(data) : payload;
  }

  return globalState ?? false;
};

export const getFieldConfigs = ({
  schema: rootSchema,
  modelValue: formData,
  disabled,
  readOnly,
}: SchemaFormProps) => {
  const { properties, type } = rootSchema;

  if (!properties || type !== 'object') {
    console.error('schema irregularities');
    return [];
  }

  const changeValueByName = (name: string, value: unknown) => {
    if (formData) {
      formData[name] = value;
    }
  };

  const getFieldProps = (schema: Schema) => ({
    rootSchema,
    disabled: getPayloadBoolean(schema.disabled, formData, disabled),
    readOnly: getPayloadBoolean(schema.readOnly, formData, readOnly),
    required: getPayloadBoolean(schema.required, formData),
    placeholder: schema.placeholder,
    className: schema.className,
    changeValueByName,
  });

  const hideItems = (properties: Schema['properties']) =>
    Object.fromEntries(
      Object.entries(properties!).filter(([, { hidden }]) => !getPayloadBoolean(hidden, formData))
    );

  return Object.entries(hideItems(properties)).map(([name, schema]) => ({
    name,
    schema,
    ...getFieldProps(schema),
  }));
};

/** 获取字段的渲染控件 */
export const getWidget = (itemSchema: Schema) => {
  const { type, widget } = itemSchema;
  const rootProps = inject(SFPropsKey)?.value;
  const widgetMap: Record<string, any> = {
    ...fieldsWidgetMap,
    ...rootProps?.widgets,
  };

  let widgetName = 'default';

  if (widget) {
    widgetName = widget;
  } else {
    widgetName = type ?? 'default';
  }

  return widgetMap[widgetName];
};

export const handleRemoveHiddenData = (data: FormData, fieldsConfig: any) => {
  const fieldNames = fieldsConfig.map(({ name }: any) => name);
  return Object.fromEntries(Object.entries(data).filter(([key]) => fieldNames.includes(key)));
};
