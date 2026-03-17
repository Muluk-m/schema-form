import DefaultTheme from 'vitepress/theme'
import { globals } from '../../components'
import 'vant/lib/index.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    globals.forEach(([name, component]) => {
      app.component(name, component)
    })
  },
}
