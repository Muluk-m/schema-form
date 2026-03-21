/**
 * Expression engine — re-exports from safe-template-expr with v3sf-specific helpers.
 */

export {
  isExpression,
  extractExpression,
  compile,
  evaluateExpression,
  ExpressionError,
} from 'safe-template-expr'

export type { CompiledExpression, ExpressionContext, ASTNode } from 'safe-template-expr'

import { isExpression, extractExpression, compile } from 'safe-template-expr'

/**
 * Resolve a schema value — if it's an expression ({{ }}), evaluate it
 * with v3sf form context ($values, $selfValue, $deps).
 * Otherwise return the value as-is.
 */
export function resolveValue(
  value: unknown,
  selfValue: unknown,
  formData: Record<string, any>,
  deps: Record<string, any>,
): unknown {
  if (!isExpression(value)) return value

  const expression = extractExpression(value)
  const context = {
    $values: formData,
    $selfValue: selfValue,
    $deps: deps,
  }

  try {
    return compile(expression)(context)
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[v3sf] Expression error in "{{ ${expression} }}":`, error)
    }
    return undefined
  }
}
