import { defineComponent, PropType, computed, ExtractPropTypes, ref } from 'vue';
import { Field, Popup, Picker } from 'vant';
import { createNamespace, makeArrayProp, getWidgetOptionsBySchema } from '../../utils';
import { FieldWidgetAddon } from '../../types';

const cascaderProps = {
  modelValue: makeArrayProp<string | number>(),
  addon: {
    type: Object as PropType<FieldWidgetAddon>,
    default: () => ({}),
  },
};

const [name] = createNamespace('widget-Cascader');

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>;

/**
 * 级联选择器
 */
export default defineComponent({
  name,

  props: cascaderProps,

  emits: ['update:modelValue'],

  setup: (props, { emit }) => {
    const show = ref(false);
    const fieldValue = computed({
      get: () => props.modelValue,
      set: (value: any) => {
        emit('update:modelValue', value);
      },
    });

    const handleLabel = (list: any[]) =>
      Array.isArray(list)
        ? list.map(({ label, value, children, props }) => ({
            text: label,
            value,
            ...(Array.isArray(children) ? { children: handleLabel(children) } : {}),
            ...props,
          }))
        : [];

    const cascaderOptions = computed(() =>
      handleLabel(getWidgetOptionsBySchema(props.addon.schema, props.addon.props?.options ?? []))
    );

    const cascaderProps = computed(() => ({
      ...props.addon.props,
    }));

    const modelValue = computed(() => {
      const ids = fieldValue.value;
      let names = '';
      let curLevel = cascaderOptions.value as { text: string; value: string; children: any[] }[];

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const option = curLevel.find(({ value }) => value === id)!;

        if (option) {
          curLevel = option?.children ?? [];
          names += names ? `/${option.text}` : option.text;
        }
      }

      return names;
    });

    const onConfirm = (selected: any[]) => {
      console.log(selected);
      fieldValue.value = selected.filter(Boolean).map(({ value }) => value);
      show.value = false;
    };

    return () => (
      <div class={name}>
        <Field
          border={false}
          modelValue={modelValue.value}
          is-link={!cascaderProps.value.readonly && !cascaderProps.value.disabled}
          center
          readonly
          inputAlign='right'
          onClick={() => {
            if (cascaderProps.value.readonly || cascaderProps.value.disabled) {
              return;
            }

            show.value = true;
          }}
        />
        <Popup v-model:show={show.value} position='bottom'>
          <Picker
            columns={cascaderOptions.value}
            onCancel={() => {
              show.value = false;
            }}
            onConfirm={onConfirm}
            {...cascaderProps.value}
          />
        </Popup>
      </div>
    );
  },
});
