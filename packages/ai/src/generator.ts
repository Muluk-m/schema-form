/**
 * AI Schema Generator — BYOK (Bring Your Own Key) LLM integration.
 *
 * Provides a factory function to create a schema generator that calls any
 * OpenAI-compatible API to generate and modify v3sf form schemas.
 */

import { validateAndRepair } from '@v3sf/schema'
import { systemPrompt, generateSchemaPrompt, modifySchemaPrompt } from './prompts'

export interface GeneratorConfig {
  /** LLM API key */
  apiKey: string
  /** API base URL (default: https://api.openai.com/v1) */
  baseUrl?: string
  /** Model name (default: gpt-4o) */
  model?: string
  /** Request timeout in ms (default: 30000) */
  timeout?: number
}

export interface GenerateResult {
  /** Whether generation succeeded (schema is valid or was successfully repaired) */
  success: boolean
  /** The generated/repaired schema */
  schema: any
  /** Validation errors that could not be auto-repaired */
  errors: string[]
  /** Auto-repair records */
  repairs: string[]
  /** Suggestions for the user to improve their description */
  suggestions: string[]
}

/**
 * Create a schema generator with the given LLM configuration.
 *
 * @example
 * ```ts
 * const generator = createGenerator({
 *   apiKey: process.env.V3SF_API_KEY!,
 *   model: 'gpt-4o',
 * })
 *
 * const result = await generator.generate('用户注册表单，包含手机号验证')
 * if (result.success) {
 *   console.log(result.schema)
 * }
 * ```
 */
export function createGenerator(config: GeneratorConfig) {
  const baseUrl = config.baseUrl ?? 'https://api.openai.com/v1'
  const model = config.model ?? 'gpt-4o'
  const timeout = config.timeout ?? 30000

  async function callLLM(messages: Array<{ role: string; content: string }>): Promise<string> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        throw new GeneratorError(
          `API 请求失败: ${response.status} ${response.statusText}`,
          response.status,
          body,
        )
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content ?? ''
    } finally {
      clearTimeout(timer)
    }
  }

  function parseSchemaResponse(content: string): any {
    // Try to parse as JSON directly
    try {
      return JSON.parse(content)
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim())
      }
      throw new GeneratorError('无法从 AI 响应中解析 JSON schema', 0, content)
    }
  }

  function buildResult(rawSchema: any): GenerateResult {
    const { schema, repairs, errors, repaired } = validateAndRepair(rawSchema)

    const suggestions: string[] = []
    if (errors.length > 0) {
      suggestions.push('尝试更详细地描述表单字段和验证规则')
      if (errors.some((e) => e.includes('widget'))) {
        suggestions.push('指定具体的组件类型（如"下拉选择"、"单选按钮"）')
      }
      if (errors.some((e) => e.includes('enum'))) {
        suggestions.push('为选择类字段提供具体的选项值')
      }
    }

    return {
      success: errors.length === 0,
      schema,
      errors,
      repairs,
      suggestions,
    }
  }

  return {
    /**
     * Generate a form schema from a natural language description.
     */
    async generate(description: string): Promise<GenerateResult> {
      const content = await callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: generateSchemaPrompt(description) },
      ])

      const rawSchema = parseSchemaResponse(content)
      return buildResult(rawSchema)
    },

    /**
     * Modify an existing schema based on a natural language instruction.
     */
    async modify(currentSchema: object, instruction: string): Promise<GenerateResult> {
      const content = await callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: modifySchemaPrompt(currentSchema, instruction) },
      ])

      const rawSchema = parseSchemaResponse(content)
      return buildResult(rawSchema)
    },
  }
}

/**
 * Error thrown by the generator for API or parsing failures.
 */
export class GeneratorError extends Error {
  status: number
  body: string

  constructor(message: string, status: number, body: string) {
    super(message)
    this.name = 'GeneratorError'
    this.status = status
    this.body = body
  }
}
