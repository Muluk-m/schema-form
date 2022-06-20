import { defineComponent, PropType, computed, ExtractPropTypes } from 'vue';
import { Stepper } from 'vant';
import { createNamespace, makeNumberProp } from '@/utils';
import { FieldWidgetAddon } from '../../types';

const stepperProps = {
  modelValue: makeNumberProp(0),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
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
    const value = computed({
      get: () => props.modelValue,
      set: (value: number) => {
        emit('update:modelValue', value);
      },
    });

    const stepperProps = computed(() => ({
      disabled: props.addon.disabled,
      readonly: props.addon.readOnly,
      class: props.addon.className,
      ...(props.addon.schema.props ?? {}),
    }));

    return () => <Stepper v-model={value.value} {...stepperProps.value} />;
  },
});
