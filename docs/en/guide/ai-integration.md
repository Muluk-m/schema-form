# AI Integration

`@v3sf/ai` provides a set of tools for using large language models (LLMs) to automatically generate and repair v3sf form schemas.

## Installation

```bash
npm install @v3sf/ai
```

## Overview

`@v3sf/ai` exports the following:

| Export                                    | Description                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `systemPrompt`                            | System prompt describing the full v3sf schema specification              |
| `generateSchemaPrompt(description)`       | Builds a "generate schema" prompt from a user description                |
| `modifySchemaPrompt(schema, instruction)` | Builds a "modify schema" prompt from an existing schema and instructions |
| `metaSchemaForFunctionCalling`            | Meta schema in OpenAI function calling format                            |
| `validateAndRepair(schema)`               | Validates and auto-repairs AI-generated schemas                          |
| `examples`                                | 10 built-in example schemas for few-shot prompting                       |

## System Prompt

`systemPrompt` is a comprehensive system prompt that includes:

- v3sf schema format specification
- All value types and available widgets
- Field property reference
- Validation rules
- Expression syntax and variables
- 3 complete examples

Use it directly as the LLM's system message:

```ts
import { systemPrompt, generateSchemaPrompt } from '@v3sf/ai'

const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: generateSchemaPrompt('Create a leave request form') },
]

// Send to any LLM API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${YOUR_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages,
  }),
})
```

## Function Calling

`metaSchemaForFunctionCalling` provides a JSON Schema constraint in OpenAI function calling format, ensuring the AI outputs well-structured, valid schemas.

```ts
import { systemPrompt, metaSchemaForFunctionCalling } from '@v3sf/ai'

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${YOUR_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: 'Create a user registration form with username, email, and password',
      },
    ],
    tools: [
      {
        type: 'function',
        function: metaSchemaForFunctionCalling,
      },
    ],
    tool_choice: {
      type: 'function',
      function: { name: 'generate_form_schema' },
    },
  }),
})
```

## Validate and Repair

AI-generated schemas may contain formatting issues. `validateAndRepair` automatically detects and fixes common errors.

```ts
import { validateAndRepair } from '@v3sf/ai'

// Raw schema from AI (may have issues)
const rawSchema = JSON.parse(aiOutput)

const result = validateAndRepair(rawSchema)

console.log(result.schema) // Repaired schema
console.log(result.repairs) // Repairs applied, e.g. ['Root node missing type, set to "object"']
console.log(result.errors) // Errors that could not be auto-fixed
console.log(result.repaired) // Whether any repairs were made
```

**Auto-repair capabilities:**

- Missing `type: "object"` on root node -- added automatically
- Missing `properties` on root -- extracted from top-level fields
- Field missing `type` -- inferred from `widget` or `enum`
- Invalid `displayType` -- removed automatically
- Nested `object` fields -- validated recursively

**Error detection (reported but not auto-fixed):**

- Unknown `type` values
- Unknown `widget` names
- Selection widgets missing `enum`
- Mismatched `enum` / `enumNames` lengths

## BYOK (Bring Your Own Key)

`@v3sf/ai` has **zero LLM SDK dependencies**. It only provides prompts and validation tools. Use it with any LLM service:

- OpenAI / Azure OpenAI
- Anthropic Claude
- Google Gemini
- Open-source models (Qwen, DeepSeek, etc.)
- Any OpenAI-compatible API

```ts
// Example with Anthropic Claude
import Anthropic from '@anthropic-ai/sdk'
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

const client = new Anthropic()

const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: 'user', content: generateSchemaPrompt('Create an employee onboarding form') }],
})

const rawSchema = JSON.parse(message.content[0].text)
const { schema } = validateAndRepair(rawSchema)
// schema is ready to pass to SchemaForm
```

## Built-in Examples

`examples` contains 10 common form scenarios that can be used for few-shot prompting to improve generation quality.

```ts
import { examples } from '@v3sf/ai'

examples.forEach((example) => {
  console.log(example.name) // 'Login Form'
  console.log(example.description) // 'Basic login form with username and password'
  console.log(example.schema) // Complete v3sf schema object
})
```

Built-in examples include: Login Form, User Registration, Leave Request, Contact Us, Survey, Product Order, Employee Onboarding, Feedback, System Settings, Address Form.
