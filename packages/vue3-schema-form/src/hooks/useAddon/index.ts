import { Ref } from 'vue';
import { useParent } from '../useRelation';
import { FieldAddonKey } from '../../constants';
import { FieldWidgetAddon, FormData } from '../../types';

/**
 * 获取控件拓展属性与方法
 */
export const useAddon = <FD extends FormData = FormData>() => {
  const { parent } = useParent(FieldAddonKey);

  if (!parent) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('[SchemaForm] Use this hook in SchemaForm.');
    }
  }

  return parent!.addon as Ref<FieldWidgetAddon<FD>>;
};
