import { defineComponent, computed, ExtractPropTypes, PropType } from 'vue';
import { CheckboxGroup, Checkbox } from 'vant';
import { createNamespace, makeArrayProp, getWidgetOptionsBySchema } from '../../utils';
import { FieldWidgetAddon } from '../../types';
import { useAddon } from '../../hooks/useAddon';

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
    const addon = useAddon();

    const value = computed({
      get: () => props.modelValue,
      set: (value: any[]) => {
        emit('update:modelValue', value);
      },
    });

    const checkboxProps = computed(() => ({
      ...addon.value.props,
    }));

    const checkboxOptions = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? [])
    );

    return () => (
      <div class={name}>
        <CheckboxGroup
          v-model={value.value}
          direction='horizontal'
          {...checkboxProps.value}
        >
          {checkboxOptions.value.map(({ label, value, props }) => (
            <Checkbox
              key={value}
              name={value}
              {...props}
            >
              {label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    );
  },
});
