## ADDED Requirements

### Requirement: Three-panel layout

The Playground SHALL display a three-panel layout: left panel (component palette), center panel (visual canvas with form preview), and right panel (schema JSON editor with property inspector). Panels SHALL be resizable.

#### Scenario: Drag widget to canvas

- **WHEN** user drags an "Input" widget from the left panel to the center canvas
- **THEN** an input field SHALL appear on the canvas AND the right panel schema editor SHALL update to include the new field

#### Scenario: Edit schema JSON directly

- **WHEN** user modifies the schema JSON in the right panel editor
- **THEN** the center canvas SHALL re-render to reflect the changed schema in real-time

### Requirement: Bidirectional sync

The visual canvas and the schema JSON editor SHALL stay in sync bidirectionally. Changes in either panel SHALL immediately reflect in the other.

#### Scenario: Canvas to JSON sync

- **WHEN** user selects a field on canvas and changes its title in the property inspector
- **THEN** the schema JSON editor SHALL update to show the new title

#### Scenario: JSON to canvas sync

- **WHEN** user adds a new field object in the schema JSON editor
- **THEN** a new field SHALL appear on the canvas

### Requirement: Example templates

The Playground SHALL include a set of pre-built schema templates accessible from a template gallery. Templates SHALL include at minimum: login form, user registration, leave request, survey/questionnaire, and contact form.

#### Scenario: Load a template

- **WHEN** user selects "请假申请" from the template gallery
- **THEN** the canvas and schema editor SHALL populate with a leave request form schema including date range, leave type, and reason fields

#### Scenario: Template as starting point

- **WHEN** user loads a template and then modifies it
- **THEN** the modifications SHALL persist in the current session without affecting the original template

### Requirement: Mobile and desktop preview

The canvas SHALL support toggling between mobile preview (phone-sized frame) and desktop preview (full-width) to visualize how the form looks with different adapters.

#### Scenario: Switch to mobile preview

- **WHEN** user clicks the mobile preview toggle
- **THEN** the canvas SHALL display the form inside a phone-sized simulator frame

### Requirement: Schema import/export

The Playground SHALL support importing schema from JSON file or clipboard, and exporting the current schema as JSON file or copying to clipboard.

#### Scenario: Export current schema

- **WHEN** user clicks "导出 JSON"
- **THEN** the current schema SHALL be downloaded as a `.json` file

#### Scenario: Import schema from clipboard

- **WHEN** user pastes a valid schema JSON into the import dialog
- **THEN** the canvas and editor SHALL update to display the imported schema

### Requirement: Shareable URL

The Playground SHALL support encoding the current schema state into a URL hash/parameter so that schemas can be shared via link.

#### Scenario: Share a form design

- **WHEN** user clicks "分享链接"
- **THEN** a URL SHALL be generated that, when opened by another user, restores the exact same schema in the Playground
