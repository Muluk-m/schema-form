/**
 * v3sf CLI — Generate form schemas from natural language.
 *
 * Usage:
 *   npx @v3sf/cli generate "用户注册表单，包含手机号验证"
 *   npx @v3sf/cli generate "登录表单" --target element-plus
 *   npx @v3sf/cli generate "请假申请" --target formily --output schema.json
 *
 * Environment:
 *   V3SF_API_KEY   — LLM API key (required)
 *   V3SF_BASE_URL  — API base URL (default: https://api.openai.com/v1)
 *   V3SF_MODEL     — Model name (default: gpt-4o)
 */

import { createGenerator } from '@v3sf/ai'
import { compile } from '@v3sf/compiler'
import type { CompileTarget } from '@v3sf/compiler'
import { writeFileSync } from 'node:fs'

// ---- Color helpers (no dependencies) ----
const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
}

function printHelp() {
  console.log(`
${c.bold('v3sf')} — AI-Native Form Schema Toolkit

${c.bold('Usage:')}
  v3sf generate <description>     从自然语言生成表单 schema
  v3sf compile  <file> --target   编译 schema 为目标框架配置
  v3sf help                       显示帮助信息

${c.bold('generate 选项:')}
  --target, -t    编译目标 (element-plus | antd | formily | html)
  --output, -o    输出文件路径 (默认输出到 stdout)
  --raw           只输出 v3sf schema，不编译

${c.bold('环境变量:')}
  V3SF_API_KEY    LLM API Key ${c.red('(必需)')}
  V3SF_BASE_URL   API 地址 (默认: https://api.openai.com/v1)
  V3SF_MODEL      模型名称 (默认: gpt-4o)

${c.bold('示例:')}
  ${c.dim('# 生成 schema')}
  v3sf generate "用户注册表单，包含手机号验证"

  ${c.dim('# 生成并编译为 Element Plus 配置')}
  v3sf generate "请假申请表单" --target element-plus

  ${c.dim('# 输出到文件')}
  v3sf generate "商品订购" -o order-form.json
`)
}

function parseArgs(argv: string[]): {
  command: string
  description: string
  target?: CompileTarget
  output?: string
  raw?: boolean
} {
  const args = argv.slice(2)
  const command = args[0] ?? 'help'

  if (command === 'help' || command === '--help' || command === '-h') {
    return { command: 'help', description: '' }
  }

  // Collect description (all non-flag args after command)
  const descParts: string[] = []
  let target: CompileTarget | undefined
  let output: string | undefined
  let raw = false

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--target' || arg === '-t') {
      target = args[++i] as CompileTarget
    } else if (arg === '--output' || arg === '-o') {
      output = args[++i]
    } else if (arg === '--raw') {
      raw = true
    } else if (!arg.startsWith('-')) {
      descParts.push(arg)
    }
  }

  return { command, description: descParts.join(' '), target, output, raw }
}

async function runGenerate(
  description: string,
  target?: CompileTarget,
  output?: string,
  raw?: boolean,
) {
  const apiKey = process.env.V3SF_API_KEY
  if (!apiKey) {
    console.error(c.red('\n✗ 缺少 API Key'))
    console.error(`\n  请设置环境变量: ${c.cyan('export V3SF_API_KEY=sk-...')}`)
    console.error(`  支持 OpenAI / Claude / DeepSeek / 任何 OpenAI 兼容接口\n`)
    process.exit(1)
  }

  const baseUrl = process.env.V3SF_BASE_URL
  const model = process.env.V3SF_MODEL

  const generator = createGenerator({ apiKey, baseUrl, model })

  console.error(c.dim(`\n⏳ 正在生成... (${model ?? 'gpt-4o'})`))

  try {
    const result = await generator.generate(description)

    if (result.repairs.length > 0) {
      console.error(c.yellow(`\n⚠ 自动修复了 ${result.repairs.length} 个问题:`))
      for (const r of result.repairs) {
        console.error(c.dim(`  • ${r}`))
      }
    }

    if (result.errors.length > 0) {
      console.error(c.red(`\n✗ ${result.errors.length} 个无法修复的问题:`))
      for (const e of result.errors) {
        console.error(`  • ${e}`)
      }
      if (result.suggestions.length > 0) {
        console.error(c.yellow('\n💡 建议:'))
        for (const s of result.suggestions) {
          console.error(`  • ${s}`)
        }
      }
    }

    let outputJson: any

    if (raw || !target) {
      outputJson = result.schema
      if (!result.errors.length) {
        console.error(
          c.green(
            `\n✓ 已生成 v3sf schema (${Object.keys(result.schema.properties ?? {}).length} 个字段)`,
          ),
        )
      }
    } else {
      const compiled = compile(result.schema, target)
      outputJson = compiled.config

      if (compiled.warnings.length > 0) {
        console.error(c.yellow(`\n⚠ 编译警告 (${target}):`))
        for (const w of compiled.warnings) {
          console.error(c.dim(`  • [${w.field}] ${w.message}`))
        }
      }

      if (compiled.expressions.length > 0) {
        console.error(c.cyan(`\n🔗 表达式映射 (${compiled.expressions.length} 个):`))
        for (const e of compiled.expressions) {
          console.error(c.dim(`  • ${e.field}.${e.prop}: ${e.source} → ${e.compiled}`))
        }
      }

      console.error(c.green(`\n✓ 已编译为 ${target} 配置`))
    }

    const jsonStr = JSON.stringify(outputJson, null, 2)

    if (output) {
      writeFileSync(output, jsonStr + '\n', 'utf-8')
      console.error(c.green(`✓ 已写入 ${output}`))
    } else {
      console.log(jsonStr)
    }
  } catch (err: any) {
    console.error(c.red(`\n✗ 生成失败: ${err.message}`))
    if (err.status === 401) {
      console.error(c.dim('  API Key 无效或已过期'))
    } else if (err.status === 429) {
      console.error(c.dim('  请求过于频繁，请稍后重试'))
    }
    process.exit(1)
  }
}

async function runCompile(file: string, target: CompileTarget) {
  const { readFileSync } = await import('node:fs')

  try {
    const content = readFileSync(file, 'utf-8')
    const schema = JSON.parse(content)
    const result = compile(schema, target)
    console.log(JSON.stringify(result.config, null, 2))

    if (result.warnings.length > 0) {
      console.error(c.yellow(`\n⚠ ${result.warnings.length} 个警告`))
      for (const w of result.warnings) {
        console.error(c.dim(`  • [${w.field}] ${w.message}`))
      }
    }
  } catch (err: any) {
    console.error(c.red(`✗ ${err.message}`))
    process.exit(1)
  }
}

// ---- Main ----
const { command, description, target, output, raw } = parseArgs(process.argv)

switch (command) {
  case 'help':
    printHelp()
    break
  case 'generate':
  case 'gen':
  case 'g':
    if (!description) {
      console.error(c.red('✗ 请提供表单描述'))
      console.error(c.dim('  例如: v3sf generate "用户注册表单"'))
      process.exit(1)
    }
    runGenerate(description, target, output, raw)
    break
  case 'compile':
    if (!description) {
      console.error(c.red('✗ 请提供 schema 文件路径'))
      process.exit(1)
    }
    if (!target) {
      console.error(c.red('✗ 请指定编译目标 --target'))
      process.exit(1)
    }
    runCompile(description, target)
    break
  default:
    console.error(c.red(`✗ 未知命令: ${command}`))
    printHelp()
    process.exit(1)
}
