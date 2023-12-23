import {
  ref,
  defineProps,
  PropType,
  computed,
  watchEffect,
  watch,
  defineComponent,
  ExtractPropTypes,
} from 'vue';
import { Tab, Tabs } from 'vant';
import { createNamespace } from '@v3sf/shared';
import SchemaForm from 'v3-schema-form';
import { useGlobalCtx } from '../../hooks';
// import { isJsonSchema } from '../../utils';
import './styles.scss';

const [name, bem] = createNamespace('Settings');

export const Settings = defineComponent({
  name,
  setup: () => {
    const globalCtxRef = useGlobalCtx();
    const active = ref('widget');
    const schema = computed(() => {
      const properties = globalCtxRef.value.settingSchema;
      const schema = {
        type: 'object',
        properties,
      };

      return schema;
    });

    watchEffect(() => {
      active.value = globalCtxRef.value.selected ? 'widget' : 'form';
    });

    return () => (
      <div class={name}>
        <Tabs
          v-model={active.value}
          color='#42b883'
        >
          {globalCtxRef.value.selected && (
            <Tab
              title='控件配置'
              name='widget'
            >
              <SchemaForm
                style={{ width: '100%' }}
                schema={schema.value}
                // v-model={globalCtxRef.value.formData} 此处与当前选中组件的schema 做双向绑定
              />
            </Tab>
          )}
          <Tab
            title='表单配置'
            name='form'
          >
            <SchemaForm
              style={{ width: '100%' }}
              schema={schema.value}
              // v-model={globalCtxRef.value.formData} 此处与当前选中组件的schema 做双向绑定
            />
          </Tab>
        </Tabs>
      </div>
    );
  },
});
