/**
 * safe-template-expr
 *
 * Safe template expression engine with {{ }} syntax.
 * AST-based evaluation — no eval(), no Function(), zero dependencies.
 *
 * Supports: property access, arithmetic, comparison, logical, ternary operators.
 * Null-safe member access: `a.b.c` returns undefined if `a` or `b` is null.
 */

// Token types
const enum TokenType {
  Number,
  String,
  Identifier,
  Dot,
  LeftParen,
  RightParen,
  Plus,
  Minus,
  Star,
  Slash,
  Percent,
  Eq,
  NotEq,
  StrictEq,
  StrictNotEq,
  Lt,
  LtEq,
  Gt,
  GtEq,
  And,
  Or,
  Not,
  Question,
  Colon,
  True,
  False,
  Null,
  Undefined,
  EOF,
}

interface Token {
  type: TokenType
  value: string | number | boolean | null
  pos: number
}

// Expression regex to detect {{ }}
const ExpRE = /^\s*\{\{([\s\S]*)\}\}\s*$/

/**
 * Check if a value is a template expression (wrapped in {{ }}).
 */
export function isExpression(value: unknown): value is string {
  return typeof value === 'string' && ExpRE.test(value)
}

/**
 * Extract the inner expression from {{ }} wrapper.
 */
export function extractExpression(value: string): string {
  const match = value.match(ExpRE)
  return match ? match[1].trim() : value
}

// ============ TOKENIZER ============

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < input.length) {
    // Skip whitespace
    if (/\s/.test(input[i])) {
      i++
      continue
    }

    const pos = i

    // Numbers
    if (/[0-9]/.test(input[i]) || (input[i] === '.' && /[0-9]/.test(input[i + 1]))) {
      let num = ''
      while (i < input.length && (/[0-9]/.test(input[i]) || input[i] === '.')) {
        num += input[i++]
      }
      tokens.push({ type: TokenType.Number, value: parseFloat(num), pos })
      continue
    }

    // Strings (single or double quotes)
    if (input[i] === "'" || input[i] === '"') {
      const quote = input[i++]
      let str = ''
      while (i < input.length && input[i] !== quote) {
        if (input[i] === '\\') {
          i++
          if (i < input.length) {
            const escapeMap: Record<string, string> = { n: '\n', t: '\t', r: '\r', '\\': '\\' }
            str += escapeMap[input[i]] ?? input[i]
          }
        } else {
          str += input[i]
        }
        i++
      }
      if (i >= input.length) {
        throw new ExpressionError(`Unterminated string at position ${pos}`, pos)
      }
      i++ // skip closing quote
      tokens.push({ type: TokenType.String, value: str, pos })
      continue
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(input[i])) {
      let id = ''
      while (i < input.length && /[a-zA-Z0-9_$]/.test(input[i])) {
        id += input[i++]
      }
      switch (id) {
        case 'true':
          tokens.push({ type: TokenType.True, value: true, pos })
          break
        case 'false':
          tokens.push({ type: TokenType.False, value: false, pos })
          break
        case 'null':
          tokens.push({ type: TokenType.Null, value: null, pos })
          break
        case 'undefined':
          tokens.push({ type: TokenType.Undefined, value: undefined as any, pos })
          break
        default:
          tokens.push({ type: TokenType.Identifier, value: id, pos })
      }
      continue
    }

    // Multi-char operators
    const three = input.substring(i, i + 3)
    const two = input.substring(i, i + 2)

    if (three === '===') {
      tokens.push({ type: TokenType.StrictEq, value: '===', pos })
      i += 3
      continue
    }
    if (three === '!==') {
      tokens.push({ type: TokenType.StrictNotEq, value: '!==', pos })
      i += 3
      continue
    }
    if (two === '==') {
      tokens.push({ type: TokenType.Eq, value: '==', pos })
      i += 2
      continue
    }
    if (two === '!=') {
      tokens.push({ type: TokenType.NotEq, value: '!=', pos })
      i += 2
      continue
    }
    if (two === '<=') {
      tokens.push({ type: TokenType.LtEq, value: '<=', pos })
      i += 2
      continue
    }
    if (two === '>=') {
      tokens.push({ type: TokenType.GtEq, value: '>=', pos })
      i += 2
      continue
    }
    if (two === '&&') {
      tokens.push({ type: TokenType.And, value: '&&', pos })
      i += 2
      continue
    }
    if (two === '||') {
      tokens.push({ type: TokenType.Or, value: '||', pos })
      i += 2
      continue
    }

    // Single-char operators
    const singleOps: Record<string, TokenType> = {
      '.': TokenType.Dot,
      '(': TokenType.LeftParen,
      ')': TokenType.RightParen,
      '+': TokenType.Plus,
      '-': TokenType.Minus,
      '*': TokenType.Star,
      '/': TokenType.Slash,
      '%': TokenType.Percent,
      '<': TokenType.Lt,
      '>': TokenType.Gt,
      '!': TokenType.Not,
      '?': TokenType.Question,
      ':': TokenType.Colon,
    }

    if (singleOps[input[i]] !== undefined) {
      tokens.push({ type: singleOps[input[i]], value: input[i], pos })
      i++
      continue
    }

    throw new ExpressionError(`Unexpected character '${input[i]}' at position ${pos}`, pos)
  }

  tokens.push({ type: TokenType.EOF, value: null, pos: i })
  return tokens
}

// ============ AST NODES ============

export type ASTNode =
  | { type: 'Literal'; value: any }
  | { type: 'Identifier'; name: string }
  | { type: 'MemberExpression'; object: ASTNode; property: string }
  | { type: 'UnaryExpression'; operator: string; argument: ASTNode }
  | { type: 'BinaryExpression'; operator: string; left: ASTNode; right: ASTNode }
  | { type: 'LogicalExpression'; operator: string; left: ASTNode; right: ASTNode }
  | { type: 'ConditionalExpression'; test: ASTNode; consequent: ASTNode; alternate: ASTNode }

// ============ PARSER ============

class Parser {
  private tokens: Token[]
  private pos = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  private current(): Token {
    return this.tokens[this.pos]
  }

  private eat(type: TokenType): Token {
    const token = this.current()
    if (token.type !== type) {
      throw new ExpressionError(
        `Expected token type ${type} but got ${token.type} at position ${token.pos}`,
        token.pos,
      )
    }
    this.pos++
    return token
  }

  private peek(): Token {
    return this.tokens[this.pos]
  }

  parse(): ASTNode {
    const node = this.parseTernary()
    if (this.current().type !== TokenType.EOF) {
      throw new ExpressionError(
        `Unexpected token at position ${this.current().pos}`,
        this.current().pos,
      )
    }
    return node
  }

  private parseTernary(): ASTNode {
    let node = this.parseOr()

    if (this.peek().type === TokenType.Question) {
      this.eat(TokenType.Question)
      const consequent = this.parseTernary()
      this.eat(TokenType.Colon)
      const alternate = this.parseTernary()
      node = { type: 'ConditionalExpression', test: node, consequent, alternate }
    }

    return node
  }

  private parseOr(): ASTNode {
    let node = this.parseAnd()
    while (this.peek().type === TokenType.Or) {
      this.eat(TokenType.Or)
      const right = this.parseAnd()
      node = { type: 'LogicalExpression', operator: '||', left: node, right }
    }
    return node
  }

  private parseAnd(): ASTNode {
    let node = this.parseEquality()
    while (this.peek().type === TokenType.And) {
      this.eat(TokenType.And)
      const right = this.parseEquality()
      node = { type: 'LogicalExpression', operator: '&&', left: node, right }
    }
    return node
  }

  private parseEquality(): ASTNode {
    let node = this.parseComparison()
    while (
      [TokenType.StrictEq, TokenType.StrictNotEq, TokenType.Eq, TokenType.NotEq].includes(
        this.peek().type,
      )
    ) {
      const op = this.current().value as string
      this.pos++
      const right = this.parseComparison()
      node = { type: 'BinaryExpression', operator: op, left: node, right }
    }
    return node
  }

  private parseComparison(): ASTNode {
    let node = this.parseAdditive()
    while (
      [TokenType.Lt, TokenType.LtEq, TokenType.Gt, TokenType.GtEq].includes(this.peek().type)
    ) {
      const op = this.current().value as string
      this.pos++
      const right = this.parseAdditive()
      node = { type: 'BinaryExpression', operator: op, left: node, right }
    }
    return node
  }

  private parseAdditive(): ASTNode {
    let node = this.parseMultiplicative()
    while ([TokenType.Plus, TokenType.Minus].includes(this.peek().type)) {
      const op = this.current().value as string
      this.pos++
      const right = this.parseMultiplicative()
      node = { type: 'BinaryExpression', operator: op, left: node, right }
    }
    return node
  }

  private parseMultiplicative(): ASTNode {
    let node = this.parseUnary()
    while ([TokenType.Star, TokenType.Slash, TokenType.Percent].includes(this.peek().type)) {
      const op = this.current().value as string
      this.pos++
      const right = this.parseUnary()
      node = { type: 'BinaryExpression', operator: op, left: node, right }
    }
    return node
  }

  private parseUnary(): ASTNode {
    if (this.peek().type === TokenType.Not) {
      this.eat(TokenType.Not)
      const argument = this.parseUnary()
      return { type: 'UnaryExpression', operator: '!', argument }
    }
    if (this.peek().type === TokenType.Minus) {
      this.eat(TokenType.Minus)
      const argument = this.parseUnary()
      return { type: 'UnaryExpression', operator: '-', argument }
    }
    return this.parseMemberAccess()
  }

  private parseMemberAccess(): ASTNode {
    let node = this.parsePrimary()

    while (this.peek().type === TokenType.Dot) {
      this.eat(TokenType.Dot)
      const prop = this.eat(TokenType.Identifier)
      node = { type: 'MemberExpression', object: node, property: prop.value as string }
    }

    return node
  }

  private parsePrimary(): ASTNode {
    const token = this.current()

    switch (token.type) {
      case TokenType.Number:
      case TokenType.String:
        this.pos++
        return { type: 'Literal', value: token.value }
      case TokenType.True:
      case TokenType.False:
        this.pos++
        return { type: 'Literal', value: token.value }
      case TokenType.Null:
        this.pos++
        return { type: 'Literal', value: null }
      case TokenType.Undefined:
        this.pos++
        return { type: 'Literal', value: undefined }
      case TokenType.Identifier:
        this.pos++
        return { type: 'Identifier', name: token.value as string }
      case TokenType.LeftParen: {
        this.eat(TokenType.LeftParen)
        const expr = this.parseTernary()
        this.eat(TokenType.RightParen)
        return expr
      }
      default:
        throw new ExpressionError(`Unexpected token at position ${token.pos}`, token.pos)
    }
  }
}

// ============ EVALUATOR ============

export type ExpressionContext = Record<string, any>

function evaluate(node: ASTNode, context: ExpressionContext): any {
  switch (node.type) {
    case 'Literal':
      return node.value

    case 'Identifier':
      return context[node.name]

    case 'MemberExpression': {
      const obj = evaluate(node.object, context)
      // Null-safe property access
      if (obj == null) return undefined
      return obj[node.property]
    }

    case 'UnaryExpression': {
      const arg = evaluate(node.argument, context)
      switch (node.operator) {
        case '!':
          return !arg
        case '-':
          return -arg
        default:
          return undefined
      }
    }

    case 'BinaryExpression': {
      const left = evaluate(node.left, context)
      const right = evaluate(node.right, context)
      switch (node.operator) {
        case '+':
          return left + right
        case '-':
          return left - right
        case '*':
          return left * right
        case '/':
          return left / right
        case '%':
          return left % right
        case '===':
          return left === right
        case '!==':
          return left !== right
        case '==':
          return left == right
        case '!=':
          return left != right
        case '<':
          return left < right
        case '<=':
          return left <= right
        case '>':
          return left > right
        case '>=':
          return left >= right
        default:
          return undefined
      }
    }

    case 'LogicalExpression': {
      const left = evaluate(node.left, context)
      switch (node.operator) {
        case '&&':
          return left && evaluate(node.right, context)
        case '||':
          return left || evaluate(node.right, context)
        default:
          return undefined
      }
    }

    case 'ConditionalExpression':
      return evaluate(node.test, context)
        ? evaluate(node.consequent, context)
        : evaluate(node.alternate, context)

    default:
      return undefined
  }
}

// ============ PUBLIC API ============

/**
 * Error thrown when an expression is malformed.
 */
export class ExpressionError extends Error {
  pos: number
  constructor(message: string, pos: number) {
    super(message)
    this.name = 'ExpressionError'
    this.pos = pos
  }
}

/**
 * A compiled expression function. Call with a context to evaluate.
 * Also exposes the `.ast` property for introspection.
 */
export interface CompiledExpression {
  (context: ExpressionContext): any
  ast: ASTNode
}

/**
 * Compile an expression string to a reusable evaluator function.
 * Throws ExpressionError if the expression is invalid.
 *
 * @example
 * ```ts
 * const fn = compile('price * quantity')
 * fn({ price: 10, quantity: 3 }) // 30
 * ```
 */
export function compile(expression: string): CompiledExpression {
  const tokens = tokenize(expression)
  const parser = new Parser(tokens)
  const ast = parser.parse()

  const fn = (context: ExpressionContext) => evaluate(ast, context)
  ;(fn as CompiledExpression).ast = ast
  return fn as CompiledExpression
}

/**
 * Evaluate an expression string with the given context.
 * Returns undefined if the expression is invalid (does not throw).
 *
 * @example
 * ```ts
 * evaluateExpression('a > 10 && b', { a: 15, b: true }) // true
 * ```
 */
export function evaluateExpression(expression: string, context: ExpressionContext): any {
  try {
    return compile(expression)(context)
  } catch {
    return undefined
  }
}

/**
 * Resolve a template value — if it's a {{ }} expression, evaluate it;
 * otherwise return as-is.
 *
 * @example
 * ```ts
 * resolveTemplate('{{ price * 2 }}', { price: 50 }) // 100
 * resolveTemplate('hello', {}) // 'hello'
 * ```
 */
export function resolveTemplate(value: unknown, context: ExpressionContext): unknown {
  if (!isExpression(value)) return value

  const expression = extractExpression(value)
  try {
    return compile(expression)(context)
  } catch {
    return undefined
  }
}
