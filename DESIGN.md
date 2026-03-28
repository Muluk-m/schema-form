# Design System — v3sf

## Product Context

- **What this is:** AI-Native Form Schema Toolkit — AI 和表单之间的翻译层
- **Who it's for:** 前端开发者、使用 JSON Schema 表单方案的技术团队
- **Space/industry:** 开发者工具、表单基础设施、AI 代码生成
- **Project type:** SDK + Playground (web app)

## Aesthetic Direction

- **Direction:** Industrial/Utilitarian — 精密仪器感，不是营销页
- **Decoration level:** Minimal — 让排版和空白做工作，不需要装饰元素
- **Mood:** 冷静、专业、值得信赖。像一个打磨精良的瑞士钟表——每个零件都有用途，没有多余装饰。在一众深色主题的 AI 工具中，浅色通透的外观是刻意的差异化选择。
- **Reference sites:** v0.dev (极简交互), bolt.new (自信排版), formilyjs.org (领域参考)

## Typography

- **Display/Hero:** Instrument Serif (Regular & Italic) — 开发者工具中罕见的衬线体，增加编辑感和品质感。仅用于 hero 标题和稀有的强调场景。
- **Body:** DM Sans (400/500/600) — 清晰、现代、友好但不随意。优秀的可读性和光学尺寸支持。
- **UI/Labels:** DM Sans (同 body)
- **Data/Tables:** DM Sans (tabular-nums) — 数字对齐
- **Code:** JetBrains Mono (400/500) — 开发者社区标准选择，连字支持
- **Loading:** Google Fonts CDN
  ```
  https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap
  ```
- **Scale:**
  | Level | Size | Weight | Font | Line Height | Usage |
  |-------|------|--------|------|-------------|-------|
  | Display | 40px | 400 | Instrument Serif | 1.2 | Hero 标题 |
  | H1 | 24px | 600 | DM Sans | 1.3 | 页面标题 |
  | H2 | 18px | 600 | DM Sans | 1.4 | 区块标题 |
  | Body | 15px | 400 | DM Sans | 1.65 | 正文 |
  | UI | 13px | 400/500 | DM Sans | 1.5 | 标签、按钮、辅助文字 |
  | Caption | 11px | 500 | JetBrains Mono | 1.4 | 上标、分类标签 (uppercase, letter-spacing: 0.08em) |
  | Code | 13px | 400 | JetBrains Mono | 1.7 | 代码块、内联代码 |

## Color

- **Approach:** Restrained — 1 accent + neutrals，色彩稀有且有意义
- **Primary:** `#6366f1` (Indigo) — 主操作、聚焦态、品牌标识
- **Primary Hover:** `#5355d4`
- **Primary Subtle:** `#eeefff` — 轻量背景、badge、选中态
- **Primary Muted:** `#c7c8fc` — 边框强调
- **Primary Gradient:** `linear-gradient(135deg, #6366f1, #818cf8)` — 用户消息气泡、特殊强调
- **Neutrals:** Cool grays (v2 — 更通透)
  | Token | Hex | Usage |
  |-------|-----|-------|
  | surface-0 | `#ffffff` | 面板背景、卡片、输入框 |
  | surface-1 | `#f7f8fa` | 页面底色、预览区背景 |
  | surface-2 | `#f0f1f5` | 次级背景、AI 消息气泡、hover 态 |
  | surface-3 | `#e4e6ed` | 分割线强调、disabled 态 |
  | border | `rgba(0, 0, 0, 0.08)` | 默认边框（半透明，适配暗色模式） |
  | border-strong | `rgba(0, 0, 0, 0.12)` | 输入框、按钮边框 |
  | text-1 | `#1a1d26` | 主文字 |
  | text-2 | `#5b6070` | 次级文字 |
  | text-3 | `#969dae` | 占位符、禁用态文字 |
- **Semantic:**
  | Token | Hex | Subtle | Usage |
  |-------|-----|--------|-------|
  | success | `#22c55e` | `#f0fdf4` | 生成成功、校验通过 |
  | warning | `#f59e0b` | `#fffbeb` | 缺少验证规则、可选修复 |
  | danger | `#ef4444` | `#fef2f2` | API 失败、schema 错误 |
  | info | `#3b82f6` | `#eff6ff` | 编译器限制提示 |
- **Dark mode strategy:**
  - surface: 冷暗蓝底 (`#0f1117` → `#282a3a`)
  - accent: 提亮至 `#818cf8`，降低饱和度 10-15%
  - text: 反转亮度，保持层次 (`#e8eaf0` / `#9498aa` / `#5b6070`)
  - shadows: 增加不透明度至 20-40%

## Spacing

- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:**
  | Token | Value | Usage |
  |-------|-------|-------|
  | 2xs | 2px | 细微间隙 |
  | xs | 4px | 紧凑内边距 |
  | sm | 8px | 元素间最小间距 |
  | md | 16px | 标准间距 |
  | lg | 24px | 区块间距 |
  | xl | 32px | 大区块间距 |
  | 2xl | 48px | Section 间距 |
  | 3xl | 64px | Page section 间距 |

## Layout

- **Approach:** Grid-disciplined — 严格列对齐，可预测的布局
- **Grid:** Playground 双栏 (40%/60%), 文档站 12 列
- **Max content width:** 960px (文档/营销), Playground 全宽
- **Border radius:** Hierarchical scale
  | Token | Value | Usage |
  |-------|-------|-------|
  | radius-sm | 4px | 小元素：badge, chip, 内联 tag |
  | radius | 6px | 标准元素：按钮, 输入框, 代码块 |
  | radius-lg | 10px | 卡片, 面板, 下拉菜单 |
  | radius-xl | 16px | 大容器：mockup 框, 模态框 |
  | radius-full | 9999px | 药丸形：搜索框, 圆形按钮 |

## Shadow

| Token        | Value                                                                                                              | Usage                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| shadow-xs    | `0 1px 2px rgb(0 0 0 / 0.03)`                                                                                      | 卡片静态                    |
| shadow-sm    | `0 1px 3px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.03)`                                                         | 卡片 hover                  |
| shadow-md    | `0 4px 12px rgb(0 0 0 / 0.06), 0 1px 3px rgb(0 0 0 / 0.04)`                                                        | 浮层, 下拉菜单              |
| shadow-lg    | `0 12px 40px rgb(0 0 0 / 0.08), 0 4px 12px rgb(0 0 0 / 0.04)`                                                      | 模态框                      |
| shadow-phone | `0 0 0 1px rgba(0,0,0,0.03), 0 20px 60px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)` | iPhone 模拟器（多层漂浮感） |
| shadow-focus | `0 0 0 3px rgb(99 102 241 / 0.1)`                                                                                  | 聚焦环                      |

## Motion

- **Approach:** Minimal-functional — 只做辅助理解的过渡，不做装饰性动画
- **Easing:**
  - enter: `ease-out` (元素出现)
  - exit: `ease-in` (元素消失)
  - move: `ease-in-out` (位置变化)
  - spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` (弹性，仅用于特殊强调)
- **Duration:**
  - micro: 50-100ms (hover, focus 状态变化)
  - short: 150ms (标准过渡 — 全局默认 `--transition`)
  - medium: 250ms (面板滑入, Tab 切换)
  - long: 400ms (AI 聊天面板展开)
- **特殊动画:**
  - AI 生成中：三点脉冲 (1.2s staggered, `dot-pulse`)
  - Toast 通知：滑入 + 淡入 (200ms, `toast-in`)
  - AI 面板滑入：250ms cubic-bezier (0.16, 1, 0.3, 1)

## Playground 专项规范

### Header

- **毛玻璃效果:** `backdrop-filter: blur(12px)`, 背景 `rgba(255,255,255,0.85)`
- **底部边框:** `1px solid rgba(0,0,0,0.06)`（更轻盈）

### AI 聊天区

- **用户气泡:** `linear-gradient(135deg, #6366f1, #818cf8)` 渐变背景，白色文字
- **AI 气泡:** `surface-2` 底色，无边框，左侧 `2px` accent 渐变描边条
- **消息间距:** 12px（增加呼吸感）
- **空状态:** sparkle 图标 + 标题/副标题层次 + 模板 chips

### 预览面板

- **Tabs:** Underline 样式，激活态 accent 色底部 2px 描边，无背景填充
- **预览区背景:** `surface-1` + 微弱 noise texture overlay
- **手机帧:** 48px 圆角，`shadow-phone` 多层阴影
- **手机帧圆角:** 48px（更贴近真机）

### AI 模式编辑 Tab

- **不包含 WidgetPalette** — AI 模式下不支持新增组件
- 仅保留 FormCanvas：拖拽排序 + 点击编辑文案
- 全宽展示

## Decisions Log

| Date       | Decision                      | Rationale                                                                                                                                                                                    |
| ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-03-21 | Initial design system created | Created by /design-consultation. Based on existing Playground CSS variables + competitive research (v0.dev, bolt.new, formily). Formalized implicit design decisions into documented system. |
| 2026-03-21 | Light theme as primary        | Deliberate differentiation — when v0/bolt/cursor all use dark themes, light becomes distinctive. Dark mode supported as secondary.                                                           |
| 2026-03-21 | Instrument Serif for display  | Creative risk — developer tools rarely use serifs. Adds editorial quality and personality without compromising tool feel. Limited to hero/display usage only.                                |
| 2026-03-21 | Keep indigo #6366f1 as accent | Familiar and safe. Acknowledged overlap with Tailwind default indigo; may revisit if brand differentiation becomes critical.                                                                 |
| 2026-03-28 | Playground 视觉升级 v2        | 竞品调研 (v0.dev, bolt.new, lovable.dev) 后发现中间灰背景是最大问题。升级为通透白底 + noise texture + 毛玻璃 header + 渐变气泡 + underline tabs + 浮空手机帧。                               |
| 2026-03-28 | Surface 色值 v2               | `#fafbfc/#f4f5f8/#ebedf2` → `#ffffff/#f7f8fa/#f0f1f5`。更通透，拉大面板与背景的对比。边框改为半透明 rgba 值。                                                                                |
| 2026-03-28 | AI 模式编辑限制               | 移除 WidgetPalette，AI 模式编辑仅支持拖拽排序和文案修改。原因：空间有限，且 AI 已负责组件增删。                                                                                              |
| 2026-03-28 | 手机帧 shadow-phone           | 新增独立 token，4 层阴影产生漂浮感。手机帧是 v3sf 的独特卖点，需要成为预览区视觉锚点。                                                                                                       |
| 2026-03-28 | 用户气泡渐变                  | 从纯色 `#5b5ff7` 改为 `#6366f1→#818cf8` 渐变。竞品调研中的差异化 RISK 选择 — 增加层次感。                                                                                                    |
