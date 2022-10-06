import {
  ref,
  defineProps,
  PropType,
  Component,
  computed,
  watch,
  defineComponent,
  DefineComponent,
  ExtractPropTypes,
  watchEffect,
} from 'vue';
import { createNamespace } from '@v3sf/shared';
import { SettingWidget, Widgets } from './types';
import { Sidebar, Canvas, Settings } from './containers';
import { useGlobalProvider } from './hooks';
import './index.scss';

const generatorProps = {
  settingWidgets: Array as PropType<SettingWidget[]>,
  widgets: Object as PropType<Widgets>,
};

const [name, bem] = createNamespace('Generator');

export type GeneratorProps = ExtractPropTypes<typeof generatorProps>;

export default defineComponent({
  name,

  props: generatorProps,

  setup: (props) => {
    useGlobalProvider(props);

    return () => (
      <div class={name}>
        <div class={bem('container')}>
          <Sidebar />
          <Canvas />
          <Settings />
        </div>
      </div>
    );
  },
});
