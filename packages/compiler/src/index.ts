/**
 * @v3sf/compiler — Compile v3sf schemas to framework-specific form configs.
 */

import { compileToElementPlus } from './element-plus'
import { compileToHtml } from './html'
import type { CompileResult, CompileTarget } from './types'

export type { CompileResult, CompileTarget, CompileWarning, ExpressionMapping } from './types'

/**
 * Compile a v3sf schema to a target framework's form configuration.
 *
 * @example
 * ```ts
 * import { compile } from '@v3sf/compiler'
 *
 * const result = compile(schema, 'element-plus')
 * // result.config → { form: { model, rules }, formItems: [...] }
 * // result.expressions → [{ field, prop, source, compiled }]
 * ```
 */
export function compile(schema: any, target: CompileTarget): CompileResult {
  switch (target) {
    case 'element-plus':
      return compileToElementPlus(schema)
    case 'html':
      return compileToHtml(schema)
    default:
      return {
        success: false,
        config: {},
        warnings: [
          {
            code: 'UNKNOWN_TARGET',
            field: '',
            message: `Unknown compile target: "${target}"`,
            severity: 'error',
          },
        ],
        expressions: [],
      }
  }
}
