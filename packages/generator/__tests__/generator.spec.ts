import { describe, it, expect } from 'vitest'
import Generator, { createGlobalState, useGlobalState, useGlobalAction } from '../src/index'
import type { GlobalState, GeneratorProps, WidgetDef, FieldItem, HistoryEntry } from '../src/index'

describe('Generator exports', () => {
  it('exports Generator component', () => {
    expect(Generator).toBeDefined()
    expect(Generator.name).toBe('V3sfGenerator')
  })

  it('exports createGlobalState function', () => {
    expect(createGlobalState).toBeDefined()
    expect(typeof createGlobalState).toBe('function')
  })

  it('exports useGlobalState function', () => {
    expect(useGlobalState).toBeDefined()
    expect(typeof useGlobalState).toBe('function')
  })

  it('exports useGlobalAction function', () => {
    expect(useGlobalAction).toBeDefined()
    expect(typeof useGlobalAction).toBe('function')
  })

  // TODO: Add Playwright E2E tests for:
  // - Drag-and-drop field creation
  // - Field selection and settings editing
  // - Schema export/import
  // - Undo/redo functionality
  // - Copy/paste fields
})
