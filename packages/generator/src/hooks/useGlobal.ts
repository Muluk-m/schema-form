import { provide, inject, computed, ref } from 'vue';
import { GlobalCtx, SettingWidget } from 'src/types';
import { GlobalCtxSymbol } from '../constants';

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

export const useGlobalProvider = (settingWidgets: SettingWidget[]) => {
  const globalRef = ref<GlobalCtx>({
    selected: '',
    settingSchema: {},
    settingWidgets,
    settingFields: [],
    isEdit: true,
    formData: {},
  });

  provide(GlobalCtxSymbol, globalRef);
};
