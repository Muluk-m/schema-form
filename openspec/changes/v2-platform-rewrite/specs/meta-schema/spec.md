## ADDED Requirements

### Requirement: JSON Schema meta-schema file

The core package SHALL publish a `schema.meta.json` file that describes the structure of v3sf schema objects in JSON Schema (draft 2020-12) format. This file SHALL define all valid field types, widget names, expression string patterns, and rule structures.

#### Scenario: Validate a correct schema

- **WHEN** a valid v3sf schema is validated against `schema.meta.json` using any JSON Schema validator
- **THEN** validation SHALL pass with no errors

#### Scenario: Detect invalid field type

- **WHEN** a schema contains `type: "invalid"` and is validated against `schema.meta.json`
- **THEN** validation SHALL fail with an error indicating invalid enum value for `type`

#### Scenario: Validate expression pattern

- **WHEN** a schema contains `hidden: "{{ $values.show }}"` and is validated against `schema.meta.json`
- **THEN** validation SHALL pass because the value matches the expression pattern `^\s*\{\{[\s\S]*\}\}\s*$`

### Requirement: IDE autocompletion support

The core package SHALL include a `$schema` reference in documentation examples so that JSON editors (VS Code, WebStorm) can provide autocomplete and validation when editing v3sf schema files.

#### Scenario: JSON file with $schema reference

- **WHEN** a JSON file begins with `{ "$schema": "./node_modules/@v3sf/core/schema.meta.json" }`
- **THEN** the IDE SHALL provide autocomplete for `type`, `title`, `widget`, `required`, `hidden`, `rules`, and other v3sf schema properties

### Requirement: TypeScript type generation alignment

The TypeScript types exported from `@v3sf/core` for schema definitions SHALL be consistent with the meta-schema. Any property defined in the meta-schema MUST have a corresponding TypeScript type, and vice versa.

#### Scenario: Schema type matches meta-schema

- **WHEN** a developer writes a schema object in TypeScript using the exported `Schema` type
- **THEN** the TypeScript type SHALL allow exactly the same properties and value types as defined in `schema.meta.json`

### Requirement: AI function calling definition

The `@v3sf/ai` package SHALL export the meta-schema in a format suitable for LLM function calling / tool use (OpenAI function schema format). This allows AI models to generate validated schemas.

#### Scenario: Use meta-schema as function parameter

- **WHEN** the meta-schema is provided as a function parameter definition to an LLM API
- **THEN** the LLM SHALL be constrained to generate schema objects that conform to the v3sf structure
