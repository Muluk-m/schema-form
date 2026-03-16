## ADDED Requirements

### Requirement: AI chat panel in Playground

The Playground SHALL include an AI chat panel where users can describe forms in natural language. The AI SHALL generate or modify the current schema based on the conversation.

#### Scenario: Generate form from description

- **WHEN** user types "做一个员工入职登记表，包含姓名、部门、入职日期、紧急联系人"
- **THEN** the AI SHALL generate a schema with the described fields and apply it to the canvas

#### Scenario: Incremental modification

- **WHEN** a form already exists and user types "把部门改成下拉选择，选项是技术部、产品部、设计部"
- **THEN** the AI SHALL modify only the department field to use `widget: "select"` with the specified enum values, keeping all other fields unchanged

### Requirement: BYOK (Bring Your Own Key)

The AI integration SHALL require users to provide their own API key. Keys SHALL be stored in browser localStorage only and SHALL NOT be transmitted to any server other than the LLM provider's API endpoint.

#### Scenario: Configure API key

- **WHEN** user opens AI settings and enters an OpenAI API key
- **THEN** the key SHALL be saved to localStorage and used for subsequent AI requests

#### Scenario: No key configured

- **WHEN** user tries to use AI chat without a configured API key
- **THEN** the system SHALL display a prompt guiding the user to configure their API key

### Requirement: Multi-model support

The AI integration SHALL support multiple LLM providers: OpenAI (GPT-4), Anthropic (Claude), DeepSeek, and Alibaba (通义千问). Users SHALL be able to select their preferred model and configure custom API endpoints.

#### Scenario: Switch model provider

- **WHEN** user selects "DeepSeek" as the model provider and enters a DeepSeek API key
- **THEN** AI requests SHALL be sent to the DeepSeek API endpoint

#### Scenario: Custom API endpoint

- **WHEN** user configures a custom base URL (e.g., a company proxy or self-hosted model)
- **THEN** AI requests SHALL use the custom endpoint instead of the default provider URL

### Requirement: @v3sf/ai prompt templates

The `@v3sf/ai` package SHALL export reusable prompt templates and system prompts optimized for v3sf schema generation. These templates SHALL include the meta-schema definition and example schemas to guide LLM output.

#### Scenario: Use prompt template in custom application

- **WHEN** a developer imports `{ systemPrompt, generateSchemaPrompt }` from `@v3sf/ai`
- **THEN** they SHALL receive prompt strings that can be used with any LLM API to generate valid v3sf schemas

### Requirement: Schema validation and repair

The `@v3sf/ai` package SHALL provide a `validateAndRepair(schema)` function that validates AI-generated schemas against the meta-schema and attempts to auto-fix common errors (e.g., missing `type` on root object, invalid widget names).

#### Scenario: Fix missing root type

- **WHEN** AI generates `{ "properties": { "name": { "type": "string" } } }` (missing root `type: "object"`)
- **THEN** `validateAndRepair` SHALL return `{ "type": "object", "properties": { "name": { "type": "string" } } }`

#### Scenario: Flag unfixable errors

- **WHEN** AI generates a schema with deeply invalid structure
- **THEN** `validateAndRepair` SHALL return the original schema with an errors array describing what could not be auto-fixed

### Requirement: Example schema corpus

The `@v3sf/ai` package SHALL include a curated set of example schemas (at least 10) covering common form patterns. These examples serve as few-shot learning material for LLM prompts.

#### Scenario: Access example schemas

- **WHEN** developer imports `{ examples }` from `@v3sf/ai`
- **THEN** they SHALL receive an array of annotated schema objects with descriptions of what each form does
