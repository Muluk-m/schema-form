import {
  ref,
  defineProps,
  PropType,
  computed,
  watch,
  useSlots,
  defineComponent,
  ExtractPropTypes,
} from 'vue';
import { createNamespace } from '@v3sf/shared';
import { Icon } from 'vant';
import { useGlobalAction } from '../../hooks';

const fieldMaskProps = {
  show: Boolean,
  name: String,
};

const [name, bem] = createNamespace('Canvas-FieldMask');

export type FieldMaskProps = ExtractPropTypes<typeof fieldMaskProps>;

export default defineComponent({
  name,

  props: fieldMaskProps,

  setup: (props, { slots }) => {
    const globalAction = useGlobalAction();

    const deleteItem = (name) => {
      globalAction('delate', name);
    };

    const copyItem = (name) => {
      globalAction('copy', name);
    };

    return () => {
      if (!props.show) {
        return slots.default?.();
      }

      return (
        <div class={name}>
          <div class={bem('helper')}>
            <Icon
              class={bem('btn')}
              name='description'
              color='#fff'
              onClick={(e: Event) => {
                e.stopPropagation();
                copyItem(props.name);
              }}
            />
            <Icon
              class={bem('btn')}
              name='delete-o'
              color='#fff'
              onClick={(e: Event) => {
                e.stopPropagation();
                deleteItem(props.name);
              }}
            />
          </div>
          <div class={bem('slot')}>{slots.default?.()}</div>
        </div>
      );
    };
  },
});
