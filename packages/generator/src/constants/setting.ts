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

const defaultOptions = {
  enum: ['a', 'b', 'c'],
  enumNames: ['早', '中', '晚'],
};

const optionsSetting = {
  type: 'array',
  title: '选型',
  widget: 'enumGenerator',
};

const getBasicSettingSchema = (isSelect = false) => ({
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
  ...(isSelect ? { enum: optionsSetting } : {}),
});

const basicWidgets: WidgetConfig[] = [
  {
    text: '输入框',
    name: uid(),
    schema: {
      type: 'string',
      title: '输入框',
      placeholder: '请输入',
    },
    setting: getBasicSettingSchema(),
  },
  {
    text: '单选框',
    name: uid(),
    schema: {
      type: 'string',
      title: '单选框',
      widget: 'radio',
      ...defaultOptions,
    },
    setting: getBasicSettingSchema(true),
  },
  {
    text: '复选框',
    name: uid(),
    schema: {
      type: 'array',
      title: '复选框',
      ...defaultOptions,
    },
    setting: getBasicSettingSchema(true),
  },
  {
    text: '选择器',
    name: uid(),
    schema: {
      type: 'string',
      title: '选择器',
      ...defaultOptions,
    },
    setting: getBasicSettingSchema(true),
  },
  {
    text: '开关',
    name: uid(),
    schema: {
      type: 'boolean',
      title: '开关',
    },
    setting: getBasicSettingSchema(),
  },
  {
    text: '步进器',
    name: uid(),
    schema: {
      type: 'number',
      title: '步进器',
    },
    setting: getBasicSettingSchema(),
  },
];

export const defaultSettingWidgets: SettingWidget[] = [
  { scope: 'basic', text: '基础组件', widgets: basicWidgets },
];
