import { defineComponent, computed, ExtractPropTypes, PropType } from 'vue';
import { Button } from 'vant';
import { createNamespace, makeStringProp, makeArrayProp } from '@/utils';
import { getWidgetOptionsBySchema } from '../../utils';
import { FieldWidgetAddon, Options } from '../../types';

const radioButtonProps = {
  modelValue: makeStringProp(''),
  options: makeArrayProp<Options>(),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-radioButton');

export type RadioButtonProps = ExtractPropTypes<typeof radioButtonProps>;

/**
 * 单选框组件
 * 选项使用Button渲染
 */
export default defineComponent({
  name,

  props: radioButtonProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const updateValue = (value: string | number) => {
      emit('update:modelValue', value);
    };

    const fieldValue = computed({
      get: () => props.modelValue,
      set: updateValue,
    });

    const radioButtonProps = computed(() => ({
      disabled: props.addon.disabled,
      readonly: props.addon.readOnly,
      class: props.addon.className,
      ...(props.addon.schema.props ?? {}),
    }));

    const radioButtonOptions = computed(() =>
      getWidgetOptionsBySchema(props.addon.schema, props.options)
    );

    return () => (
      <div class={[name, radioButtonProps.value.class]}>
        {radioButtonOptions.value.map(({ label, value, props }) => (
          <Button
            key={value}
            size='small'
            disabled={radioButtonProps.value.disabled}
            type={value === fieldValue.value ? 'primary' : 'default'}
            onClick={() => {
              if (!radioButtonProps.value.readonly) {
                updateValue(value);
              }
            }}
            {...props}
          >
            {label}
          </Button>
        ))}
      </div>
    );
  },
});
