/**
 * Benchmark evaluation for AI schema generation quality.
 *
 * This test is NOT run in CI — it requires a real LLM API key.
 * Run manually: V3SF_API_KEY=sk-... pnpm vitest run packages/ai/__tests__/benchmark/evaluate.spec.ts
 */

import { describe, it, expect } from 'vitest'
import { benchmarkDataset, evaluateCase } from './dataset'

// Unit tests for the evaluation function itself (always run)
describe('evaluateCase', () => {
  it('scores a perfect match as full score', () => {
    const result = evaluateCase(
      {
        id: 'test',
        description: 'test',
        expectedFields: ['name', 'age'],
        expectedTypes: { name: 'string', age: 'number' },
        requiredFields: ['name'],
        category: 'basic',
        source: 'synthetic',
      },
      {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名', required: true },
          age: { type: 'number', title: '年龄' },
        },
      },
    )

    expect(result.fieldPresence).toBe(true)
    expect(result.typeCorrectness).toBe(true)
    expect(result.requiredCorrectness).toBe(true)
    expect(result.score).toBe(result.total)
  })

  it('detects missing fields', () => {
    const result = evaluateCase(
      {
        id: 'test',
        description: 'test',
        expectedFields: ['name', 'email'],
        expectedTypes: { name: 'string' },
        requiredFields: [],
        category: 'basic',
        source: 'synthetic',
      },
      {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名' },
        },
      },
    )

    expect(result.fieldPresence).toBe(false)
    expect(result.details).toContain('Missing fields: email')
  })

  it('detects type mismatches', () => {
    const result = evaluateCase(
      {
        id: 'test',
        description: 'test',
        expectedFields: ['age'],
        expectedTypes: { age: 'number' },
        requiredFields: [],
        category: 'basic',
        source: 'synthetic',
      },
      {
        type: 'object',
        properties: {
          age: { type: 'string', title: '年龄' },
        },
      },
    )

    expect(result.typeCorrectness).toBe(false)
  })

  it('detects missing expressions', () => {
    const result = evaluateCase(
      {
        id: 'test',
        description: 'test',
        expectedFields: ['toggle', 'detail'],
        expectedTypes: { toggle: 'boolean' },
        requiredFields: [],
        expectsExpressions: true,
        category: 'expression',
        source: 'synthetic',
      },
      {
        type: 'object',
        properties: {
          toggle: { type: 'boolean', widget: 'switch' },
          detail: { type: 'string' },
        },
      },
    )

    expect(result.expressionPresence).toBe(false)
  })
})

// Dataset integrity check (always run)
describe('benchmark dataset', () => {
  it('has at least 35 cases', () => {
    expect(benchmarkDataset.length).toBeGreaterThanOrEqual(35)
  })

  it('has community-sourced cases', () => {
    const community = benchmarkDataset.filter((c) => c.source === 'community')
    expect(community.length).toBeGreaterThanOrEqual(5)
  })

  it('covers all categories', () => {
    const categories = new Set(benchmarkDataset.map((c) => c.category))
    expect(categories).toContain('basic')
    expect(categories).toContain('validation')
    expect(categories).toContain('enum')
    expect(categories).toContain('expression')
    expect(categories).toContain('nested')
    expect(categories).toContain('complex')
  })

  it('all cases have unique IDs', () => {
    const ids = benchmarkDataset.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
