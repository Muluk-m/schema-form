const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    // 'airbnb/hooks',
    // 'plugin:react/recommended',
    'plugin:vue/recommended',
    // 'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      impliedStrict: true,
      // jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'promise', '@typescript-eslint', 'prettier', 'vue'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.vue'],
      },
      typescript: {},
    },
  },
  rules: {
    'import/extensions': OFF,
    'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
    'import/prefer-default-export': OFF,
    'import/no-unresolved': OFF,
    'import/no-dynamic-require': OFF,

    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-empty-function': WARN,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/ban-types': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-unused-vars': OFF,
    'no-param-reassign': OFF,

    'vue/no-v-model-argument': OFF,
    'vue/no-v-html': OFF,

    'react/jsx-filename-extension': [ERROR, { extensions: ['.tsx', 'ts', '.jsx', 'js'] }],
    'react/jsx-indent-props': [ERROR, 2],
    'react/jsx-indent': [ERROR, 2],
    'react/jsx-one-expression-per-line': OFF,
    'react/destructuring-assignment': OFF,
    'react/state-in-constructor': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/prop-types': OFF,
    'react/display-name': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/no-unknown-property': OFF,
    'react-hooks/rules-of-hooks': OFF,

    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,

    'lines-between-class-members': [ERROR, 'always'],
    // indent: [ERROR, 2, { SwitchCase: 1 }],
    'consistent-return': OFF,
    'linebreak-style': [ERROR, 'unix'],
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'always'],
    'no-unused-expressions': WARN,
    'no-template-curly-in-string': OFF,
    'no-plusplus': OFF,
    'no-console': OFF,
    'class-methods-use-this': ERROR,
    'jsx-quotes': [ERROR, 'prefer-single'],
    'global-require': OFF,
    'no-use-before-define': OFF,
    'no-restricted-syntax': OFF,
    'no-continue': OFF,
    'no-shadow': OFF,
  },
};
