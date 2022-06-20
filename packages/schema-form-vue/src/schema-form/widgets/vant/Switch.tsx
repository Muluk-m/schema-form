import { defineComponent, PropType, computed, ExtractPropTypes } from 'vue';
import { Switch } from 'vant';
import { createNamespace } from '@/utils';
import { FieldWidgetAddon } from '../../types';

const switchProps = {
  modelValue: {
    type: Boolean,
    default: false,
  },
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-input');

export type SwitchProps = ExtractPropTypes<typeof switchProps>;

/**
 * 开关
 */
export default defineComponent({
  name,

  props: switchProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const value = computed({
      get: () => props.modelValue,
      set: (value: boolean) => {
        emit('update:modelValue', value);
      },
    });

    const switchProps = computed(() => ({
      disabled: props.addon.disabled,
      readonly: props.addon.readOnly,
      class: props.addon.className,
      placeholder: props.addon.placeholder,
      ...(props.addon.schema.props ?? {}),
    }));

    return () => <Switch v-model={value.value} {...switchProps.value} />;
  },
});
