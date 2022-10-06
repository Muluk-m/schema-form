import {
  ref,
  defineProps,
  PropType,
  computed,
  watch,
  defineComponent,
  ExtractPropTypes,
} from 'vue';
import { createNamespace } from '@v3sf/shared';
import SchemaForm from 'v3-schema-form';
import { useGlobalCtx } from '../../hooks';
import './styles.scss';

const [name, bem] = createNamespace('Settings');

export const Settings = defineComponent({
  name,
  setup: () => {
    const globalCtxRef = useGlobalCtx();
    const schema = computed(() => {
      const properties = globalCtxRef.value.settingSchema;
      const schema = {
        type: 'object',
        properties,
      };

      return schema;
    });

    return () => (
      <div class={name}>
        {schema.value?.properties && schema.value?.type === 'object' && (
          <SchemaForm
            style={{ width: '100%' }}
            schema={schema.value}
            // v-model={globalCtxRef.value.formData} 此处与当前选中组件的schema 做双向绑定
          />
        )}
      </div>
    );
  },
});
