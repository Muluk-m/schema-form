# AI 集成

`@v3sf/ai` 提供了一套开箱即用的 AI 工具，帮助你用大语言模型（LLM）自动生成和修复 v3sf 表单 Schema。

## 安装

```bash
npm install @v3sf/ai
```

## 核心功能

`@v3sf/ai` 导出以下内容：

| 导出                                      | 说明                                                  |
| ----------------------------------------- | ----------------------------------------------------- |
| `systemPrompt`                            | 系统提示词，描述 v3sf Schema 的完整规范               |
| `generateSchemaPrompt(description)`       | 根据用户描述生成「生成 Schema」的提示词               |
| `modifySchemaPrompt(schema, instruction)` | 根据现有 Schema 和修改指令生成「修改 Schema」的提示词 |
| `metaSchemaForFunctionCalling`            | OpenAI function calling 格式的 meta schema            |
| `validateAndRepair(schema)`               | 校验并自动修复 AI 生成的 Schema                       |
| `examples`                                | 10 个内置示例 Schema，可用于 few-shot prompting       |

## System Prompt

`systemPrompt` 是一段完整的系统提示词，包含：

- v3sf Schema 格式说明
- 所有字段值类型和可用组件
- 字段属性一览表
- 校验规则说明
- 表达式语法和可用变量
- 3 个完整示例

直接作为 LLM 的 system message 使用：

```ts
import { systemPrompt, generateSchemaPrompt } from '@v3sf/ai'

const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: generateSchemaPrompt('创建一个请假申请表单') },
]

// 发送给任意 LLM API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${YOUR_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages,
  }),
})
```

## Function Calling

`metaSchemaForFunctionCalling` 提供了 OpenAI function calling 格式的 JSON Schema 约束，确保 AI 输出结构化且合法的 Schema。

```ts
import { systemPrompt, metaSchemaForFunctionCalling } from '@v3sf/ai'

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${YOUR_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '创建一个用户注册表单，包含用户名、邮箱和密码' },
    ],
    tools: [
      {
        type: 'function',
        function: metaSchemaForFunctionCalling,
      },
    ],
    tool_choice: {
      type: 'function',
      function: { name: 'generate_form_schema' },
    },
  }),
})
```

## 自动校验与修复

AI 生成的 Schema 可能存在格式问题。`validateAndRepair` 会自动检测并修复常见错误。

```ts
import { validateAndRepair } from '@v3sf/ai'

// AI 返回的原始 Schema（可能有问题）
const rawSchema = JSON.parse(aiOutput)

const result = validateAndRepair(rawSchema)

console.log(result.schema) // 修复后的 Schema
console.log(result.repairs) // 自动修复记录，如 ['根节点缺少 type，已补充为 "object"']
console.log(result.errors) // 无法自动修复的错误
console.log(result.repaired) // 是否进行了修复
```

**自动修复能力：**

- 根节点缺少 `type: "object"` — 自动补充
- 根节点缺少 `properties` — 从顶层字段中提取
- 字段缺少 `type` — 根据 `widget` 或 `enum` 推断
- 无效的 `displayType` — 自动移除
- 嵌套 `object` 字段 — 递归校验

**错误检测（不自动修复，仅报告）：**

- 未知的 `type` 值
- 未知的 `widget` 名称
- 带选项组件缺少 `enum`
- `enum` 和 `enumNames` 长度不一致

## BYOK（Bring Your Own Key）

`@v3sf/ai` **不包含任何 LLM SDK 依赖**，只提供提示词和校验工具。你可以配合任意 LLM 服务使用：

- OpenAI / Azure OpenAI
- Anthropic Claude
- Google Gemini
- 开源模型（Qwen、DeepSeek 等）
- 任何兼容 OpenAI 格式的 API

```ts
// 以 Anthropic Claude 为例
import Anthropic from '@anthropic-ai/sdk'
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

const client = new Anthropic()

const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: 'user', content: generateSchemaPrompt('创建一个员工入职表单') }],
})

const rawSchema = JSON.parse(message.content[0].text)
const { schema } = validateAndRepair(rawSchema)
// schema 可直接传给 SchemaForm
```

## 内置示例

`examples` 包含 10 个常见表单场景，可用于 few-shot prompting 提高生成质量。

```ts
import { examples } from '@v3sf/ai'

examples.forEach((example) => {
  console.log(example.name) // '登录表单'
  console.log(example.description) // '包含用户名和密码的基础登录表单'
  console.log(example.schema) // 完整的 v3sf schema 对象
})
```

内置示例包括：登录表单、用户注册、请假申请、联系我们、问卷调查、商品订购、员工入职、意见反馈、系统设置、地址表单。
