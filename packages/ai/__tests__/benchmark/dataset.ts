/**
 * Benchmark dataset for AI schema generation quality evaluation.
 *
 * Each entry: natural language description → expected schema properties.
 * "Correct" means: structure valid + field types match + required validations present.
 *
 * Run manually: `pnpm vitest run packages/ai/__tests__/benchmark/evaluate.spec.ts`
 * (Not included in CI — requires LLM API key)
 */

export interface BenchmarkCase {
  /** Unique case ID */
  id: string
  /** Natural language description (input to generator) */
  description: string
  /** Expected field names in the generated schema */
  expectedFields: string[]
  /** Expected field types (fieldName → type) */
  expectedTypes: Record<string, string>
  /** Fields that must be required */
  requiredFields: string[]
  /** Fields that must have specific widgets */
  expectedWidgets?: Record<string, string>
  /** Fields that must have validation patterns */
  expectedPatterns?: string[]
  /** Whether expressions ({{ }}) are expected */
  expectsExpressions?: boolean
  /** Category for reporting */
  category: 'basic' | 'validation' | 'enum' | 'expression' | 'nested' | 'complex'
  /** Source: 'synthetic' or 'community' */
  source: 'synthetic' | 'community'
}

export const benchmarkDataset: BenchmarkCase[] = [
  // ========== BASIC (simple text/number forms) ==========
  {
    id: 'basic-001',
    description: '一个简单的姓名输入表单',
    expectedFields: ['name'],
    expectedTypes: { name: 'string' },
    requiredFields: ['name'],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-002',
    description: '用户名和密码的登录表单',
    expectedFields: ['username', 'password'],
    expectedTypes: { username: 'string', password: 'string' },
    requiredFields: ['username', 'password'],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-003',
    description: '个人信息表单：姓名、年龄、邮箱',
    expectedFields: ['name', 'age', 'email'],
    expectedTypes: { name: 'string', age: 'number', email: 'string' },
    requiredFields: ['name'],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-004',
    description: '留言板：标题和内容',
    expectedFields: ['title', 'content'],
    expectedTypes: { title: 'string', content: 'string' },
    requiredFields: ['title', 'content'],
    expectedWidgets: { content: 'textarea' },
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-005',
    description: '产品价格设置：名称、价格、库存数量',
    expectedFields: ['name', 'price', 'stock'],
    expectedTypes: { price: 'number', stock: 'number' },
    requiredFields: ['name', 'price'],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-006',
    description: '签到表单：姓名、日期、备注',
    expectedFields: ['name', 'date'],
    expectedTypes: { name: 'string', date: 'date' },
    requiredFields: ['name', 'date'],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-007',
    description: '修改密码：旧密码、新密码、确认新密码',
    expectedFields: ['oldPassword', 'newPassword', 'confirmPassword'],
    expectedTypes: { oldPassword: 'string', newPassword: 'string', confirmPassword: 'string' },
    requiredFields: ['oldPassword', 'newPassword', 'confirmPassword'],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-008',
    description: '搜索框：关键词',
    expectedFields: ['keyword'],
    expectedTypes: { keyword: 'string' },
    requiredFields: [],
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-009',
    description: '文章发布：标题、摘要、正文',
    expectedFields: ['title', 'summary', 'content'],
    expectedTypes: { title: 'string', summary: 'string', content: 'string' },
    requiredFields: ['title', 'content'],
    expectedWidgets: { content: 'textarea' },
    category: 'basic',
    source: 'synthetic',
  },
  {
    id: 'basic-010',
    description: '预约挂号：患者姓名、身份证号、预约日期、联系电话',
    expectedFields: ['name', 'idNumber', 'date', 'phone'],
    expectedTypes: { name: 'string', date: 'date', phone: 'string' },
    requiredFields: ['name', 'idNumber', 'date', 'phone'],
    category: 'basic',
    source: 'synthetic',
  },

  // ========== VALIDATION (fields with patterns/rules) ==========
  {
    id: 'val-001',
    description: '注册表单：手机号（需要验证格式）、密码（至少8位）',
    expectedFields: ['phone', 'password'],
    expectedTypes: { phone: 'string', password: 'string' },
    requiredFields: ['phone', 'password'],
    expectedPatterns: ['phone'],
    category: 'validation',
    source: 'synthetic',
  },
  {
    id: 'val-002',
    description: '邮箱验证表单：邮箱地址（需要格式校验）',
    expectedFields: ['email'],
    expectedTypes: { email: 'string' },
    requiredFields: ['email'],
    expectedPatterns: ['email'],
    category: 'validation',
    source: 'synthetic',
  },
  {
    id: 'val-003',
    description: '身份证采集：姓名、身份证号（18位格式校验）',
    expectedFields: ['name', 'idNumber'],
    expectedTypes: { name: 'string', idNumber: 'string' },
    requiredFields: ['name', 'idNumber'],
    expectedPatterns: ['idNumber'],
    category: 'validation',
    source: 'synthetic',
  },
  {
    id: 'val-004',
    description: '评论表单：内容（10-500字）、昵称（2-20字）',
    expectedFields: ['content', 'nickname'],
    expectedTypes: { content: 'string', nickname: 'string' },
    requiredFields: ['content'],
    category: 'validation',
    source: 'synthetic',
  },
  {
    id: 'val-005',
    description: '数量输入：购买数量（1-99之间的整数）',
    expectedFields: ['quantity'],
    expectedTypes: { quantity: 'number' },
    requiredFields: ['quantity'],
    category: 'validation',
    source: 'synthetic',
  },

  // ========== ENUM (select/radio/checkbox fields) ==========
  {
    id: 'enum-001',
    description: '性别选择：男/女/其他（单选按钮）',
    expectedFields: ['gender'],
    expectedTypes: { gender: 'string' },
    requiredFields: ['gender'],
    expectedWidgets: { gender: 'radio' },
    category: 'enum',
    source: 'synthetic',
  },
  {
    id: 'enum-002',
    description: '兴趣爱好多选：阅读、运动、音乐、旅行、编程',
    expectedFields: ['hobbies'],
    expectedTypes: { hobbies: 'array' },
    requiredFields: [],
    expectedWidgets: { hobbies: 'checkbox' },
    category: 'enum',
    source: 'synthetic',
  },
  {
    id: 'enum-003',
    description: '部门选择下拉框：工程、产品、设计、市场',
    expectedFields: ['department'],
    expectedTypes: { department: 'string' },
    requiredFields: ['department'],
    expectedWidgets: { department: 'select' },
    category: 'enum',
    source: 'synthetic',
  },
  {
    id: 'enum-004',
    description: '评分：1到5星（单选按钮）',
    expectedFields: ['rating'],
    expectedTypes: { rating: 'string' },
    requiredFields: ['rating'],
    expectedWidgets: { rating: 'radio' },
    category: 'enum',
    source: 'synthetic',
  },
  {
    id: 'enum-005',
    description: '优先级选择：高/中/低（按钮风格单选）',
    expectedFields: ['priority'],
    expectedTypes: { priority: 'string' },
    requiredFields: ['priority'],
    expectedWidgets: { priority: 'radioButton' },
    category: 'enum',
    source: 'synthetic',
  },

  // ========== EXPRESSION (dynamic show/hide/require) ==========
  {
    id: 'expr-001',
    description: '有一个"是否有优惠码"的开关，打开后显示优惠码输入框',
    expectedFields: ['hasDiscount', 'discountCode'],
    expectedTypes: { hasDiscount: 'boolean', discountCode: 'string' },
    requiredFields: [],
    expectedWidgets: { hasDiscount: 'switch' },
    expectsExpressions: true,
    category: 'expression',
    source: 'synthetic',
  },
  {
    id: 'expr-002',
    description: '请假类型选择，选"其他"时显示原因输入框',
    expectedFields: ['leaveType', 'otherReason'],
    expectedTypes: { leaveType: 'string' },
    requiredFields: ['leaveType'],
    expectsExpressions: true,
    category: 'expression',
    source: 'synthetic',
  },
  {
    id: 'expr-003',
    description: '配送方式选择（自提/快递），选快递时显示地址填写',
    expectedFields: ['deliveryMethod', 'address'],
    expectedTypes: { deliveryMethod: 'string', address: 'string' },
    requiredFields: ['deliveryMethod'],
    expectsExpressions: true,
    category: 'expression',
    source: 'synthetic',
  },
  {
    id: 'expr-004',
    description: '是否需要发票（开关），打开后显示发票类型和抬头',
    expectedFields: ['needInvoice', 'invoiceType', 'invoiceTitle'],
    expectedTypes: { needInvoice: 'boolean' },
    expectsExpressions: true,
    category: 'expression',
    source: 'synthetic',
  },
  {
    id: 'expr-005',
    description: '用户类型选择（个人/企业），企业时显示公司名称和税号',
    expectedFields: ['userType', 'companyName', 'taxId'],
    expectedTypes: { userType: 'string' },
    expectsExpressions: true,
    category: 'expression',
    source: 'synthetic',
  },

  // ========== NESTED (object with sub-fields) ==========
  {
    id: 'nest-001',
    description: '个人信息含嵌套地址：姓名、地址（省、市、详细地址）',
    expectedFields: ['name', 'address'],
    expectedTypes: { name: 'string', address: 'object' },
    requiredFields: ['name'],
    category: 'nested',
    source: 'synthetic',
  },
  {
    id: 'nest-002',
    description: '订单表单含嵌套收货人信息：收货人（姓名、电话）、备注',
    expectedFields: ['recipient', 'remark'],
    expectedTypes: { recipient: 'object', remark: 'string' },
    requiredFields: [],
    category: 'nested',
    source: 'synthetic',
  },

  // ========== COMPLEX (real-world multi-feature forms) ==========
  {
    id: 'complex-001',
    description:
      '完整的用户注册：姓名、邮箱（验证）、手机号（验证）、密码（8位以上）、确认密码、性别单选、同意协议开关',
    expectedFields: ['name', 'email', 'phone', 'password', 'confirmPassword', 'gender', 'agree'],
    expectedTypes: {
      name: 'string',
      email: 'string',
      phone: 'string',
      gender: 'string',
      agree: 'boolean',
    },
    requiredFields: ['name', 'email', 'phone', 'password', 'confirmPassword'],
    expectedPatterns: ['email', 'phone'],
    category: 'complex',
    source: 'synthetic',
  },
  {
    id: 'complex-002',
    description:
      '请假申请：请假类型下拉（年假/病假/事假/其他），选其他时显示原因，开始日期，结束日期，审批人下拉',
    expectedFields: ['leaveType', 'startDate', 'endDate', 'approver'],
    expectedTypes: { leaveType: 'string', startDate: 'date', endDate: 'date', approver: 'string' },
    requiredFields: ['leaveType', 'startDate', 'endDate', 'approver'],
    expectedWidgets: { leaveType: 'select', approver: 'select' },
    expectsExpressions: true,
    category: 'complex',
    source: 'synthetic',
  },
  {
    id: 'complex-003',
    description:
      '商品订购表单：商品下拉选择、数量步进器（1-99）、收货人姓名、手机号（验证）、详细地址文本域、备注',
    expectedFields: ['product', 'quantity', 'recipientName', 'phone', 'address'],
    expectedTypes: { product: 'string', quantity: 'number', phone: 'string', address: 'string' },
    requiredFields: ['product', 'quantity', 'recipientName', 'phone', 'address'],
    expectedWidgets: { product: 'select', quantity: 'stepper', address: 'textarea' },
    expectedPatterns: ['phone'],
    category: 'complex',
    source: 'synthetic',
  },
  {
    id: 'complex-004',
    description:
      '系统设置：通知开关，打开后显示通知类型多选（邮件/短信/推送），主题按钮单选（浅色/深色/自动），语言下拉选择',
    expectedFields: ['enableNotifications', 'notificationTypes', 'theme', 'language'],
    expectedTypes: {
      enableNotifications: 'boolean',
      notificationTypes: 'array',
      theme: 'string',
      language: 'string',
    },
    requiredFields: [],
    expectedWidgets: {
      enableNotifications: 'switch',
      notificationTypes: 'checkbox',
      theme: 'radioButton',
      language: 'select',
    },
    expectsExpressions: true,
    category: 'complex',
    source: 'synthetic',
  },
  {
    id: 'complex-005',
    description:
      '员工入职表单：姓名、性别单选、身份证号（验证）、部门下拉、职位、入职日期，嵌套紧急联系人（姓名、关系下拉、电话）',
    expectedFields: [
      'fullName',
      'gender',
      'idNumber',
      'department',
      'position',
      'startDate',
      'emergencyContact',
    ],
    expectedTypes: {
      gender: 'string',
      idNumber: 'string',
      department: 'string',
      startDate: 'date',
      emergencyContact: 'object',
    },
    requiredFields: ['fullName', 'gender', 'idNumber', 'department', 'startDate'],
    expectedWidgets: { gender: 'radio', department: 'select' },
    expectedPatterns: ['idNumber'],
    category: 'complex',
    source: 'synthetic',
  },

  // ========== COMMUNITY-SOURCED (simulating real user inputs) ==========
  {
    id: 'community-001',
    description: '做一个报名表，要填姓名电话和选择参加哪个活动',
    expectedFields: ['name', 'phone', 'activity'],
    expectedTypes: { name: 'string', phone: 'string', activity: 'string' },
    requiredFields: ['name', 'phone', 'activity'],
    category: 'basic',
    source: 'community',
  },
  {
    id: 'community-002',
    description: '帮我弄个调查问卷，问用户用什么浏览器，平时上网多久，满不满意我们网站',
    expectedFields: ['browser', 'duration', 'satisfaction'],
    expectedTypes: { browser: 'string', satisfaction: 'string' },
    requiredFields: [],
    category: 'enum',
    source: 'community',
  },
  {
    id: 'community-003',
    description: '我要一个投诉表单，让用户选投诉类型然后写详细内容，还要留联系方式',
    expectedFields: ['complaintType', 'content', 'contact'],
    expectedTypes: { complaintType: 'string', content: 'string' },
    requiredFields: ['complaintType', 'content'],
    expectedWidgets: { content: 'textarea' },
    category: 'complex',
    source: 'community',
  },
  {
    id: 'community-004',
    description: '快递寄件表单，寄件人和收件人的姓名电话地址都要填',
    expectedFields: [
      'senderName',
      'senderPhone',
      'senderAddress',
      'receiverName',
      'receiverPhone',
      'receiverAddress',
    ],
    expectedTypes: {
      senderName: 'string',
      senderPhone: 'string',
      receiverName: 'string',
      receiverPhone: 'string',
    },
    requiredFields: [
      'senderName',
      'senderPhone',
      'senderAddress',
      'receiverName',
      'receiverPhone',
      'receiverAddress',
    ],
    category: 'complex',
    source: 'community',
  },
  {
    id: 'community-005',
    description: '会议室预约：选会议室、选日期、选时间段、填参会人数、写会议主题',
    expectedFields: ['room', 'date', 'timeSlot', 'attendees', 'topic'],
    expectedTypes: { room: 'string', date: 'date', attendees: 'number', topic: 'string' },
    requiredFields: ['room', 'date', 'timeSlot', 'topic'],
    category: 'complex',
    source: 'community',
  },
]

/**
 * Evaluate a generated schema against a benchmark case.
 * Returns a score object with pass/fail for each criterion.
 */
export function evaluateCase(
  benchmarkCase: BenchmarkCase,
  generatedSchema: any,
): {
  fieldPresence: boolean
  typeCorrectness: boolean
  requiredCorrectness: boolean
  widgetCorrectness: boolean
  patternPresence: boolean
  expressionPresence: boolean
  score: number
  total: number
  details: string[]
} {
  const details: string[] = []
  let score = 0
  let total = 0

  const props = generatedSchema?.properties ?? {}
  const fieldNames = Object.keys(props)

  // 1. Field presence
  total++
  const missingFields = benchmarkCase.expectedFields.filter(
    (f) =>
      !fieldNames.some(
        (fn) =>
          fn.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(fn.toLowerCase()),
      ),
  )
  const fieldPresence = missingFields.length === 0
  if (fieldPresence) score++
  else details.push(`Missing fields: ${missingFields.join(', ')}`)

  // 2. Type correctness
  total++
  let typeErrors = 0
  for (const [field, expectedType] of Object.entries(benchmarkCase.expectedTypes)) {
    const matchedField = fieldNames.find((fn) => fn.toLowerCase() === field.toLowerCase())
    if (matchedField && props[matchedField]?.type !== expectedType) {
      typeErrors++
      details.push(
        `Type mismatch: ${field} expected ${expectedType}, got ${props[matchedField]?.type}`,
      )
    }
  }
  const typeCorrectness = typeErrors === 0
  if (typeCorrectness) score++

  // 3. Required correctness
  total++
  let requiredErrors = 0
  for (const field of benchmarkCase.requiredFields) {
    const matchedField = fieldNames.find((fn) => fn.toLowerCase() === field.toLowerCase())
    if (matchedField && !props[matchedField]?.required) {
      requiredErrors++
    }
  }
  const requiredCorrectness = requiredErrors === 0
  if (requiredCorrectness) score++

  // 4. Widget correctness
  let widgetCorrectness = true
  if (benchmarkCase.expectedWidgets) {
    total++
    for (const [field, expectedWidget] of Object.entries(benchmarkCase.expectedWidgets)) {
      const matchedField = fieldNames.find((fn) => fn.toLowerCase() === field.toLowerCase())
      if (matchedField && props[matchedField]?.widget !== expectedWidget) {
        widgetCorrectness = false
        details.push(
          `Widget mismatch: ${field} expected ${expectedWidget}, got ${props[matchedField]?.widget}`,
        )
      }
    }
    if (widgetCorrectness) score++
  }

  // 5. Pattern presence
  let patternPresence = true
  if (benchmarkCase.expectedPatterns && benchmarkCase.expectedPatterns.length > 0) {
    total++
    for (const field of benchmarkCase.expectedPatterns) {
      const matchedField = fieldNames.find((fn) => fn.toLowerCase() === field.toLowerCase())
      if (matchedField) {
        const rules = props[matchedField]?.rules
        const hasPattern =
          rules?.pattern || (Array.isArray(rules) && rules.some((r: any) => r.pattern))
        if (!hasPattern) {
          patternPresence = false
          details.push(`Missing pattern validation for: ${field}`)
        }
      }
    }
    if (patternPresence) score++
  }

  // 6. Expression presence
  let expressionPresence = true
  if (benchmarkCase.expectsExpressions) {
    total++
    const schemaStr = JSON.stringify(generatedSchema)
    expressionPresence = schemaStr.includes('{{') && schemaStr.includes('}}')
    if (expressionPresence) score++
    else details.push('Expected {{ }} expressions but none found')
  }

  return {
    fieldPresence,
    typeCorrectness,
    requiredCorrectness,
    widgetCorrectness,
    patternPresence,
    expressionPresence,
    score,
    total,
    details,
  }
}
