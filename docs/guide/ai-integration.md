# AI 集成

`@v3sf/ai` 提供了一套开箱即用的 AI 工具，帮助你用大语言模型（LLM）自动生成和修复 v3sf 表单 Schema。

## 安装

```bash
pnpm add @v3sf/ai
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
```

## 提示词函数

### `generateSchemaPrompt(description)`

根据用户的自然语言描述生成一段完整的提示词，引导 LLM 输出合法的 v3sf Schema：

```ts
import { generateSchemaPrompt } from '@v3sf/ai'

const prompt = generateSchemaPrompt('创建一个包含姓名、手机号、地址的联系人表单')
// 生成的 prompt 包含详细的输出要求和格式约束
```

### `modifySchemaPrompt(schema, instruction)`

基于现有 Schema 生成修改提示词，适用于 AI 驱动的表单编辑场景：

```ts
import { modifySchemaPrompt } from '@v3sf/ai'

const prompt = modifySchemaPrompt(existingSchema, '增加一个邮箱字段，并把手机号改为必填')
```

## Function Calling

`metaSchemaForFunctionCalling` 提供了 OpenAI function calling（tool use）格式的 JSON Schema 约束，确保 AI 输出结构化且合法的 Schema。

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

使用 function calling 的优势：

- AI 输出被约束为合法的 JSON 结构
- 不需要手动从文本中提取 JSON
- 减少格式错误

## 自动校验与修复

AI 生成的 Schema 可能存在格式问题。`validateAndRepair` 会自动检测并修复常见错误。

```ts
import { validateAndRepair } from '@v3sf/ai'

const rawSchema = JSON.parse(aiOutput)
const result = validateAndRepair(rawSchema)

console.log(result.schema) // 修复后的 Schema
console.log(result.repairs) // 修复记录，如 ['根节点缺少 type，已补充为 "object"']
console.log(result.errors) // 无法自动修复的错误
console.log(result.repaired) // 是否进行了修复
```

### 自动修复能力

| 问题                        | 修复方式                     |
| --------------------------- | ---------------------------- |
| 根节点缺少 `type: "object"` | 自动补充                     |
| 根节点缺少 `properties`     | 从顶层字段中提取             |
| 字段缺少 `type`             | 根据 `widget` 或 `enum` 推断 |
| 无效的 `displayType`        | 自动移除                     |
| 嵌套 `object` 字段          | 递归校验并修复               |

### 错误检测（仅报告，不自动修复）

| 问题                             | 说明                             |
| -------------------------------- | -------------------------------- |
| 未知的 `type` 值                 | 不在已知类型列表中               |
| 未知的 `widget` 名称             | 不在已知组件列表中               |
| 选项组件缺少 `enum`              | radio/checkbox/select 等缺少选项 |
| `enum` 和 `enumNames` 长度不一致 | 选项值和标签数量不匹配           |

### ValidateResult 类型

```ts
interface ValidateResult {
  schema: any // 修复后的 Schema
  repairs: string[] // 自动修复记录
  errors: string[] // 无法修复的错误
  repaired: boolean // 是否进行了修复
}
```

## BYOK（Bring Your Own Key）

`@v3sf/ai` **不包含任何 LLM SDK 依赖**，只提供提示词和校验工具。你可以配合任意 LLM 服务使用：

- OpenAI / Azure OpenAI
- Anthropic Claude
- Google Gemini
- 开源模型（Qwen、DeepSeek 等）
- 任何兼容 OpenAI 格式的 API

## 完整集成示例

### OpenAI

```ts
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

async function generateForm(description: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: generateSchemaPrompt(description) },
      ],
    }),
  })

  const data = await response.json()
  const rawSchema = JSON.parse(data.choices[0].message.content)
  const { schema, errors } = validateAndRepair(rawSchema)

  if (errors.length > 0) {
    console.warn('Schema 存在问题:', errors)
  }

  return schema
}

// 使用
const schema = await generateForm('创建一个员工入职表单，包含姓名、部门、入职日期')
```

### Anthropic Claude

```ts
import Anthropic from '@anthropic-ai/sdk'
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

const client = new Anthropic()

async function generateForm(description: string) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: generateSchemaPrompt(description) }],
  })

  const rawSchema = JSON.parse(message.content[0].text)
  const { schema } = validateAndRepair(rawSchema)
  return schema
}
```

### 在 Vue 组件中使用

```vue
<script setup>
import { ref } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import { systemPrompt, generateSchemaPrompt, validateAndRepair } from '@v3sf/ai'

const SchemaForm = createSchemaForm(vantAdapter)

const formData = ref({})
const schema = ref({ type: 'object', properties: {} })
const loading = ref(false)
const userInput = ref('')

async function generate() {
  loading.value = true
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: generateSchemaPrompt(userInput.value) },
        ],
      }),
    })
    const data = await response.json()
    const raw = JSON.parse(data.content)
    const result = validateAndRepair(raw)
    schema.value = result.schema
    formData.value = {}
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <input v-model="userInput" placeholder="描述你需要的表单..." />
    <button :disabled="loading" @click="generate">
      {{ loading ? '生成中...' : 'AI 生成表单' }}
    </button>
    <SchemaForm v-model="formData" :schema="schema" />
  </div>
</template>
```

## 内置示例

`examples` 包含 10 个常见表单场景的 Schema，可用于 few-shot prompting 提高生成质量：

```ts
import { examples } from '@v3sf/ai'

examples.forEach((example) => {
  console.log(example.name) // '登录表单'
  console.log(example.description) // '包含用户名和密码的基础登录表单'
  console.log(example.schema) // 完整的 v3sf Schema 对象
})
```

内置示例包括：登录表单、用户注册、请假申请、联系我们、问卷调查、商品订购、员工入职、意见反馈、系统设置、地址表单。

你可以将部分示例作为 few-shot 样本放入提示词中，提高 AI 生成质量：

```ts
import { systemPrompt, examples } from '@v3sf/ai'

const fewShotPrompt = `${systemPrompt}

## 更多示例

${examples
  .slice(0, 3)
  .map((e) => `### ${e.name}\n\`\`\`json\n${JSON.stringify(e.schema, null, 2)}\n\`\`\``)
  .join('\n\n')}`
```
