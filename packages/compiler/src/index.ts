/**
 * @v3sf/compiler — Compile v3sf schemas to framework-specific form configs.
 */

import { compileToElementPlus } from './element-plus'
import { compileToAntd } from './antd'
import { compileToFormily } from './formily'
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
 *
 * const formily = compile(schema, 'formily')
 * // formily.config → Formily JSON Schema with x-component, x-reactions
 * ```
 */
export function compile(schema: any, target: CompileTarget): CompileResult {
  switch (target) {
    case 'element-plus':
      return compileToElementPlus(schema)
    case 'antd':
      return compileToAntd(schema)
    case 'formily':
      return compileToFormily(schema)
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
