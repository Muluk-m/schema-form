import { InjectionKey, Ref } from 'vue';
import { GlobalCtx } from 'src/types';

export const GlobalCtxSymbol: InjectionKey<Ref<GlobalCtx>> = Symbol('form');
