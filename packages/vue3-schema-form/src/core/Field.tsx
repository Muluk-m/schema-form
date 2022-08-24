import { defineComponent, computed, inject, PropType } from 'vue';
import { Cell } from 'vant';
import { useParent } from '../hooks/useRelation';
import { createNamespace, makeStringProp } from '../utils';
import Label from './Label';
import { SFDataKey, SFPropsKey, SFRelationKey } from '../constants';
import { FieldWidgetAddon } from '../types';
import { getWidget } from './handleField';
import defaultWidgets from '../widgets';

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

    const fieldProps = computed(() => ({
      disabled: props.addon.disabled,
      readonly: props.addon.readonly,
      class: props.addon.className,
      placeholder: props.addon.placeholder,
      ...props.addon.props,
    }));

    const Widget = getWidget(props.addon.schema, defaultWidgets);

    return () => (
      // <div
      //   class={bem({
      //     column: (props.addon.schema.displayType ?? sfProps?.value.displayType) === 'column',
      //   })}
      // >
      //   <div>
      //     {props.addon.schema.title && (
      //       <Label title={props.addon.schema.title} required={props.addon.required} />
      //     )}
      //   </div>
      //   <div>
      //     <div class={bem('wrapper')}>
      //       <Widget v-model={fieldValue.value} addon={props.addon} {...fieldProps.value} />
      //       <div class={bem('error-message')}>{props.errorMessage}</div>
      //     </div>
      //   </div>
      // </div>
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
            <div class={bem('wrapper')}>
              <Widget v-model={fieldValue.value} addon={props.addon} {...fieldProps.value} />
              <div class={bem('error-message')}>{props.errorMessage}</div>
            </div>
          ),
        }}
      />
    );
  },
});
