import config from '../rollup.config'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  ...config,
  plugins: [
    ...config.plugins,
    serve({
      port: 8080,
      contentBase: ['dist', 'examples/brower'],
      openPage: 'index.html',
    }),
    livereload({
      watch: 'examples/brower',
    })
  ]
}