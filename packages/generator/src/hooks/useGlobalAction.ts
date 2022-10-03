import { useGlobalCtx } from './useGlobal';
import { WidgetConfig } from '../types';

const findFieldConfigByName = (name: string, settingFields: WidgetConfig[]) => {
  return settingFields.find((field) => field?.name === name);
};

const findSettingSchemaByName = (name: string, settingFields: WidgetConfig[]) => {
  return findFieldConfigByName(name, settingFields)?.setting;
};

const distributeAction = (ctxRef: ReturnType<typeof useGlobalCtx>, type: string, payload: any) => {
  if (type === 'select') {
    ctxRef.value.selected = payload;
    ctxRef.value.settingSchema = findSettingSchemaByName(payload, ctxRef.value.settingFields) ?? {};
  }
  if (type === 'editToggle') {
    ctxRef.value.isEdit = !ctxRef.value.isEdit;
  }
};

export const useGlobalAction = () => {
  const globalCtxRef = useGlobalCtx();

  function dispatchGlobalAction(type: 'select', payload: string);
  function dispatchGlobalAction(type: 'editToggle', payload: void);
  function dispatchGlobalAction(type: string, payload: any) {
    distributeAction(globalCtxRef, type, payload);
  }

  return dispatchGlobalAction;
};
