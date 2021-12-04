import config from '../rollup.config'
import filesize from 'rollup-plugin-filesize'

export default {
  ...config,
  plugins: [
    ...config.plugins,
    filesize()
  ]
}