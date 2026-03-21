import { describe, it, expect } from 'vitest'
import { KNOWN_WIDGETS, KNOWN_TYPES, WIDGET_TYPE_MAP, ENUM_WIDGETS } from '../src/widgets'

describe('widget registry', () => {
  it('WIDGET_TYPE_MAP keys are all in KNOWN_WIDGETS', () => {
    for (const widget of Object.keys(WIDGET_TYPE_MAP)) {
      expect(KNOWN_WIDGETS.has(widget)).toBe(true)
    }
  })

  it('WIDGET_TYPE_MAP values are all in KNOWN_TYPES', () => {
    for (const type of Object.values(WIDGET_TYPE_MAP)) {
      expect(KNOWN_TYPES.has(type)).toBe(true)
    }
  })

  it('ENUM_WIDGETS are all in KNOWN_WIDGETS', () => {
    for (const widget of ENUM_WIDGETS) {
      expect(KNOWN_WIDGETS.has(widget)).toBe(true)
    }
  })

  it('has expected number of widgets', () => {
    expect(KNOWN_WIDGETS.size).toBe(12)
  })

  it('has expected number of types', () => {
    expect(KNOWN_TYPES.size).toBe(6)
  })
})
