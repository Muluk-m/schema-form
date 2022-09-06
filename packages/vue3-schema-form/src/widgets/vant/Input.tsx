import { defineComponent, computed, ExtractPropTypes } from 'vue';
import { Field } from 'vant';
import { createNamespace, makeStringProp } from '../../utils';
import { useAddon } from '../../hooks/useAddon';

const inputProps = {
  modelValue: makeStringProp(''),
};

const [name] = createNamespace('widget-input');

export type InputProps = ExtractPropTypes<typeof inputProps>;

/**
 * 字符串输入
 */
export default defineComponent({
  name,

  props: inputProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const addon = useAddon();

    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const inputProps = computed(() => ({
      inputAlign: addon.value.props?.type === 'textarea' ? 'left' : ('right' as any),
      ...addon.value.props,
    }));

    return () => (
      <div class={name}>
        <Field
          v-model={value.value}
          border={false}
          {...inputProps.value}
        />
      </div>
    );
  },
});
