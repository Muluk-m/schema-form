import { defineComponent, computed, ExtractPropTypes, PropType } from 'vue';
import { CheckboxGroup, Checkbox } from 'vant';
import { createNamespace, makeArrayProp } from '@/utils';
import { getWidgetOptionsBySchema } from '../../utils';
import { FieldWidgetAddon } from '../../types';

const checkboxProps = {
  modelValue: makeArrayProp<any>(),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-checkbox');

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;

/**
 * 多选框
 */
export default defineComponent({
  name,

  props: checkboxProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const value = computed({
      get: () => props.modelValue,
      set: (value: any[]) => {
        emit('update:modelValue', value);
      },
    });

    const checkboxProps = computed(() => ({
      ...props.addon.props,
    }));

    const checkboxOptions = computed(() =>
      getWidgetOptionsBySchema(props.addon.schema, props.addon.props?.options ?? [])
    );

    return () => (
      <div class={name}>
        <CheckboxGroup v-model={value.value} direction='horizontal' {...checkboxProps.value}>
          {checkboxOptions.value.map(({ label, value, props }) => (
            <Checkbox key={value} name={value} {...props}>
              {label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    );
  },
});
