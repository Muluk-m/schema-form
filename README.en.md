<h1 align="center">v3sf</h1>

<p align="center">
  UI-agnostic, AI-friendly JSON Schema form engine for Vue 3
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@v3sf/core"><img src="https://img.shields.io/npm/v/@v3sf/core?color=a1b858&label=npm" alt="npm version" /></a>
  <a href="https://github.com/Muluk-m/schema-form/actions/workflows/ci.yml"><img src="https://github.com/Muluk-m/schema-form/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/Muluk-m/schema-form/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Muluk-m/schema-form" alt="license" /></a>
</p>

<p align="center">
  <a href="./README.md">中文</a> | <a href="./README.en.md">English</a>
</p>

---

## Features

- **UI-Agnostic** — Core engine decoupled from UI frameworks; plug in any component library via adapters (Vant & Element Plus built-in)
- **AI-Friendly** — Ships with Meta Schema, prompt templates, and schema validation/repair for LLM-generated form configs
- **Lightweight** — Core gzipped < 8KB, zero external runtime dependencies
- **Safe Expressions** — Custom AST-based expression engine with `{{ }}` syntax, no `eval`/`Function`
- **Pluggable Validation** — Built-in lightweight validator covers 80% of cases; optionally plug in async-validator / zod
- **TypeScript** — Strict mode, full type inference
- **Visual Builder** — Drag-and-drop Generator + online Playground

## Quick Start

```bash
# Install core + UI adapter
pnpm add @v3sf/core @v3sf/vant
# or
pnpm add @v3sf/core @v3sf/element-plus
```

```vue
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import vantAdapter from '@v3sf/vant'

const SchemaForm = createSchemaForm(vantAdapter)

const formData = ref({ name: '', age: 0, subscribe: false })

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      required: true,
      placeholder: 'Enter your name',
    },
    age: {
      type: 'number',
      title: 'Age',
      rules: { min: 0, max: 150 },
    },
    subscribe: {
      type: 'boolean',
      title: 'Subscribe',
    },
    bio: {
      type: 'string',
      title: 'Bio',
      widget: 'textarea',
      hidden: '{{ !$values.subscribe }}',
    },
  },
}
</script>

<template>
  <SchemaForm v-model="formData" :schema="schema" />
</template>
```

Switch UI libraries in one line:

```ts
// Mobile → Vant
import vantAdapter from '@v3sf/vant'
const SchemaForm = createSchemaForm(vantAdapter)

// Desktop → Element Plus
import elementPlusAdapter from '@v3sf/element-plus'
const SchemaForm = createSchemaForm(elementPlusAdapter)
```

## Packages

| Package                                       | Description                                  | Version                                                                                                        |
| --------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [@v3sf/core](./packages/core)                 | UI-agnostic form engine                      | [![npm](https://img.shields.io/npm/v/@v3sf/core?label=)](https://npmjs.com/package/@v3sf/core)                 |
| [@v3sf/vant](./packages/vant)                 | Vant 4 adapter                               | [![npm](https://img.shields.io/npm/v/@v3sf/vant?label=)](https://npmjs.com/package/@v3sf/vant)                 |
| [@v3sf/element-plus](./packages/element-plus) | Element Plus adapter                         | [![npm](https://img.shields.io/npm/v/@v3sf/element-plus?label=)](https://npmjs.com/package/@v3sf/element-plus) |
| [@v3sf/ai](./packages/ai)                     | AI toolkit (prompts / validation / examples) | [![npm](https://img.shields.io/npm/v/@v3sf/ai?label=)](https://npmjs.com/package/@v3sf/ai)                     |
| [@v3sf/generator](./packages/generator)       | Visual drag-and-drop form builder            | [![npm](https://img.shields.io/npm/v/@v3sf/generator?label=)](https://npmjs.com/package/@v3sf/generator)       |

## Architecture

```
@v3sf/core (engine)
  ├── Schema Parser
  ├── Expression Engine (Tokenizer → Parser → AST → Evaluator)
  ├── Validation System (built-in + ValidatorAdapter interface)
  └── Widget Adapter Protocol (defineAdapter / createSchemaForm)
        │
    ┌───┴────────────┐
    │                │
@v3sf/vant     @v3sf/element-plus
 (mobile)          (desktop)
```

## Expression Linkage

Use `{{ }}` syntax for dynamic field behavior, powered by a safe AST engine:

```json
{
  "hidden": "{{ $values.age < 18 }}",
  "required": "{{ $values.type === 'vip' }}",
  "disabled": "{{ !$values.agreed }}",
  "props": {
    "rows": "{{ $values.type === 'long' ? 6 : 3 }}"
  }
}
```

## AI Integration

```ts
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

// 1. Guide LLM to generate schema
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: generateSchemaPrompt('Create a leave request form') },
]

// 2. Validate and repair AI output
const { schema, errors, fixed } = validateAndRepair(aiOutput)
```

## Development

```bash
pnpm install          # Install dependencies
pnpm build            # Build all library packages
pnpm test             # Run tests (151 tests)
pnpm lint             # ESLint check
pnpm dev:vue3         # Vant example app
```

## Documentation

- [Getting Started](./docs/en/guide/getting-started.md)
- [Schema Reference](./docs/en/guide/schema-reference.md)
- [Expressions](./docs/en/guide/expressions.md)
- [Custom Widgets](./docs/en/guide/custom-widgets.md)
- [Adapter Development](./docs/en/guide/adapters.md)
- [AI Integration](./docs/en/guide/ai-integration.md)

## Contributing

Issues and Pull Requests are welcome. Please follow [Conventional Commits](https://www.conventionalcommits.org/).

## License

[MIT](./LICENSE)
