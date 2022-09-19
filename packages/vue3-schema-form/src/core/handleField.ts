import { SFRelationKey } from '../constants';
import { Schema, FormData, Widgets } from '../types';
import { useParent } from '../hooks/useRelation';

/**
 * 获取字段的渲染控件
 */
export const getWidget = (itemSchema: Schema, defaultWidgets: Widgets) => {
  const { type, widget } = itemSchema;
  const { parent } = useParent(SFRelationKey);

  const { props: rootProps } = parent!;
  const widgetMap = {
    ...defaultWidgets,
    ...rootProps.value.widgets,
  };

  let widgetName = 'default';

  if (widget) {
    widgetName = widget;
  } else {
    widgetName = type ?? 'default';
  }

  return widgetMap[widgetName];
};

/**
 * TODO refactor
 */
export const handleRemoveHiddenData = (data: FormData, fieldNames: string[]) => {
  return Object.fromEntries(Object.entries(data).filter(([key]) => fieldNames.includes(key)));
};
