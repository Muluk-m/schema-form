## ADDED Requirements

### Requirement: Built-in lightweight validator

The core package SHALL include a built-in validator that supports the following rule types without external dependencies: `required` (non-empty check), `pattern` (regex match), `min` / `max` (numeric range or string/array length), `type` (basic type check: string, number, boolean, array), and `custom` (user-provided function).

#### Scenario: Required validation

- **WHEN** field has `required: true` and value is `""` (empty string)
- **THEN** validator SHALL return an error with a default message

#### Scenario: Pattern validation

- **WHEN** field has `rules: { pattern: "^\\d{11}$" }` and value is `"1234"`
- **THEN** validator SHALL return an error indicating pattern mismatch

#### Scenario: Min/max for number

- **WHEN** field has `rules: { min: 0, max: 100 }` and value is `150`
- **THEN** validator SHALL return an error indicating value exceeds maximum

#### Scenario: Min/max for string length

- **WHEN** field type is `string` and has `rules: { min: 2, max: 10 }` and value is `"a"`
- **THEN** validator SHALL return an error indicating string length is below minimum

#### Scenario: Custom validator function

- **WHEN** field has `rules: { custom: (value, formData) => value === formData.password ? true : "密码不一致" }` and values don't match
- **THEN** validator SHALL return the custom error message `"密码不一致"`

### Requirement: Validator adapter interface

The system SHALL define a `ValidatorAdapter` interface that external validator libraries can implement. The interface MUST include: `validate(value, rules, fieldSchema) → Promise<string[]>` (returns array of error messages, empty if valid).

#### Scenario: Use async-validator adapter

- **WHEN** developer provides `@v3sf/validator-async` adapter via `createSchemaForm(adapter, { validator: asyncValidatorAdapter })`
- **THEN** validation SHALL use async-validator rules instead of the built-in validator

#### Scenario: Default to built-in validator

- **WHEN** no external validator adapter is provided
- **THEN** the system SHALL use the built-in lightweight validator

### Requirement: Single field validation

The system SHALL support validating a single field by name via `validateFields(fieldNames)` method exposed through the form ref.

#### Scenario: Validate one field

- **WHEN** developer calls `formRef.validateFields(['email'])`
- **THEN** only the `email` field SHALL be validated, returning errors for that field only

### Requirement: Full form validation

The system SHALL support validating all fields via `validate()` method exposed through the form ref. Validation SHALL return a list of all field errors.

#### Scenario: Validate entire form

- **WHEN** developer calls `formRef.validate()` and two fields have errors
- **THEN** the method SHALL return an array containing both field error objects

#### Scenario: Valid form

- **WHEN** developer calls `formRef.validate()` and all fields are valid
- **THEN** the method SHALL return an empty array

### Requirement: Scroll to first error

The `validate` method SHALL accept an optional `scrollToError` parameter. When `true` and validation fails, the form SHALL scroll to the first invalid field.

#### Scenario: Scroll on validation failure

- **WHEN** developer calls `formRef.validate(true)` and the third field is invalid
- **THEN** the form SHALL scroll the viewport to make the third field visible
