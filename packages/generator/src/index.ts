import './index.scss'
import './containers/Sidebar/styles.scss'
import './containers/Canvas/styles.scss'
import './containers/Settings/styles.scss'
import Generator from './Generator'

export { Generator }
export default Generator

export { GeneratorProvider } from './GeneratorProvider'
export { WidgetPalette, FormCanvas, FieldSettings } from './containers'
export { useGenerator } from './useGenerator'

export type { GeneratorProps, WidgetDef, FieldItem, HistoryEntry } from './types'
export { createGlobalState, useGlobalState, useGlobalAction } from './hooks'
export type { GlobalState } from './hooks'
