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
import { useGlobalCtx } from '../../hooks';
import WidgetGroup from './WidgetGroup';
import { SettingWidget } from '../../types';
import './styles.scss';

// const sidebarProps = {
// settingWidgets: Array as PropType<SettingWidget[]>,
// };

const [name, bem] = createNamespace('Sidebar');

// export type SidebarProps = ExtractPropTypes<typeof sidebarProps>;

export const Sidebar = defineComponent({
  name,

  // props: sidebarProps,

  setup: () => {
    const globalCtxRef = useGlobalCtx();

    return () => (
      <div class={name}>
        <div class={bem('header')} />
        <div class={bem('body')}>
          {globalCtxRef.value?.settingWidgets?.map((settingWidget) => (
            <WidgetGroup settingWidget={settingWidget} />
          ))}
        </div>
      </div>
    );
  },
});
