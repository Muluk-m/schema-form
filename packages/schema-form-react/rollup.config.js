import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'

const config = {
  input: './src/index.tsx',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
      exports: 'named'
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({ babelHelpers: 'bundled', presets: ['@babel/preset-react'] }),
    postcss({
      plugins: [cssnano()]
    })
  ],
  external: ['react', 'react-dom'],
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return
    }
    console.error(warning.message)
  }
}

export default config
