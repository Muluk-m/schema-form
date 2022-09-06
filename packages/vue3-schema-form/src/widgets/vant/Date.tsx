import { defineComponent, PropType, computed, ExtractPropTypes, ref } from 'vue';
import { Field, Popup, DatetimePicker } from 'vant';
import { createNamespace, makeStringProp } from '../../utils';
import { FieldWidgetAddon } from '../../types';
import { useAddon } from '../../hooks/useAddon';

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
    const addon = useAddon();

    const show = ref(false);

    const fieldValue = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const fieldProps = computed(() => ({
      disabled: addon.value.disabled,
      class: addon.value.className,
      placeholder: addon.value.placeholder,
    }));

    const dateProps = computed(() => ({
      ...fieldProps.value,
      ...addon.value.props,
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
          is-link={!addon.value.disabled && !addon.value.readonly}
          center
          inputAlign='right'
          onClick={() => {
            if (addon.value.disabled || addon.value.readonly) {
              return;
            }
            show.value = true;
          }}
          {...fieldProps.value}
        />
        <Popup
          v-model:show={show.value}
          position='bottom'
        >
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
