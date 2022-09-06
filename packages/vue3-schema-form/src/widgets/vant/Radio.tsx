import { defineComponent, computed, ExtractPropTypes } from 'vue';
import { Radio, RadioGroup } from 'vant';
import { createNamespace, makeStringProp, getWidgetOptionsBySchema } from '../../utils';
import { useAddon } from '../../hooks/useAddon';

const radioProps = {
  modelValue: makeStringProp(''),
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
    const addon = useAddon();

    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const radioProps = computed(() => ({
      ...addon.value.props,
    }));

    const radioOptions = computed(() =>
      getWidgetOptionsBySchema(addon.value.schema, addon.value.props?.options ?? [])
    );

    return () => (
      <div class={name}>
        <RadioGroup
          v-model={value.value}
          direction='horizontal'
          {...radioProps.value}
        >
          {radioOptions.value.map(({ label, value, props }) => (
            <Radio
              key={value}
              name={value}
              {...props}
            >
              {label}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    );
  },
});
