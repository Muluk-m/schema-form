import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

const extensions = ['.ts', '.js', '.tsx'];

const config = {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'named',
      globals: {
        vue: 'Vue',
      },
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      globals: {
        vue: 'Vue',
      },
    },
  ],
  plugins: [
    typescript({
      check: false, // types are incompatible with Vue3
      tsconfigOverride: {
        include: null,
        exclude: ['node_modules'],
      },
    }),
    vue({
      css: false,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
      babelHelpers: 'bundled',
    }),
    resolve(),
    commonjs({
      extensions,
    }),
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

export default config;
