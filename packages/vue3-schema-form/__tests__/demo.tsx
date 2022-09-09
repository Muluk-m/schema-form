import { ref, defineComponent, onErrorCaptured } from 'vue';
import SchemaForm from '../src';

export default defineComponent({
  name: 'TestDemo',
  setup: () => {
    const formData = ref({
      string1: '123',
      string2: '选项2',
      string3: '选项2',
      string4: '选项1',
      string5: '1234',
      number: 1,
      boolean: true,
      array: ['选项1', '选项2'],
      date: '2022-06-30',
    });

    const schema = {
      type: 'object',
      properties: {
        string1: {
          type: 'string',
          title: '字符串1',
          placeholder: '请输入内容',
        },
        string2: {
          type: 'string',
          title: '字符串2',
          widget: 'picker',
          enum: ['选项1', '选项2'],
        },
        string3: {
          type: 'string',
          title: '字符串3',
          displayType: 'column',
          widget: 'radio',
          enum: ['选项1', '选项2'],
        },
        string4: {
          type: 'string',
          title: '字符串4',
          widget: 'radioButton',
          enum: ['选项1', '选项2'],
        },
        array: {
          type: 'array',
          title: '数组',
          enum: ['选项1', '选项2', '选项3'],
        },
        number: {
          type: 'number',
          title: '数值',
        },
        boolean: {
          type: 'boolean',
          widget: 'test',
          title: '布尔',
        },
        date: {
          type: 'date',
          title: '日期',
        },
        string5: {
          type: 'string',
          title: '文本域',
          displayType: 'column',
          required: true,
          rules: [{ min: 10 }],
          props: {
            rows: 2,
            autosize: true,
            type: 'textarea',
            maxlength: 50,
            showWordLimit: true,
          },
        },
      },
    };

    onErrorCaptured((...err) => {
      console.log(err);
    });

    return () => (
      <SchemaForm
        v-model={formData}
        schema={schema}
      />
    );
  },
});
