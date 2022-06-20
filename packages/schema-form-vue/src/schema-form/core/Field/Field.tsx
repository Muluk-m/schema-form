import { defineComponent, computed, inject, PropType } from 'vue';
import { Cell } from 'vant';
import { useParent } from '@/hooks/useRelation';
import { createNamespace, makeStringProp } from '@/utils';
import Label from './Label';
import { SFDataKey, SFPropsKey, SFRelationKey } from '../../constants';
import { getWidget } from '../../utils';
import { FieldWidgetAddon } from '../../types';

const [name, bem] = createNamespace('form-field');

/**
 * 表单项
 */
export default defineComponent({
  name,

  props: {
    name: makeStringProp(''),
    addon: {
      type: Object as PropType<FieldWidgetAddon>,
      required: true,
    },
    errorMessage: makeStringProp(''),
  },

  setup: (props) => {
    useParent(SFRelationKey);

    const formData = inject(SFDataKey);
    const sfProps = inject(SFPropsKey);

    const changeFieldValue = (value: any) => {
      if (formData) {
        formData.value[props.addon.name] = value;
      }
    };

    const fieldValue = computed({
      get: () => formData?.value[props.addon.name],
      set: (value: unknown) => changeFieldValue(value),
    });

    const Widget = getWidget(props.addon.schema);

    return () => (
      <Cell
        border={props.addon.schema.border ?? sfProps?.value.border}
        class={bem({
          column: (props.addon.schema.displayType ?? sfProps?.value.displayType) === 'column',
        })}
        v-slots={{
          title: () =>
            props.addon.schema.title && (
              <Label title={props.addon.schema.title} required={props.addon.required} />
            ),
          value: () => (
            <>
              <Widget v-model={fieldValue.value} addon={props.addon} />
              <div class={bem('error-message')}>{props.errorMessage}</div>
            </>
          ),
        }}
      />
    );
  },
});
