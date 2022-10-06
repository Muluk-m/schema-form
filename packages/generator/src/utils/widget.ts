import { SchemaRaw } from 'v3-schema-form';
import { Widgets } from '../types';

export const getWidget = (schema: SchemaRaw, widgets: Widgets) => {
  const { type, widget } = schema;

  let widgetName = 'default';

  if (widget) {
    widgetName = widget;
  } else {
    widgetName = type ?? 'default';
  }

  return widgets[widgetName];
};
