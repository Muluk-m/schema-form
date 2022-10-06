import { defineComponent, ExtractPropTypes } from 'vue';
import { createNamespace } from '@v3sf/shared';

const widgetItemProps = {
  title: String,
  id: String,
};

const [name, bem] = createNamespace('WidgetItem');

export type WidgetItemProps = ExtractPropTypes<typeof widgetItemProps>;

export default defineComponent({
  name,

  props: widgetItemProps,

  setup: (props) => {
    return () => (
      <div class={name}>
        <span class={bem('title')}>{props.title}</span>
      </div>
    );
  },
});
