/**
 * v3sf Schema 校验与自动修复
 *
 * 对 AI 生成的 schema 进行校验，并尽可能自动修复常见问题。
 *
 * @deprecated Use `validateAndRepair` from `@v3sf/schema` instead.
 * This module re-exports from @v3sf/schema for backward compatibility.
 */

export type { ValidateResult } from '@v3sf/schema'
import { validateAndRepair as _validateAndRepair } from '@v3sf/schema'

/**
 * Re-export validateAndRepair from @v3sf/schema.
 * @deprecated Import directly from '@v3sf/schema' instead.
 */
export const validateAndRepair = _validateAndRepair
