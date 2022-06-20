import { Schema, Options } from '../types';

export const getWidgetOptionsBySchema = (schema: Schema, options: Options[]) => {
  let res: Options[] = [];

  if (options && options.length > 0) {
    // 如果有props中指定options，则直接使用options
    res = options;
  } else if (schema.enum && schema.enum.length > 0) {
    // 如果不指定options，则使用schema中的enum生成options
    // 如果不指定enumNames，label使用value
    const labels = schema.enumNames || schema.enum;
    res = schema.enum!.map((value, index) => ({
      label: labels[index] as string,
      value,
      props: {},
    }));
  }

  return res;
};
