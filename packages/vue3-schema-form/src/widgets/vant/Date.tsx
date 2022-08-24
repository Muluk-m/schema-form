import { defineComponent, PropType, computed, ExtractPropTypes, ref } from 'vue';
import { Field, Popup, DatetimePicker } from 'vant';
import { createNamespace, makeStringProp } from '../../utils';
import { FieldWidgetAddon } from '../../types';

type DateType = 'date' | 'time' | 'year-month' | 'month-day' | 'datehour';

const dateProps = {
  modelValue: makeStringProp(''),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
  type: makeStringProp<DateType>('date'),
};

const [name] = createNamespace('widget-date');

export type DateProps = ExtractPropTypes<typeof dateProps>;

/**
 * 日期输入
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
      ...props.addon.props,
    }));

    const onConfirm = (value) => {
      fieldValue.value = value;
      show.value = false;
    };

    return () => (
      <div class={name}>
        <Field
          v-model={fieldValue.value}
          readonly
          border={false}
          is-link={!props.addon.disabled && !props.addon.readonly}
          center
          inputAlign='right'
          onClick={() => {
            if (props.addon.disabled || props.addon.readonly) {
              return;
            }
            show.value = true;
          }}
          {...fieldProps.value}
        />
        <Popup v-model:show={show.value} position='bottom'>
          <DatetimePicker
            type='date'
            modelValue={fieldValue.value}
            onConfirm={onConfirm}
            onCancel={() => {
              show.value = false;
            }}
            {...dateProps.value}
          />
        </Popup>
      </div>
    );
  },
});
