import { resolveSchemaWithSegments } from '../src/utils';

const schema = {
  type: 'object',
  properties: {
    string4: {
      type: 'string',
      title: '字符串4',
      widget: 'radioButton',
      enum: ['选项1', '选项2'],
    },
    string5: {
      type: 'string',
      title: '文本域',
      displayType: 'column',
      required: true,
      rules: [{ min: 10, message: 'min is 10' }],
      props: {
        rows: '{{ $values.string4 }}',
        autosize: true,
        type: 'textarea',
        maxlength: 50,
        showWordLimit: true,
      },
    },
  },
};

describe('Test Utils', () => {
  test('Test resolveSegment', () => {
    const res = resolveSchemaWithSegments(schema, { string4: 3 }, {});
    expect(res.properties?.string5.props?.rows).toBe(3);
  });
});
