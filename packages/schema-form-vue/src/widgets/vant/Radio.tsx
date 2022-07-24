import { defineComponent, computed, ExtractPropTypes, PropType } from 'vue';
import { Radio, RadioGroup } from 'vant';
import { createNamespace, makeStringProp, getWidgetOptionsBySchema } from '../../utils';
import { FieldWidgetAddon } from '../../types';

const radioProps = {
  modelValue: makeStringProp(''),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-radio');

export type RadioProps = ExtractPropTypes<typeof radioProps>;

/**
 * 单选框
 */
export default defineComponent({
  name,

  props: radioProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const radioProps = computed(() => ({
      ...props.addon.props,
    }));

    const radioOptions = computed(() =>
      getWidgetOptionsBySchema(props.addon.schema, props.addon.props?.options ?? [])
    );

    return () => (
      <div class={name}>
        <RadioGroup v-model={value.value} direction='horizontal' {...radioProps.value}>
          {radioOptions.value.map(({ label, value, props }) => (
            <Radio key={value} name={value} {...props}>
              {label}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    );
  },
});
