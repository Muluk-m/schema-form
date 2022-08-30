import DefaultTheme from 'vitepress/theme';
import SchemaForm from 'v3-schema-form';
import 'vant/lib/index.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('SchemaForm', SchemaForm);
  },
};
