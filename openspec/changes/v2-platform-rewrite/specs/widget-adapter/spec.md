## ADDED Requirements

### Requirement: defineAdapter API

The system SHALL provide a `defineAdapter` function that accepts a widget adapter configuration object and returns a typed adapter instance. The adapter configuration SHALL include a `widgets` map (widget name → component definition) and an optional `globalPropsMap` for cross-widget prop name mapping.

#### Scenario: Register a Vant adapter

- **WHEN** developer calls `defineAdapter({ widgets: { input: { component: VanField, propsMap: { error: 'error-message' } } } })`
- **THEN** the function returns a valid adapter object that can be passed to `createSchemaForm`

#### Scenario: Adapter with globalPropsMap

- **WHEN** adapter defines `globalPropsMap: { disabled: 'disabled', readonly: 'readonly' }`
- **THEN** all widgets in the adapter SHALL receive the mapped prop names when the schema specifies `disabled` or `readonly`

### Requirement: defineWidget API

The system SHALL provide a `defineWidget` function for creating individual widget components that conform to the adapter protocol. Each widget MUST support `v-model` for value binding.

#### Scenario: Custom widget creation

- **WHEN** developer calls `defineWidget({ name: 'color-picker', component: MyColorPicker, propsMap: { value: 'color' } })`
- **THEN** the widget is usable in any adapter and handles v-model correctly through propsMap

### Requirement: propsMap mapping

The system SHALL transform schema-level prop names to UI-library-specific prop names using the propsMap configuration. Widget-level propsMap SHALL take precedence over globalPropsMap.

#### Scenario: Widget-level propsMap overrides global

- **WHEN** globalPropsMap maps `error` to `error-message` AND widget-level propsMap maps `error` to `validate-message`
- **THEN** the widget SHALL receive its value via the `validate-message` prop

#### Scenario: Unmapped props pass through

- **WHEN** a schema prop has no mapping in either widget-level or global propsMap
- **THEN** the prop SHALL be passed through to the component with its original name

### Requirement: createSchemaForm factory

The system SHALL provide a `createSchemaForm` function that takes an adapter and returns a configured `SchemaForm` component. The returned component SHALL render fields using the adapter's widget registry.

#### Scenario: Create form with Vant adapter

- **WHEN** developer calls `createSchemaForm(vantAdapter)` and uses the returned component with a schema
- **THEN** each field in the schema SHALL render using the corresponding Vant widget from the adapter

#### Scenario: Unknown widget fallback

- **WHEN** schema specifies `widget: "unknown-widget"` and the adapter has no matching widget
- **THEN** the system SHALL log a warning and render a fallback text element showing the field name

### Requirement: Widget standard interface

All widgets registered via an adapter MUST receive a standardized set of props: `modelValue`, `disabled`, `readonly`, `placeholder`, `error` (validation error message), and `addon` (field context from useAddon). Widgets MUST emit `update:modelValue` for value changes.

#### Scenario: Widget receives standard props

- **WHEN** a schema field has `disabled: true` and `placeholder: "请输入"`
- **THEN** the widget component SHALL receive `disabled=true` and `placeholder="请输入"` (after propsMap transformation)

### Requirement: Tree-shakeable widget registration

Adapters SHALL support tree-shaking such that unused widgets are NOT included in the production bundle when using a bundler that supports tree-shaking.

#### Scenario: Only imported widgets are bundled

- **WHEN** a schema only uses `input` and `switch` widgets AND the project uses a tree-shaking bundler
- **THEN** only the `input` and `switch` widget code from the adapter SHALL be included in the final bundle
