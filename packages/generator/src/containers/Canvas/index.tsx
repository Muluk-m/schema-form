import {
  ref,
  defineProps,
  PropType,
  computed,
  watch,
  defineComponent,
  ExtractPropTypes,
} from 'vue';
import Draggable from 'vuedraggable';
import { createNamespace, isObj } from '@v3sf/shared';
import { SettingWidget } from '../../types';
import { MobileSimulator } from '../../simulators';
import { useGlobalCtx, useGlobalAction } from '../../hooks';
import FieldWrapper from './FieldWrapper';
import Empty from './Empty';
import './styles.scss';

const canvasProps = {
  setting: Array as PropType<SettingWidget[]>,
};

const [name, bem] = createNamespace('Canvas');

export type CanvasProps = ExtractPropTypes<typeof canvasProps>;

export const Canvas = defineComponent({
  name,

  props: canvasProps,

  setup: () => {
    const globalCtx = useGlobalCtx();
    const action = useGlobalAction();

    const dragOptions = {
      animation: 200,
      ghostClass: 'v3jsf-Canvas-FieldWrapper--put',
      sort: true,
      group: {
        name: 'canvas',
        pull: false,
        put: true,
      },
      onChange: (e) => {
        if (isObj(e?.added)) {
          action('select', e.added.element?.name);
        }
      },
    };

    return () => (
      <div class={name}>
        <MobileSimulator>
          <div class={bem('panel')}>
            <Draggable
              v-model={globalCtx.value.settingFields}
              class={bem('panel-setting')}
              itemKey='order'
              v-slots={{
                item: ({ element }) => <FieldWrapper widgetConfig={element} />,
              }}
              {...dragOptions}
            />
            {globalCtx.value.settingFields?.length === 0 && <Empty />}
          </div>
        </MobileSimulator>
      </div>
    );
  },
});
