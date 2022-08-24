import { defineAsyncComponent } from 'vue';
import './index.scss';

const fieldsWidgetMap = {
  input: defineAsyncComponent(() => import('./vant/Input')),
  checkbox: defineAsyncComponent(() => import('./vant/Checkbox')),
  switch: defineAsyncComponent(() => import('./vant/Switch')),
  stepper: defineAsyncComponent(() => import('./vant/Stepper')),
  radio: defineAsyncComponent(() => import('./vant/Radio')),
  picker: defineAsyncComponent(() => import('./vant/Picker')),
  cascader: defineAsyncComponent(() => import('./vant/Cascader')),
  date: defineAsyncComponent(() => import('./vant/Date')),
  radioButton: defineAsyncComponent(() => import('./vant/RadioButton')),
};

const fieldTypeMap = {
  string: fieldsWidgetMap.input,
  array: fieldsWidgetMap.checkbox,
  boolean: fieldsWidgetMap.switch,
  number: fieldsWidgetMap.stepper,
  date: fieldsWidgetMap.date,
};

export default {
  ...fieldsWidgetMap,
  ...fieldTypeMap,
};
