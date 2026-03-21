/**
 * Compiler output types.
 */

export type CompileTarget = 'element-plus' | 'antd' | 'formily' | 'html'

export interface CompileWarning {
  code: string
  field: string
  message: string
  severity: 'info' | 'warning' | 'error'
}

export interface ExpressionMapping {
  /** Field name this expression applies to */
  field: string
  /** Property the expression controls (hidden, disabled, required, etc.) */
  prop: string
  /** Original v3sf expression */
  source: string
  /** Compiled expression for the target framework */
  compiled: string
}

export interface CompileResult {
  /** Whether compilation succeeded without errors */
  success: boolean
  /** Target framework config object */
  config: Record<string, unknown>
  /** Warnings about unmappable features */
  warnings: CompileWarning[]
  /** Expression mappings for dynamic behavior */
  expressions: ExpressionMapping[]
}
