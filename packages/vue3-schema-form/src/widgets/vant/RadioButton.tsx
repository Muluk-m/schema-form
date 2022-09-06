import { defineComponent, computed, ExtractPropTypes, PropType } from 'vue';
import { Button } from 'vant';
import { createNamespace, getWidgetOptionsBySchema } from '../../utils';
import { useAddon } from '../../hooks/useAddon';

const radioButtonProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
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
    const addon = useAddon();

    const updateValue = (value: string | number) => {
      emit('update:modelValue', value);
    };

    const fieldValue = computed({
      get: () => props.modelValue,
      set: updateValue,
    });

    const radioButtonProps = computed(() => ({
      ...addon.value.props,
    }));

    const radioButtonOptions = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? [])
    );

    return () => (
      <div class={name}>
        {radioButtonOptions.value.map(({ label, value, props }) => (
          <Button
            key={value}
            size='small'
            disabled={radioButtonProps.value.disabled}
            type={value === fieldValue.value ? 'primary' : 'default'}
            onClick={() => {
              if (!radioButtonProps.value.readonly && !radioButtonProps.value.disabled) {
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
