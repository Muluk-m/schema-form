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
import { useGlobalCtx, useGlobalAction } from '../../hooks';
import { WidgetConfig } from '../../types';
import { getWidget } from '../../utils';

const renderFieldProps = {
  widgetConfig: Object as PropType<WidgetConfig>,
};

const [name, bem] = createNamespace('Canvas-RenderField');

export type RenderFieldProps = ExtractPropTypes<typeof renderFieldProps>;

export default defineComponent({
  name,

  props: renderFieldProps,

  setup: (props) => {
    const globalCtxRef = useGlobalCtx();

    const Widget = getWidget(props.widgetConfig?.schema ?? {}, globalCtxRef.value.widgets);

    return () => (
      <div class={name}>
        <Widget />
      </div>
    );
  },
});
