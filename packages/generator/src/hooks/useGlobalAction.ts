import { uid } from '@v3sf/shared';
import { useGlobalCtx } from './useGlobal';
import { WidgetConfig } from '../types';

type GlobalCtx = ReturnType<typeof useGlobalCtx>;

const findFieldConfigByName = (name: string, settingFields: WidgetConfig[]) => {
  return settingFields.find((field) => field?.name === name);
};

const findFieldIndexByName = (name: string, settingFields: WidgetConfig[]) => {
  return settingFields.findIndex((field) => field?.name === name);
};

const findSettingSchemaByName = (name: string, settingFields: WidgetConfig[]) => {
  return findFieldConfigByName(name, settingFields)?.setting;
};

function distributeAction(ctxRef: GlobalCtx, type: 'select', payload: string): void;
function distributeAction(ctxRef: GlobalCtx, type: 'editToggle', payload: void): void;
function distributeAction(ctxRef: GlobalCtx, type: 'delate', payload: string): void;
function distributeAction(ctxRef: GlobalCtx, type: 'copy', payload: string): void;
function distributeAction(ctxRef: GlobalCtx, type: string, payload: any) {
  if (type === 'select') {
    ctxRef.value.selected = payload;
    ctxRef.value.settingSchema = findSettingSchemaByName(payload, ctxRef.value.settingFields) ?? {};
  }

  if (type === 'editToggle') {
    ctxRef.value.isEdit = !ctxRef.value.isEdit;
  }

  if (type === 'delate') {
    const fields = ctxRef.value.settingFields;
    const curIndex = findFieldIndexByName(payload, fields);

    ctxRef.value.settingFields.splice(curIndex, 1);
    ctxRef.value.selected = (fields[curIndex - 1] ?? fields[0])?.name ?? '';
  }

  if (type === 'copy') {
    const fields = ctxRef.value.settingFields;
    const curIndex = findFieldIndexByName(payload, fields);
    const targetItem = findFieldConfigByName(payload, fields)!;
    const newName = uid();
    const newItem = { ...targetItem, name: newName };

    ctxRef.value.settingFields.splice(curIndex + 1, 0, newItem);
    ctxRef.value.selected = newName;
  }
}

export const useGlobalAction = () => {
  const globalCtxRef = useGlobalCtx();

  const dispatchGlobalAction = (type: any, payload: any) => {
    distributeAction(globalCtxRef, type, payload);
  };

  return dispatchGlobalAction;
};
