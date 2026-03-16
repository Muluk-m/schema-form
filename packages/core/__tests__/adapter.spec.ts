import { describe, it, expect } from 'vitest'
import { defineAdapter, defineWidget, resolveWidget, getWidgetForField } from '../src/adapter'

const MockInput = { name: 'MockInput', render: () => null }
const MockSwitch = { name: 'MockSwitch', render: () => null }
const MockStepper = { name: 'MockStepper', render: () => null }

describe('Widget Adapter', () => {
  describe('defineAdapter', () => {
    it('creates an adapter with widgets and globalPropsMap', () => {
      const adapter = defineAdapter({
        widgets: {
          input: { component: MockInput, propsMap: { error: 'error-message' } },
          switch: { component: MockSwitch },
        },
        globalPropsMap: { disabled: 'disabled' },
      })

      expect(adapter.widgets.input).toBeDefined()
      expect(adapter.widgets.switch).toBeDefined()
      expect(adapter.globalPropsMap?.disabled).toBe('disabled')
    })
  })

  describe('defineWidget', () => {
    it('creates a widget definition', () => {
      const widget = defineWidget({
        name: 'color-picker',
        component: MockInput,
        propsMap: { value: 'color' },
      })

      expect(widget.component).toBe(MockInput)
      expect(widget.propsMap?.value).toBe('color')
    })
  })

  describe('resolveWidget', () => {
    const adapter = defineAdapter({
      widgets: {
        input: { component: MockInput, propsMap: { error: 'error-message' } },
        switch: MockSwitch, // direct component
      },
      globalPropsMap: { disabled: 'disabled', readonly: 'readonly' },
    })

    it('resolves widget with propsMap', () => {
      const result = resolveWidget(adapter, 'input')
      expect(result?.component).toBe(MockInput)
      expect(result?.propsMap.error).toBe('error-message')
      expect(result?.propsMap.disabled).toBe('disabled')
    })

    it('widget-level propsMap overrides global', () => {
      const adapterWithOverride = defineAdapter({
        widgets: {
          input: {
            component: MockInput,
            propsMap: { disabled: 'is-disabled' }, // override global
          },
        },
        globalPropsMap: { disabled: 'disabled' },
      })

      const result = resolveWidget(adapterWithOverride, 'input')
      expect(result?.propsMap.disabled).toBe('is-disabled')
    })

    it('resolves direct component reference', () => {
      const result = resolveWidget(adapter, 'switch')
      expect(result?.component).toBe(MockSwitch)
      expect(result?.propsMap.disabled).toBe('disabled')
    })

    it('returns null for unknown widget', () => {
      const result = resolveWidget(adapter, 'unknown')
      expect(result).toBeNull()
    })
  })

  describe('getWidgetForField', () => {
    const adapter = defineAdapter({
      widgets: {
        input: { component: MockInput },
        switch: { component: MockSwitch },
        number: { component: MockStepper },
        checkbox: { component: MockInput },
        date: { component: MockInput },
      },
    })

    it('uses explicit widget name', () => {
      const result = getWidgetForField(adapter, 'switch', 'boolean')
      expect(result?.component).toBe(MockSwitch)
    })

    it('falls back to type-based mapping', () => {
      const result = getWidgetForField(adapter, undefined, 'string')
      expect(result?.component).toBe(MockInput)
    })

    it('maps number type to number widget', () => {
      const result = getWidgetForField(adapter, undefined, 'number')
      expect(result?.component).toBe(MockStepper)
    })

    it('maps boolean type to switch widget', () => {
      const result = getWidgetForField(adapter, undefined, 'boolean')
      expect(result?.component).toBe(MockSwitch)
    })

    it('returns null for unknown type without widget', () => {
      const result = getWidgetForField(adapter, undefined, 'custom-type')
      expect(result).toBeNull()
    })
  })
})
