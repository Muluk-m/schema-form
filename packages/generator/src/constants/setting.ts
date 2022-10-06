import { defineAsyncComponent } from 'vue';
import { uid } from '@v3sf/shared';
import { WidgetConfig, SettingWidget } from '../types';

const fieldsWidgetMap = {
  input: defineAsyncComponent(() => import('vant/es/Field')),
  checkbox: defineAsyncComponent(() => import('vant/es/Checkbox')),
  switch: defineAsyncComponent(() => import('vant/es/Switch')),
  stepper: defineAsyncComponent(() => import('vant/es/Stepper')),
  radio: defineAsyncComponent(() => import('vant/es/Radio')),
  picker: defineAsyncComponent(() => import('vant/es/Picker')),
  cascader: defineAsyncComponent(() => import('vant/es/Cascader')),
  date: defineAsyncComponent(() => import('vant/es/datetime-picker')),
};

const fieldTypeMap = {
  string: fieldsWidgetMap.input,
  array: fieldsWidgetMap.checkbox,
  boolean: fieldsWidgetMap.switch,
  number: fieldsWidgetMap.stepper,
  date: fieldsWidgetMap.date,
};

export const defaultWidgets = {
  ...fieldsWidgetMap,
  ...fieldTypeMap,
};

const basicSettingSchema = {
  name: {
    type: 'string',
    title: '字段标识',
    placeholder: '请输入',
    required: true,
  },
  title: {
    type: 'string',
    title: '标题',
    placeholder: '请输入',
  },
  placeholder: {
    type: 'string',
    title: '占位符',
    placeholder: '请输入',
  },
  displayType: {
    type: 'string',
    title: '标题展示模式',
    widget: 'radio',
    enum: ['column', 'row'],
    enumNames: ['独占一行', '同行展示'],
  },
  required: {
    type: 'boolean',
    title: '是否必填',
  },
};

const basicWidgets: WidgetConfig[] = [
  {
    text: '输入框',
    name: uid(),
    schema: {
      type: 'string',
      title: '输入框',
      placeholder: '请输入',
    },
    setting: basicSettingSchema,
  },
  {
    text: '单选框',
    name: uid(),
    schema: {
      type: 'string',
      title: '输入框',
      placeholder: '请输入',
    },
    setting: basicSettingSchema,
  },
  {
    text: '复选框',
    name: uid(),
    schema: {
      type: 'string',
      title: '输入框',
      placeholder: '请输入',
    },
    setting: basicSettingSchema,
  },
];

export const defaultSettingWidgets: SettingWidget[] = [
  { scope: 'basic', text: '基础组件', widgets: basicWidgets },
];
