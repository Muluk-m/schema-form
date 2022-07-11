import { defineComponent, PropType, computed, ExtractPropTypes, ref } from 'vue';
import { Field, Popup, Picker } from 'vant';
import { createNamespace } from '@/utils';
import { FieldWidgetAddon } from '../../types';
import { getWidgetOptionsBySchema } from '../../utils';

const pickerProps = {
  modelValue: [Number, String] as PropType<string | number>,
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-picker');

export type PickerProps = ExtractPropTypes<typeof pickerProps>;

/**
 * 弹框选择器
 */
export default defineComponent({
  name,

  props: pickerProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const show = ref(false);
    const fieldValue = computed({
      get: () => props.modelValue,
      set: (value: any) => {
        emit('update:modelValue', value);
      },
    });

    const pickerOptions = computed(() =>
      getWidgetOptionsBySchema(props.addon.schema, props.addon.props?.options ?? []).map(
        ({ label, value, props }) => ({
          text: label,
          value,
          ...props,
        })
      )
    );

    const pickerProps = computed(() => ({
      ...props.addon.props,
    }));

    return () => (
      <div class={name}>
        <Field
          border={false}
          modelValue={pickerOptions.value.find(({ value }) => value === fieldValue.value)?.text}
          is-link={!pickerProps.value.readonly && !pickerProps.value.disabled}
          center
          readonly
          inputAlign='right'
          onClick={() => {
            if (pickerProps.value.readonly || pickerProps.value.disabled) {
              return;
            }

            show.value = true;
          }}
        />
        <Popup v-model:show={show.value} position='bottom'>
          <Picker
            columns={pickerOptions.value}
            onCancel={() => {
              show.value = false;
            }}
            onConfirm={({ value }) => {
              fieldValue.value = value;
              show.value = false;
            }}
            {...pickerProps.value}
          />
        </Popup>
      </div>
    );
  },
});
