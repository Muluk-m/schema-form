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

const fieldMaskProps = {
  show: Boolean,
};

const [name, bem] = createNamespace('Canvas-FieldMask');

export type FieldMaskProps = ExtractPropTypes<typeof fieldMaskProps>;

export default defineComponent({
  name,

  props: fieldMaskProps,

  setup: (props, { slots }) => {
    return () => {
      if (!props.show) {
        return slots.default?.();
      }

      return (
        <div class={name}>
          <div class={bem('helper')}>{/* <span>操作</span> */}</div>
          <div class={bem('slot')}>{slots.default?.()}</div>
        </div>
      );
    };
  },
});
