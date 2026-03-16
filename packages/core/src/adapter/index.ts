import type { Component } from 'vue'
import type { WidgetAdapter, WidgetDefinition } from '../types'

export function defineAdapter(config: WidgetAdapter): WidgetAdapter {
  return config
}

export function defineWidget(definition: WidgetDefinition & { name?: string }): WidgetDefinition {
  const { name: _name, ...rest } = definition
  return rest as WidgetDefinition
}

export function resolveWidget(
  adapter: WidgetAdapter,
  widgetName: string,
): { component: Component; propsMap: Record<string, string> } | null {
  const widget = adapter.widgets[widgetName]
  if (!widget) return null

  // If widget is a raw component (no propsMap), wrap it
  if (typeof widget === 'object' && widget.component) {
    return {
      component: widget.component,
      propsMap: {
        ...(adapter.globalPropsMap ?? {}),
        ...(widget.propsMap ?? {}),
      },
    }
  }

  // Direct component reference
  return {
    component: widget,
    propsMap: adapter.globalPropsMap ?? {},
  }
}

export function getWidgetForField(
  adapter: WidgetAdapter,
  widgetName: string | undefined,
  fieldType: string | undefined,
): { component: Component; propsMap: Record<string, string> } | null {
  // 1. Explicit widget name
  if (widgetName) {
    return resolveWidget(adapter, widgetName)
  }

  // 2. Type-based fallback mapping
  const typeWidgetMap: Record<string, string> = {
    string: 'input',
    number: 'number',
    boolean: 'switch',
    array: 'checkbox',
    date: 'date',
  }

  const mappedWidget = fieldType ? typeWidgetMap[fieldType] : undefined
  if (mappedWidget) {
    return resolveWidget(adapter, mappedWidget)
  }

  return null
}
