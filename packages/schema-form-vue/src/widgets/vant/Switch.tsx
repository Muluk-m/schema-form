import { defineComponent, PropType, computed, ExtractPropTypes } from 'vue';
import { Switch } from 'vant';
import { createNamespace } from '../../utils';
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

const [name] = createNamespace('widget-switch');

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
      ...props.addon.props,
    }));

    return () => (
      <div class={name}>
        <Switch v-model={value.value} {...switchProps.value} />
      </div>
    );
  },
});
