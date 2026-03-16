import { describe, it, expect } from 'vitest'
import vantAdapter from '../src/index'

describe('Vant Adapter', () => {
  it('is a valid WidgetAdapter with widgets and globalPropsMap', () => {
    expect(vantAdapter.widgets).toBeDefined()
    expect(typeof vantAdapter.widgets).toBe('object')
    expect(vantAdapter.globalPropsMap).toBeDefined()
    expect(typeof vantAdapter.globalPropsMap).toBe('object')
  })

  it('has all expected widgets registered', () => {
    const expectedWidgets = [
      'input',
      'checkbox',
      'switch',
      'stepper',
      'radio',
      'radioButton',
      'picker',
      'cascader',
      'date',
      'string',
      'boolean',
      'array',
      'number',
    ]

    for (const name of expectedWidgets) {
      expect(vantAdapter.widgets[name], `widget "${name}" should be registered`).toBeDefined()
    }
  })

  it('maps type fallback widgets correctly', () => {
    // string -> input (same component)
    const inputComponent = (vantAdapter.widgets.input as any).component
    const stringComponent = (vantAdapter.widgets.string as any).component
    expect(stringComponent).toBe(inputComponent)

    // boolean -> switch
    const switchComponent = (vantAdapter.widgets.switch as any).component
    const booleanComponent = (vantAdapter.widgets.boolean as any).component
    expect(booleanComponent).toBe(switchComponent)

    // array -> checkbox
    const checkboxComponent = (vantAdapter.widgets.checkbox as any).component
    const arrayComponent = (vantAdapter.widgets.array as any).component
    expect(arrayComponent).toBe(checkboxComponent)

    // number -> stepper
    const stepperComponent = (vantAdapter.widgets.stepper as any).component
    const numberComponent = (vantAdapter.widgets.number as any).component
    expect(numberComponent).toBe(stepperComponent)
  })

  it('has propsMap on input widget mapping error to error-message', () => {
    const inputWidget = vantAdapter.widgets.input as any
    expect(inputWidget.propsMap).toBeDefined()
    expect(inputWidget.propsMap.error).toBe('error-message')
  })
})
