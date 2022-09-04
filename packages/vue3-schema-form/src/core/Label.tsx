import { defineComponent, ExtractPropTypes } from 'vue';
import { createNamespace, makeStringProp } from '../utils';

const fieldLabelProps = {
  title: makeStringProp(''),
  required: Boolean,
};

const [name, bem] = createNamespace('field-label');

export type FieldLabelProps = ExtractPropTypes<typeof fieldLabelProps>;

/**
 * 表单项标题
 */
export default defineComponent({
  name,

  props: fieldLabelProps,

  setup: (props) => {
    return () => (
      <div class={name}>
        <div
          class={bem('text', {
            required: props.required,
          })}
        >
          {props.title}
        </div>
      </div>
    );
  },
});
