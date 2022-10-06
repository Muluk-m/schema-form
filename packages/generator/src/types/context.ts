import { WidgetConfig, SettingWidget, Widgets } from '.';

export interface GlobalCtx {
  widgets: Widgets;
  settingWidgets: SettingWidget[];
  selected: string; // 被选中的元素id
  settingSchema: WidgetConfig['setting'];
  settingFields: WidgetConfig[];
  isEdit: boolean;
  formData: Record<string, any>;
}
