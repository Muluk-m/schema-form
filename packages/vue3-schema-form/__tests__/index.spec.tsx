import { mount } from '@vue/test-utils';
import Demo from './demo';

describe('Vue3SchemaForm', () => {
  const wrapper = mount({
    render() {
      return <Demo />;
    },
  });

  test('should render', async () => {
    expect(wrapper.find('.v3jsf-schema-form').isVisible()).toBe(true);
  });

  test('schema-form/core', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
