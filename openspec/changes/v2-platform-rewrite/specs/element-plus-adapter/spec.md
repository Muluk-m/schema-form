## ADDED Requirements

### Requirement: Element Plus widget set

The `@v3sf/element-plus` package SHALL provide adapter widgets for the following field types: `input` (ElInput), `number` (ElInputNumber), `switch` (ElSwitch), `radio` (ElRadioGroup), `checkbox` (ElCheckboxGroup), `select` (ElSelect), `cascader` (ElCascader), `date` (ElDatePicker), and `textarea` (ElInput with type=textarea).

#### Scenario: Render input field with Element Plus

- **WHEN** schema has field `{ type: "string", widget: "input" }` and Element Plus adapter is used
- **THEN** the field SHALL render as an `ElInput` component

#### Scenario: Render select with enum options

- **WHEN** schema has `{ type: "string", widget: "select", enum: [1, 2], enumNames: ["选项一", "选项二"] }`
- **THEN** the field SHALL render as an `ElSelect` with two `ElOption` components

### Requirement: Same schema across adapters

A schema written for `@v3sf/vant` MUST render correctly with `@v3sf/element-plus` without modification (using shared widget names). UI appearance will differ but behavior and data binding SHALL be identical.

#### Scenario: Cross-adapter schema compatibility

- **WHEN** a schema with fields of type input, switch, radio, and date is used with both Vant and Element Plus adapters
- **THEN** both adapters SHALL produce forms that bind to the same formData structure and produce identical validation results

### Requirement: Desktop-optimized layout

The Element Plus adapter SHALL support `displayType: 'row'` as horizontal label-field layout (using ElFormItem) and `displayType: 'column'` as vertical stacked layout, matching the existing schema API.

#### Scenario: Horizontal layout

- **WHEN** schema has `displayType: "row"`
- **THEN** labels and fields SHALL render side by side using Element Plus form layout

### Requirement: Element Plus peer dependency

The `@v3sf/element-plus` package SHALL declare `element-plus` as a peerDependency, NOT a direct dependency. Users MUST install Element Plus separately.

#### Scenario: Missing peer dependency

- **WHEN** a user installs `@v3sf/element-plus` without `element-plus` installed
- **THEN** the package manager SHALL warn about the missing peer dependency
