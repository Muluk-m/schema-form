import { mount } from '@vue/test-utils';
import Demo from './demo';

describe('Vue3SchemaForm', () => {
  test('render test', async () => {
    const wrapper = mount({
      render() {
        return <Demo />;
      },
    });

    expect(wrapper.find('.v3jsf-schema-form').isVisible()).toBe(true);
  });

  test('should render', () => {
    const wrapper = mount({
      render() {
        return <Demo />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
