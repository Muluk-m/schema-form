import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGenerator, GeneratorError } from '../src/generator'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function mockApiResponse(schema: object) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        choices: [{ message: { content: JSON.stringify(schema) } }],
      }),
  })
}

function mockApiError(status: number, statusText: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
    text: () => Promise.resolve('error body'),
  })
}

describe('createGenerator', () => {
  const generator = createGenerator({
    apiKey: 'test-key',
    baseUrl: 'https://api.test.com/v1',
    model: 'test-model',
  })

  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('generate', () => {
    it('generates a valid schema successfully', async () => {
      const validSchema = {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名', required: true },
        },
      }
      mockApiResponse(validSchema)

      const result = await generator.generate('用户注册表单')

      expect(result.success).toBe(true)
      expect(result.schema.properties.name.type).toBe('string')
      expect(result.errors).toHaveLength(0)
    })

    it('repairs a schema with missing type', async () => {
      mockApiResponse({
        type: 'object',
        properties: {
          name: { title: '姓名', widget: 'input' },
        },
      })

      const result = await generator.generate('简单表单')

      expect(result.success).toBe(true)
      expect(result.schema.properties.name.type).toBe('string')
      expect(result.repairs.length).toBeGreaterThan(0)
    })

    it('returns errors for unfixable schema issues', async () => {
      mockApiResponse({
        type: 'object',
        properties: {
          gender: {
            type: 'string',
            widget: 'radio',
            title: '性别',
            // Missing enum — unfixable error
          },
        },
      })

      const result = await generator.generate('性别选择')

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.suggestions.length).toBeGreaterThan(0)
    })

    it('sends correct API request', async () => {
      mockApiResponse({ type: 'object', properties: {} })
      await generator.generate('测试')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-key',
          }),
        }),
      )

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.model).toBe('test-model')
      expect(body.messages).toHaveLength(2)
      expect(body.messages[0].role).toBe('system')
    })

    it('throws GeneratorError on API failure', async () => {
      mockApiError(401, 'Unauthorized')

      await expect(generator.generate('测试')).rejects.toThrow(GeneratorError)
    })

    it('parses JSON from markdown code blocks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content:
                    '```json\n{"type":"object","properties":{"x":{"type":"string","title":"X"}}}\n```',
                },
              },
            ],
          }),
      })

      const result = await generator.generate('测试')
      expect(result.schema.properties.x.type).toBe('string')
    })
  })

  describe('modify', () => {
    it('modifies an existing schema', async () => {
      const modified = {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名' },
          email: { type: 'string', title: '邮箱' },
        },
      }
      mockApiResponse(modified)

      const current = {
        type: 'object',
        properties: {
          name: { type: 'string', title: '姓名' },
        },
      }

      const result = await generator.modify(current, '加一个邮箱字段')

      expect(result.success).toBe(true)
      expect(result.schema.properties.email).toBeDefined()
    })
  })
})
