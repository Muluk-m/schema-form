import {
  ref,
  defineProps,
  PropType,
  computed,
  watch,
  defineComponent,
  ExtractPropTypes,
} from 'vue';
import { createNamespace } from '@v3sf/shared';
import FieldMask from './FieldMask';
import { useGlobalCtx, useGlobalAction } from '../../hooks';
import { WidgetConfig } from '../../types';

const fieldWrapperProps = {
  widgetConfig: Object as PropType<WidgetConfig>,
};

const [name, bem] = createNamespace('Canvas-FieldWrapper');

export type FieldWrapperProps = ExtractPropTypes<typeof fieldWrapperProps>;

export default defineComponent({
  name,

  props: fieldWrapperProps,

  setup: (props) => {
    const globalCtxRef = useGlobalCtx();
    const globalAction = useGlobalAction();

    const isSelected = computed(() => globalCtxRef.value.selected === props.widgetConfig?.name);

    const changeSelected = () => {
      globalAction('select', props.widgetConfig?.name ?? '');
    };

    return () => (
      <div
        class={bem({ selected: isSelected.value })}
        onMousedown={changeSelected}
      >
        <FieldMask
          show={isSelected.value}
          name={props.widgetConfig?.name}
        >
          <div class={bem('content')}>
            <span>{props.widgetConfig?.schema.title ?? props.widgetConfig?.name} </span>
          </div>
        </FieldMask>
      </div>
    );
  },
});
