import { provide, inject, computed, ref, watchEffect } from 'vue';
import { GlobalCtx } from '../types';
import { GeneratorProps } from '..';
import { GlobalCtxSymbol } from '../constants';
import { mergeWidgets, mergeSettingWidgets } from '../utils';

export const useGlobalCtx = () => {
  const globalCtxRef = inject(GlobalCtxSymbol)!;
  const setGlobalCtx = (newValue: Partial<GlobalCtx>) => {
    globalCtxRef.value = { ...globalCtxRef.value, ...newValue };
  };

  return computed({
    get: () => globalCtxRef.value,
    set: setGlobalCtx,
  });
};

export const useGlobalProvider = (props: GeneratorProps) => {
  const ctxRef = ref<GlobalCtx>({
    selected: '',
    settingSchema: {},
    widgets: {},
    settingWidgets: [],
    settingFields: [],
    isEdit: true,
    formData: {},
  });

  watchEffect(() => {
    ctxRef.value.settingWidgets = mergeSettingWidgets(props.settingWidgets ?? []);
    ctxRef.value.widgets = mergeWidgets(props.widgets ?? {});
  });

  provide(GlobalCtxSymbol, ctxRef);
};
