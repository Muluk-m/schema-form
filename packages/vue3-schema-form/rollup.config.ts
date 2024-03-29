// import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import ignoreImport from 'rollup-plugin-ignore-import';
import dts from 'rollup-plugin-dts';

import cssnano from 'cssnano';

const baseConfig = {
  input: './src/index.ts',
  extensions: ['.ts', '.js', '.tsx'],
};

const config = {
  input: baseConfig.input,
  output: [
    {
      dir: 'dist/index.esm.js',
      format: 'es',
      exports: 'named',
      globals: {
        vue: 'Vue',
      },
    },
    {
      dir: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      globals: {
        vue: 'Vue',
      },
    },
  ],
  plugins: [
    // vue(),
    resolve({
      browser: true,
    }),
    esbuild({
      target: 'node14',
      exclude: ['node_modules'],
    }),
    babel({
      babelHelpers: 'bundled',
      plugins: ['@vue/babel-plugin-jsx'],
      extensions: baseConfig.extensions,
    }),
    commonjs(),
    postcss({
      plugins: [cssnano()],
    }),
  ],
  external: ['vue', 'vant'],
  onwarn(warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    console.error(warning.message);
  },
};

const dtsConfig = {
  input: baseConfig.input,
  output: [
    {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
  ],
  plugins: [ignoreImport({ extensions: ['.scss'] }), dts()],
  external: baseConfig.extensions,
};

export default [config, dtsConfig];
