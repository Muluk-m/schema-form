/**
 * v3sf 示例 schema 集合
 *
 * 提供多种常见表单场景的示例，可用于 few-shot prompting 或作为参考。
 */

export interface SchemaExample {
  /** 示例名称 */
  name: string
  /** 示例描述 */
  description: string
  /** 合法的 v3sf schema */
  schema: Record<string, any>
}

export const examples: SchemaExample[] = [
  // 1. 登录表单
  {
    name: '登录表单',
    description: '包含用户名和密码的基础登录表单',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          title: '用户名',
          required: true,
          placeholder: '请输入用户名',
          rules: { required: true, message: '请输入用户名' },
        },
        password: {
          type: 'string',
          title: '密码',
          required: true,
          placeholder: '请输入密码',
          props: { type: 'password' },
          rules: [
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少 6 个字符' },
          ],
        },
      },
    },
  },

  // 2. 用户注册表单
  {
    name: '用户注册',
    description: '包含姓名、邮箱、手机号、密码及确认密码的注册表单',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: '姓名',
          required: true,
          placeholder: '请输入真实姓名',
        },
        email: {
          type: 'string',
          title: '邮箱',
          required: true,
          placeholder: '请输入邮箱地址',
          rules: [
            { required: true, message: '请输入邮箱' },
            { pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', message: '邮箱格式不正确' },
          ],
        },
        phone: {
          type: 'string',
          title: '手机号',
          required: true,
          placeholder: '请输入手机号',
          rules: [
            { required: true, message: '请输入手机号' },
            { pattern: '^1[3-9]\\d{9}$', message: '手机号格式不正确' },
          ],
        },
        password: {
          type: 'string',
          title: '密码',
          required: true,
          placeholder: '请设置密码（至少8位）',
          props: { type: 'password' },
          rules: [
            { required: true, message: '请设置密码' },
            { min: 8, message: '密码至少 8 个字符' },
          ],
        },
        confirmPassword: {
          type: 'string',
          title: '确认密码',
          required: true,
          placeholder: '请再次输入密码',
          props: { type: 'password' },
          rules: { required: true, message: '请再次输入密码' },
        },
      },
    },
  },

  // 3. 请假申请
  {
    name: '请假申请',
    description: '包含请假类型、日期范围、审批人和请假原因的申请表单',
    schema: {
      type: 'object',
      properties: {
        leaveType: {
          type: 'string',
          title: '请假类型',
          widget: 'select',
          required: true,
          placeholder: '请选择请假类型',
          enum: ['annual', 'sick', 'personal', 'maternity', 'other'],
          enumNames: ['年假', '病假', '事假', '产假', '其他'],
        },
        startDate: {
          type: 'date',
          title: '开始日期',
          widget: 'date',
          required: true,
          placeholder: '请选择开始日期',
        },
        endDate: {
          type: 'date',
          title: '结束日期',
          widget: 'date',
          required: true,
          placeholder: '请选择结束日期',
        },
        approver: {
          type: 'string',
          title: '审批人',
          widget: 'select',
          required: true,
          placeholder: '请选择审批人',
          enum: ['manager', 'director', 'hr'],
          enumNames: ['直属经理', '部门总监', '人事部'],
        },
        reason: {
          type: 'string',
          title: '请假原因',
          widget: 'textarea',
          required: true,
          placeholder: '请详细说明请假原因',
          rules: [
            { required: true, message: '请填写请假原因' },
            { min: 10, message: '请假原因至少 10 个字符' },
          ],
        },
      },
    },
  },

  // 4. 联系我们
  {
    name: '联系我们',
    description: '包含姓名、邮箱、主题和留言内容的联系表单',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: '姓名',
          required: true,
          placeholder: '请输入您的姓名',
        },
        email: {
          type: 'string',
          title: '邮箱',
          required: true,
          placeholder: '请输入您的邮箱',
          rules: [
            { required: true, message: '请输入邮箱' },
            { pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', message: '邮箱格式不正确' },
          ],
        },
        subject: {
          type: 'string',
          title: '主题',
          widget: 'select',
          required: true,
          placeholder: '请选择咨询主题',
          enum: ['general', 'technical', 'billing', 'partnership'],
          enumNames: ['一般咨询', '技术支持', '账单问题', '商务合作'],
        },
        message: {
          type: 'string',
          title: '留言内容',
          widget: 'textarea',
          required: true,
          placeholder: '请输入您的留言',
          rules: { required: true, message: '请输入留言内容' },
        },
      },
    },
  },

  // 5. 问卷调查
  {
    name: '问卷调查',
    description: '包含单选、多选、评分和开放式问题的问卷表单',
    schema: {
      type: 'object',
      properties: {
        satisfaction: {
          type: 'string',
          title: '您对我们的服务满意吗？',
          widget: 'radio',
          required: true,
          enum: ['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'],
          enumNames: ['非常满意', '满意', '一般', '不满意', '非常不满意'],
        },
        features: {
          type: 'array',
          title: '您最常用哪些功能？（可多选）',
          widget: 'checkbox',
          enum: ['search', 'analytics', 'reports', 'notifications', 'settings'],
          enumNames: ['搜索', '数据分析', '报表', '消息通知', '系统设置'],
        },
        usageFrequency: {
          type: 'string',
          title: '您使用产品的频率？',
          widget: 'radio',
          required: true,
          enum: ['daily', 'weekly', 'monthly', 'rarely'],
          enumNames: ['每天', '每周', '每月', '很少'],
        },
        recommend: {
          type: 'boolean',
          title: '您是否会向朋友推荐我们的产品？',
          widget: 'switch',
        },
        suggestions: {
          type: 'string',
          title: '您有什么建议或意见？',
          widget: 'textarea',
          placeholder: '请畅所欲言，帮助我们改进',
        },
      },
    },
  },

  // 6. 商品订购
  {
    name: '商品订购',
    description: '包含商品选择、数量、收货地址的订购表单',
    schema: {
      type: 'object',
      properties: {
        product: {
          type: 'string',
          title: '商品',
          widget: 'select',
          required: true,
          placeholder: '请选择商品',
          enum: ['product_a', 'product_b', 'product_c', 'product_d'],
          enumNames: ['标准版套餐', '专业版套餐', '企业版套餐', '定制版套餐'],
        },
        quantity: {
          type: 'number',
          title: '数量',
          widget: 'stepper',
          required: true,
          props: { min: 1, max: 99 },
        },
        recipientName: {
          type: 'string',
          title: '收货人',
          required: true,
          placeholder: '请输入收货人姓名',
        },
        phone: {
          type: 'string',
          title: '联系电话',
          required: true,
          placeholder: '请输入联系电话',
          rules: { pattern: '^1[3-9]\\d{9}$', message: '手机号格式不正确' },
        },
        address: {
          type: 'string',
          title: '详细地址',
          widget: 'textarea',
          required: true,
          placeholder: '请输入详细收货地址',
        },
        remark: {
          type: 'string',
          title: '备注',
          widget: 'textarea',
          placeholder: '如有特殊要求请在此备注',
        },
      },
    },
  },

  // 7. 员工入职
  {
    name: '员工入职',
    description: '包含个人信息、部门、入职日期和紧急联系人的入职表单',
    schema: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
          title: '姓名',
          required: true,
          placeholder: '请输入姓名',
        },
        gender: {
          type: 'string',
          title: '性别',
          widget: 'radio',
          required: true,
          enum: ['male', 'female'],
          enumNames: ['男', '女'],
        },
        idNumber: {
          type: 'string',
          title: '身份证号',
          required: true,
          placeholder: '请输入身份证号',
          rules: { pattern: '^\\d{17}[\\dXx]$', message: '身份证号格式不正确' },
        },
        department: {
          type: 'string',
          title: '入职部门',
          widget: 'select',
          required: true,
          placeholder: '请选择入职部门',
          enum: ['engineering', 'product', 'design', 'marketing', 'hr', 'finance'],
          enumNames: ['工程部', '产品部', '设计部', '市场部', '人事部', '财务部'],
        },
        position: {
          type: 'string',
          title: '职位',
          required: true,
          placeholder: '请输入职位名称',
        },
        startDate: {
          type: 'date',
          title: '入职日期',
          widget: 'date',
          required: true,
          placeholder: '请选择入职日期',
        },
        emergencyContact: {
          type: 'object',
          title: '紧急联系人',
          properties: {
            name: {
              type: 'string',
              title: '联系人姓名',
              required: true,
              placeholder: '请输入紧急联系人姓名',
            },
            relation: {
              type: 'string',
              title: '与本人关系',
              widget: 'select',
              required: true,
              enum: ['parent', 'spouse', 'sibling', 'friend', 'other'],
              enumNames: ['父母', '配偶', '兄弟姐妹', '朋友', '其他'],
            },
            phone: {
              type: 'string',
              title: '联系电话',
              required: true,
              placeholder: '请输入联系电话',
            },
          },
        },
      },
    },
  },

  // 8. 意见反馈
  {
    name: '意见反馈',
    description: '包含评分步进器、反馈类别单选和详情描述的反馈表单',
    schema: {
      type: 'object',
      properties: {
        rating: {
          type: 'number',
          title: '满意度评分',
          widget: 'stepper',
          required: true,
          props: { min: 1, max: 5 },
        },
        category: {
          type: 'string',
          title: '反馈类别',
          widget: 'radio',
          required: true,
          enum: ['bug', 'feature', 'performance', 'ui', 'other'],
          enumNames: ['功能缺陷', '功能建议', '性能问题', '界面体验', '其他'],
        },
        title: {
          type: 'string',
          title: '反馈标题',
          required: true,
          placeholder: '请用一句话概括您的反馈',
          rules: { max: 50, message: '标题不超过 50 个字符' },
        },
        description: {
          type: 'string',
          title: '详细描述',
          widget: 'textarea',
          required: true,
          placeholder: '请详细描述您遇到的问题或建议',
          rules: [
            { required: true, message: '请填写详细描述' },
            { min: 20, message: '描述至少 20 个字符' },
          ],
        },
        contactMe: {
          type: 'boolean',
          title: '是否希望我们联系您',
          widget: 'switch',
        },
        contactEmail: {
          type: 'string',
          title: '联系邮箱',
          hidden: '{{ !$values.contactMe }}',
          required: '{{ $values.contactMe }}',
          placeholder: '请输入您的邮箱',
          rules: { pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', message: '邮箱格式不正确' },
        },
      },
    },
  },

  // 9. 系统设置
  {
    name: '系统设置',
    description: '包含通知开关、主题单选和语言选择的设置表单',
    schema: {
      type: 'object',
      properties: {
        enableNotifications: {
          type: 'boolean',
          title: '启用通知',
          widget: 'switch',
        },
        notificationTypes: {
          type: 'array',
          title: '通知类型',
          widget: 'checkbox',
          hidden: '{{ !$values.enableNotifications }}',
          enum: ['email', 'sms', 'push', 'wechat'],
          enumNames: ['邮件通知', '短信通知', '推送通知', '微信通知'],
        },
        theme: {
          type: 'string',
          title: '界面主题',
          widget: 'radioButton',
          enum: ['light', 'dark', 'auto'],
          enumNames: ['浅色', '深色', '跟随系统'],
        },
        language: {
          type: 'string',
          title: '语言',
          widget: 'select',
          placeholder: '请选择语言',
          enum: ['zh_CN', 'zh_TW', 'en_US', 'ja_JP'],
          enumNames: ['简体中文', '繁體中文', 'English', '日本語'],
        },
        fontSize: {
          type: 'string',
          title: '字体大小',
          widget: 'radio',
          enum: ['small', 'medium', 'large'],
          enumNames: ['小', '中', '大'],
        },
      },
    },
  },

  // 10. 地址表单
  {
    name: '地址表单',
    description: '包含国家、省市级联选择、详细地址和邮编的地址表单',
    schema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          title: '国家/地区',
          widget: 'select',
          required: true,
          placeholder: '请选择国家/地区',
          enum: ['CN', 'HK', 'TW', 'US', 'JP', 'KR', 'SG'],
          enumNames: ['中国大陆', '中国香港', '中国台湾', '美国', '日本', '韩国', '新加坡'],
        },
        region: {
          type: 'array',
          title: '省/市/区',
          widget: 'cascader',
          required: true,
          placeholder: '请选择省市区',
          props: {
            options: [],
          },
        },
        street: {
          type: 'string',
          title: '街道地址',
          widget: 'textarea',
          required: true,
          placeholder: '请输入街道、门牌号等详细地址',
        },
        zipCode: {
          type: 'string',
          title: '邮政编码',
          placeholder: '请输入邮政编码',
          rules: { pattern: '^\\d{4,6}$', message: '邮政编码格式不正确' },
        },
        isDefault: {
          type: 'boolean',
          title: '设为默认地址',
          widget: 'switch',
        },
      },
    },
  },
]
