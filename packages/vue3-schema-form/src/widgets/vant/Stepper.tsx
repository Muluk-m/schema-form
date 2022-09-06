import { defineComponent, computed, ExtractPropTypes } from 'vue';
import { Stepper } from 'vant';
import { createNamespace, makeNumberProp } from '../../utils';
import { useAddon } from '../../hooks/useAddon';

const stepperProps = {
  modelValue: makeNumberProp(0),
};

const [name] = createNamespace('widget-stepper');

export type StepperProps = ExtractPropTypes<typeof stepperProps>;

/**
 * 数字输入
 */
export default defineComponent({
  name,

  props: stepperProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const addon = useAddon();

    const value = computed({
      get: () => props.modelValue,
      set: (value: number) => {
        emit('update:modelValue', value);
      },
    });

    const stepperProps = computed(() => ({
      ...addon.value.props,
    }));

    return () => (
      <div class={name}>
        <Stepper
          v-model={value.value}
          {...stepperProps.value}
        />
      </div>
    );
  },
});
