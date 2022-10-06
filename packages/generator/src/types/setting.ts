import { SchemaRaw } from 'v3-schema-form';

export interface WidgetConfig {
  text: string;
  name: string;
  schema: SchemaRaw;
  setting: SchemaRaw['properties'];
}

export interface SettingWidget {
  scope: string;
  text: string;
  widgets: WidgetConfig[];
}
