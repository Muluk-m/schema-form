import { defineComponent, ExtractPropTypes } from 'vue';
import { createNamespace, makeStringProp } from '../../utils';

const fieldLabelProps = {
  title: makeStringProp(''),
  required: {
    type: Boolean,
    default: false,
  },
  /** Label 与 Field 的展示关系，row 表示并排展示，column 表示两排展示 */
  displayType: makeStringProp('row'),
};

const [name, bem] = createNamespace('form-field-label');

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
            column: props.displayType === 'column',
          })}
        >
          {props.title}
        </div>
      </div>
    );
  },
});
