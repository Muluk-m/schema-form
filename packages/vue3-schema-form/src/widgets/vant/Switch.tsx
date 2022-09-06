import { defineComponent, computed, ExtractPropTypes } from 'vue';
import { Switch } from 'vant';
import { createNamespace } from '../../utils';
import { useAddon } from '../../hooks/useAddon';

const switchProps = {
  modelValue: {
    type: Boolean,
    default: false,
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
    const addon = useAddon();

    const value = computed({
      get: () => props.modelValue,
      set: (value: boolean) => {
        emit('update:modelValue', value);
      },
    });

    const switchProps = computed(() => ({
      ...addon.value.props,
    }));

    return () => (
      <div class={name}>
        <Switch
          v-model={value.value}
          {...switchProps.value}
        />
      </div>
    );
  },
});
