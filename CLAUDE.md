# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

v3sf: a UI-agnostic, AI-friendly JSON Schema form engine for Vue 3. Core engine is framework-independent; UI adapters (Vant, Element Plus) are separate packages. Includes a visual form builder (Generator), online Playground, and AI toolkit for schema generation.

## Monorepo Structure

pnpm 10+ workspaces monorepo:

- **`packages/core`** (`@v3sf/core`) - UI-agnostic form engine: schema parsing, expression engine, validation, widget adapter protocol
- **`packages/vant`** (`@v3sf/vant`) - Vant 4 UI adapter with 9 widgets
- **`packages/element-plus`** (`@v3sf/element-plus`) - Element Plus UI adapter with 9 widgets
- **`packages/generator`** (`@v3sf/generator`) - Visual drag-and-drop form builder with undo/redo
- **`packages/ai`** (`@v3sf/ai`) - AI toolkit: prompt templates, schema validation/repair, example corpus
- **`packages/playground`** (`@v3sf/playground`) - Online playground app with AI chat integration
- **`packages/vue3-example`** - Demo app (Vant adapter)
- **`packages/generator-example`** - Demo app (Generator)
- **`docs/`** - VitePress documentation site

## Common Commands

```bash
pnpm install                    # Install dependencies
pnpm build                      # Build all packages
pnpm build:core                 # Build core only
pnpm test                       # Run Vitest tests
pnpm test:watch                 # Watch mode
pnpm test:coverage              # With coverage
pnpm lint                       # ESLint 9 flat config
pnpm lint:fix                   # Auto-fix
pnpm format                     # Prettier
pnpm dev:vue3                   # Dev server for vue3-example
pnpm dev:gen                    # Dev server for generator-example
pnpm commit                     # Commitizen conventional commit
```

## Architecture

**Dependency flow:**

```
@v3sf/playground → @v3sf/ai → @v3sf/core
                 → @v3sf/vant → @v3sf/core
                 → @v3sf/element-plus → @v3sf/core
@v3sf/generator → @v3sf/core
```

**Core engine** (`packages/core/src/`):

- `components/` - SchemaForm (factory via `createSchemaForm(adapter)`), Field, Label
- `expression/` - Self-built safe expression engine (tokenizer → parser → AST → evaluator). NO `Function()`/`eval()`. Supports `{{ }}` syntax with property access, comparison, logical, ternary, arithmetic
- `validator/` - Pluggable validation: built-in lightweight validator (required/pattern/min/max/type/custom) + `ValidatorAdapter` interface for external validators
- `adapter/` - `defineAdapter()`, `defineWidget()`, `createSchemaForm()` factory, propsMap resolution
- `hooks/useAddon.ts` - Widget context hook
- `types/` - All type definitions
- `constants.ts` - Vue injection keys

**Key patterns:**

- `createSchemaForm(adapter)` returns a configured SchemaForm component bound to a UI adapter
- Schema properties support `{{ }}` expressions: `"hidden": "{{ $values.age < 18 }}"`
- Expressions are compiled at schema parse time and executed safely via AST evaluation
- Widget adapters use `propsMap` to translate schema props to UI-library-specific prop names
- Validation is pluggable: built-in covers 80% cases, external adapters (async-validator, zod) can be injected

## Build

tsdown (powered by rolldown). Each package has `tsdown.config.ts`. Output: ESM (`.js`), CJS (`.cjs`), TypeScript declarations (`.d.ts`).

## Testing

Vitest with happy-dom environment. Test files: `packages/**/__tests__/**/*.{test,spec}.{ts,tsx}`. Run single test: `pnpm vitest run packages/core/__tests__/expression.spec.ts`.

## Code Style

- Prettier: 100-char width, single quotes, no semicolons, 2-space indent
- ESLint 9: flat config with typescript-eslint + eslint-plugin-vue
- TypeScript: strict mode enabled
- Commit convention: Conventional Commits (commitlint + husky)
- Path aliases: `@v3sf/core` → `packages/core/src`, etc.

## Language

This is a Chinese-language project. UI labels, validation messages, AI prompts, and documentation are in Chinese.
