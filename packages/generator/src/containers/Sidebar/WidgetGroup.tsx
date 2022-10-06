import { PropType, defineComponent, ExtractPropTypes } from 'vue';
import { createNamespace } from '@v3sf/shared';
import Draggable from 'vuedraggable';
import { SettingWidget } from '../../types';

import WidgetItem from './WidgetItem';

const widgetGroupProps = {
  settingWidget: Object as PropType<SettingWidget>,
};

const [name, bem] = createNamespace('WidgetGroup');

export type WidgetGroupProps = ExtractPropTypes<typeof widgetGroupProps>;

export default defineComponent({
  name,

  props: widgetGroupProps,

  setup: (props) => {
    const dragOptions = {
      animation: 200,
      disabled: false,
      ghostClass: 'v3jsf-WidgetItem--put',
      sort: false,
      group: {
        name: 'widgets',
        pull: 'clone',
        put: false,
      },
    };

    return () => (
      <div class={name}>
        <div class={bem('header')}>
          <span class={bem('title')}>{props?.settingWidget?.text}</span>
        </div>
        <div class={bem('content')}>
          <Draggable
            list={props?.settingWidget?.widgets}
            class={bem('content-wrapper')}
            itemKey='name'
            v-slots={{
              item: ({ element }) => <WidgetItem title={element.text} />,
            }}
            {...dragOptions}
          />
        </div>
      </div>
    );
  },
});
