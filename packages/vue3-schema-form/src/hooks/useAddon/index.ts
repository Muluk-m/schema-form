import { useParent } from '../useRelation';
import { FieldAddonKey } from '../../constants';

/**
 * 获取控件拓展属性与方法
 */
export const useAddon = () => {
  const { parent } = useParent(FieldAddonKey);

  if (!parent) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('[SchemaForm] Use this hook in SchemaForm.');
    }
  }

  return parent!.addon;
};
