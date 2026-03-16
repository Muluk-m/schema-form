## ADDED Requirements

### Requirement: Expression syntax parsing

The system SHALL parse expressions enclosed in `{{ }}` delimiters. Supported syntax: property access (`$values.name`, `$values.address.city`), comparison operators (`===`, `!==`, `>`, `<`, `>=`, `<=`), logical operators (`&&`, `||`, `!`), ternary (`condition ? a : b`), arithmetic (`+`, `-`, `*`, `/`, `%`), and literals (`true`, `false`, `null`, numbers, strings).

#### Scenario: Property access expression

- **WHEN** expression is `{{ $values.name }}` and formData is `{ name: "Alice" }`
- **THEN** the engine SHALL return `"Alice"`

#### Scenario: Nested property access

- **WHEN** expression is `{{ $values.address.city }}` and formData is `{ address: { city: "Beijing" } }`
- **THEN** the engine SHALL return `"Beijing"`

#### Scenario: Comparison expression

- **WHEN** expression is `{{ $values.age >= 18 }}` and formData is `{ age: 20 }`
- **THEN** the engine SHALL return `true`

#### Scenario: Logical combination

- **WHEN** expression is `{{ $values.agreed && $values.age > 18 }}` and formData is `{ agreed: true, age: 20 }`
- **THEN** the engine SHALL return `true`

#### Scenario: Ternary expression

- **WHEN** expression is `{{ $values.type === 'vip' ? 'VIP用户' : '普通用户' }}` and formData is `{ type: 'vip' }`
- **THEN** the engine SHALL return `"VIP用户"`

### Requirement: Sandboxed execution

The expression engine SHALL NOT use `Function()`, `eval()`, or any mechanism that allows arbitrary JavaScript execution. The engine MUST only evaluate the supported syntax subset and SHALL reject any expression containing unsupported constructs.

#### Scenario: Reject function calls

- **WHEN** expression is `{{ alert('xss') }}`
- **THEN** the engine SHALL throw a compile error and NOT execute the expression

#### Scenario: Reject assignment

- **WHEN** expression is `{{ $values.name = 'hacked' }}`
- **THEN** the engine SHALL throw a compile error

### Requirement: Compile-time validation

The system SHALL validate expressions at schema parse time (not at render time). Invalid expressions SHALL produce descriptive error messages indicating the position and nature of the error.

#### Scenario: Syntax error at parse time

- **WHEN** schema contains `hidden: "{{ $values.age > }}"` (incomplete expression)
- **THEN** the system SHALL throw an error during schema parsing with a message indicating the syntax error position

#### Scenario: Valid expressions pass compilation

- **WHEN** schema contains `hidden: "{{ $values.show === true }}"`
- **THEN** the system SHALL compile without errors and return a reusable evaluator function

### Requirement: Context variables

The engine SHALL provide three context variables to expressions: `$values` (full form data object), `$selfValue` (current field's value), and `$deps` (explicitly declared dependencies). These are the ONLY accessible variables.

#### Scenario: $selfValue access

- **WHEN** field "name" has expression `{{ $selfValue.length > 10 }}` and field value is `"HelloWorld!"`
- **THEN** the engine SHALL return `true`

### Requirement: Non-expression passthrough

When a schema property value is NOT wrapped in `{{ }}`, the system SHALL treat it as a literal value and NOT attempt expression evaluation.

#### Scenario: Boolean literal

- **WHEN** schema has `required: true`
- **THEN** the system SHALL use `true` directly without expression evaluation

#### Scenario: String without delimiters

- **WHEN** schema has `placeholder: "请输入姓名"`
- **THEN** the system SHALL use the string literally

### Requirement: Null-safe property access

Property access on `null` or `undefined` values SHALL return `undefined` instead of throwing an error.

#### Scenario: Access property of undefined

- **WHEN** expression is `{{ $values.address.city }}` and formData is `{ address: undefined }`
- **THEN** the engine SHALL return `undefined` without throwing
