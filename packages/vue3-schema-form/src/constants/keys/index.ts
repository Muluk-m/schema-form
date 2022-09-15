import { InjectionKey, Ref } from 'vue';
import { SchemaFormProps, FormData, FieldWidgetAddon } from '../../types';

export const SFPropsKey: InjectionKey<Ref<SchemaFormProps>> = Symbol('sf-props');
export const SFDataKey: InjectionKey<Ref<FormData>> = Symbol('sf-data');
export const SFRelationKey: InjectionKey<{
  props: Ref<SchemaFormProps>;
  formData: Ref<FormData>;
}> = Symbol('sf-relation');

export const FieldAddonKey: InjectionKey<{ addon: Ref<FieldWidgetAddon> }> = Symbol('field-addon');
