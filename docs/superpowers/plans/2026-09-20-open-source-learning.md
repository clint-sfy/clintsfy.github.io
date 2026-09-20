# 学习开源项目栏目 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为个人知识库增加可持续扩展的“学习开源项目”一级栏目，并以轻量苹果质感统一首页、导航和项目卡片视觉。

**Architecture:** 使用 Markdown frontmatter 作为项目数据源，在 VitePress 构建期扫描并规范化为项目卡片数据；Vue 组件只负责展示。导航、侧栏和全局 CSS 沿用默认主题扩展点，保持 GitHub Pages 纯静态部署。

**Tech Stack:** VitePress 1.0.0-rc.31、Vue 3.3、TypeScript、fast-glob、gray-matter、Node test runner、CSS

**Spec:** `docs/superpowers/specs/2026-09-20-open-source-learning-design.md`

## Global Constraints

- 不增加服务端、运行时 GitHub API、外部字体或大型前端依赖。
- 内容仍以 Markdown 为唯一事实来源；新增项目不需要修改 Vue 组件。
- 保留现有 GitHub Pages、CNAME、评论、标签和归档机制。
- 品牌主色为 `#0071e3`；浅色、深色、键盘和移动端均可用。
- 动效必须遵守 `prefers-reduced-motion`，毛玻璃必须有纯色回退。

## Review Focus

- 项目 frontmatter 缺少可选字段时构建不中断，卡片仍能显示有效入口。
- 未知 `status` 映射为“暂停”，不能渲染空状态或原始英文值。
- 多个项目的排序在不同文件系统上保持稳定。
- 项目目录只有 `index.md` 时笔记数为 0，不把首页计入笔记。
- 长项目名和技术栈在 375px 宽度下换行且不造成横向滚动。

---

### Task 1: 构建期项目数据与测试

**Files:**
- Create: `docs/.vitepress/theme/data/open-source.ts`
- Create: `docs/.vitepress/theme/data/open-source.data.ts`
- Create: `tests/open-source-data.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `OpenSourceProject` 类型；`loadOpenSourceProjects(rootDir)` 函数；VitePress data loader 的 `data` 数组。

- [ ] **Step 1: 写失败测试**

使用 Node 内置测试创建临时 `docs/open-source` 样例，断言：按 `order` 排序、排除 `index.md` 计数、未知状态回退为 `paused`、缺失 stack 回退为空数组、链接去掉数字目录前缀但实际路径保持目录名。

- [ ] **Step 2: 验证测试失败**

Run: `pnpm test`

Expected: FAIL，因为 `open-source.ts` 尚不存在。

- [ ] **Step 3: 实现最小数据模块与 loader**

实现导出的类型：

```ts
export type ProjectStatus = 'learning' | 'completed' | 'paused'

export interface OpenSourceProject {
  name: string
  summary: string
  repo?: string
  stack: string[]
  status: ProjectStatus
  statusLabel: string
  noteCount: number
  link: string
  order: number
}

export function loadOpenSourceProjects(rootDir: string): OpenSourceProject[]
```

data loader 调用该纯函数并导出 `watch: ['../../../open-source/*/*.md']`、`load()`。

- [ ] **Step 4: 运行测试与构建**

Run: `pnpm test`

Expected: PASS。

Run: `pnpm build`

Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add package.json tests docs/.vitepress/theme/data
git commit -m "feat: add open source project data loader"
```

### Task 2: 栏目内容、卡片组件与站点导航

**Files:**
- Create: `docs/.vitepress/theme/components/OpenSourceProjects.vue`
- Create: `docs/open-source/index.md`
- Create: `docs/open-source/01-RuoYi/index.md`
- Create: `docs/open-source/01-RuoYi/01-项目概览.md`
- Create: `docs/open-source/01-RuoYi/02-目录与模块.md`
- Create: `docs/open-source/01-RuoYi/03-启动链路.md`
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/.vitepress/config/nav.ts`
- Modify: `docs/.vitepress/config/sidebar.ts`

**Interfaces:**
- Consumes: Task 1 的 `data` 和 `OpenSourceProject`。
- Produces: `/open-source/` 一级入口、RuoYi 项目内容、专用侧栏与语义化项目卡片。

- [ ] **Step 1: 扩充失败测试**

在 `tests/open-source-data.test.mjs` 增加真实内容目录断言：至少发现 RuoYi、笔记数为 3、链接为 `/open-source/01-RuoYi/`。

- [ ] **Step 2: 验证测试失败**

Run: `pnpm test`

Expected: FAIL，因为真实栏目内容尚不存在。

- [ ] **Step 3: 创建内容与展示组件**

`OpenSourceProjects.vue` 使用：

```ts
import { data as projects } from '../data/open-source.data'
```

渲染标题、摘要、状态文字、技术栈、笔记数、站内入口和可选仓库链接；链接具备可辨识文本与 `aria-label`。RuoYi 三篇笔记分别说明学习目标、模块关系和 Spring Boot 启动链路，并明确源码路径需以本地实际版本为准。

- [ ] **Step 4: 接入导航与侧栏**

将首页 nav 改为 `/`，新增“学习开源项目”指向 `/open-source/`。新增 `getOpenSourceItems('open-source')`：每个一级项目目录为一组，项目 `index.md` 作为“项目导读”，其余 Markdown 按文件名排序。

- [ ] **Step 5: 注册组件并验证**

在主题 `enhanceApp` 中注册 `OpenSourceProjects`。运行：

```bash
pnpm test
pnpm build
```

Expected: 两者 PASS，产物包含栏目页、项目首页与三篇笔记。

- [ ] **Step 6: 提交**

```bash
git add docs tests
git commit -m "feat: add open source learning section"
```

### Task 3: 苹果式视觉系统与首页调整

**Files:**
- Modify: `docs/.vitepress/theme/styles/vars.css`
- Modify: `docs/.vitepress/theme/styles/custom.css`
- Modify: `docs/index.md`
- Modify: `docs/.vitepress/config/head.ts`

**Interfaces:**
- Consumes: Task 2 的栏目页 class 与 VitePress 默认主题 class。
- Produces: 全站设计变量、毛玻璃导航、响应式卡片、首页入口、深色模式与 reduced-motion 降级。

- [ ] **Step 1: 写失败的静态契约测试**

在 `tests/open-source-data.test.mjs` 中读取样式和首页，断言存在 `#0071e3`、`.open-source-grid`、`:focus-visible`、`prefers-reduced-motion`、深色模式选择器，以及首页 `/open-source/` 行动链接。

- [ ] **Step 2: 验证测试失败**

Run: `pnpm test`

Expected: FAIL，因为视觉契约尚未实现。

- [ ] **Step 3: 更新变量与全局样式**

用 CSS 变量定义浅/深表面色、边框、阴影和 18–24px 圆角；导航提供 `background-color` 回退后再声明 `backdrop-filter`。卡片网格在 `<640px` 一列、`640–959px` 两列、`>=960px` 三列；交互具备焦点环和最小 44px 触控高度。

- [ ] **Step 4: 精简首页与 head**

Hero 保留“阿源的知识库”，改为更短的学习定位；主要按钮进入 `/open-source/`，次要按钮进入 `/introduction`。features 调整为“开源项目研习 / 系统学习笔记 / 项目实践 / 持续分享”四项。将 `theme-color` 改为 `#f5f5f7`。

- [ ] **Step 5: 完整验证**

```bash
pnpm test
pnpm build
```

Expected: 全部 PASS，构建输出无错误。

- [ ] **Step 6: 提交**

```bash
git add docs tests
git commit -m "style: refresh knowledge base visual design"
```

