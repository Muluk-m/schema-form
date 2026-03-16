import type { SchemaRaw, WidgetAdapter } from '@v3sf/core'

/** Definition of a widget available in the palette */
export interface WidgetDef {
  /** Display label in the palette */
  label: string
  /** Widget type key (e.g. 'input', 'switch', 'radio') */
  type: string
  /** Category for grouping in the sidebar */
  category: string
  /** Default schema when this widget is dropped onto the canvas */
  defaultSchema: Partial<SchemaRaw>
}

/** A field instance in the form being built */
export interface FieldItem {
  /** Unique field key / name */
  name: string
  /** The field's schema definition */
  schema: SchemaRaw
}

/** Props accepted by the Generator component */
export interface GeneratorProps {
  /** Initial schema to load into the editor */
  schema?: SchemaRaw
  /** Widget adapter from @v3sf/core */
  adapter: WidgetAdapter
  /** Available widget definitions for the palette */
  widgets: WidgetDef[]
}

/** A snapshot of the generator state for undo/redo */
export interface HistoryEntry {
  fields: FieldItem[]
  selectedField: string
}
