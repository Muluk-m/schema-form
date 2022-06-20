import { defineComponent, PropType, computed, ExtractPropTypes, ref } from 'vue';
import { Field, Popup, DatetimePicker } from 'vant';
import { createNamespace, makeStringProp, formatDate } from '@/utils';
import { FieldWidgetAddon } from '../../types';

const dateProps = {
  modelValue: makeStringProp(''),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-date');

export type DateProps = ExtractPropTypes<typeof dateProps>;

/**
 * 字符串输入
 */
export default defineComponent({
  name,

  props: dateProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const show = ref(false);

    const fieldValue = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const fieldProps = computed(() => ({
      disabled: props.addon.disabled,
      class: props.addon.className,
      placeholder: props.addon.placeholder,
    }));

    const dateProps = computed(() => ({
      ...fieldProps.value,
      ...(props.addon.schema.props ?? {}),
    }));

    const onConfirm = (value) => {
      fieldValue.value = formatDate(value, 'YYYY-MM-DD');
      show.value = false;
    };

    return () => (
      <>
        <Field
          v-model={fieldValue.value}
          readonly
          border={false}
          is-link
          center
          inputAlign='right'
          onClick={() => {
            show.value = true;
          }}
          {...fieldProps.value}
        />
        <Popup v-model:show={show.value} position='bottom'>
          <DatetimePicker
            type='date'
            modelValue={new Date(fieldValue.value)}
            onConfirm={onConfirm}
            onCancel={() => {
              show.value = false;
            }}
            {...dateProps.value}
          />
        </Popup>
      </>
    );
  },
});
