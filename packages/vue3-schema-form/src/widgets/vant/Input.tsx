import { defineComponent, PropType, computed, ExtractPropTypes } from 'vue';
import { Field } from 'vant';
import { createNamespace, makeStringProp } from '../../utils';
import { FieldWidgetAddon } from '../../types';

const inputProps = {
  modelValue: makeStringProp(''),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
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
    const value = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const inputProps = computed(() => ({
      inputAlign: props.addon.props?.type === 'textarea' ? 'left' : ('right' as any),
      ...props.addon.props,
    }));

    return () => (
      <div class={name}>
        <Field v-model={value.value} border={false} {...inputProps.value} />
      </div>
    );
  },
});
