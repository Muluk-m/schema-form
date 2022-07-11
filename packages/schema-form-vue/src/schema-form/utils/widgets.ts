import { Schema, Options } from '../types';

export const getWidgetOptionsBySchema = (schema: Schema, options: Options[]) => {
  // eslint-disable-next-line no-underscore-dangle
  let _options: Options[] = [];

  if (options && options.length > 0) {
    // 如果有props中指定options，则直接使用options
    _options = options;
  } else if (schema.enum && schema.enum.length > 0) {
    // 如果不指定options，则使用schema中的enum生成options
    // 如果不指定enumNames，label使用value
    const labels = schema.enumNames || schema.enum;
    _options = schema.enum!.map((value, index) => ({
      label: labels[index] as string,
      value,
      props: {},
    }));
  }

  return _options;
};
