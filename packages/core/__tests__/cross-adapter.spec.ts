import { describe, it, expect } from 'vitest'
import vantAdapter from '../../vant/src/index'
import elementPlusAdapter from '../../element-plus/src/index'
import { resolveWidget, getWidgetForField } from '../src/adapter'

describe('Cross-Adapter Schema Compatibility', () => {
  const sharedFields = [
    { widget: 'input', type: 'string' },
    { widget: 'switch', type: 'boolean' },
    { widget: 'radio', type: 'string' },
    { widget: 'checkbox', type: 'array' },
    { widget: 'date', type: 'date' },
  ]

  it('both adapters can resolve all widgets for the shared schema', () => {
    for (const field of sharedFields) {
      const vantResult = resolveWidget(vantAdapter, field.widget)
      const epResult = resolveWidget(elementPlusAdapter, field.widget)

      expect(vantResult, `vant should resolve widget "${field.widget}"`).not.toBeNull()
      expect(vantResult!.component).toBeDefined()

      expect(epResult, `element-plus should resolve widget "${field.widget}"`).not.toBeNull()
      expect(epResult!.component).toBeDefined()
    }
  })

  it('type fallback mapping works consistently across both adapters', () => {
    const typeFallbacks: Array<{ type: string; expectedWidget: string }> = [
      { type: 'string', expectedWidget: 'input' },
      { type: 'boolean', expectedWidget: 'switch' },
      { type: 'array', expectedWidget: 'checkbox' },
      { type: 'date', expectedWidget: 'date' },
    ]

    for (const { type, expectedWidget } of typeFallbacks) {
      const vantResult = getWidgetForField(vantAdapter, undefined, type)
      const epResult = getWidgetForField(elementPlusAdapter, undefined, type)

      expect(vantResult, `vant should resolve type "${type}"`).not.toBeNull()
      expect(epResult, `element-plus should resolve type "${type}"`).not.toBeNull()

      // Both should resolve to the same widget name's component
      const vantDirect = resolveWidget(vantAdapter, expectedWidget)
      const epDirect = resolveWidget(elementPlusAdapter, expectedWidget)

      expect(vantResult!.component).toBe(vantDirect!.component)
      expect(epResult!.component).toBe(epDirect!.component)
    }
  })
})
