# 侧栏文字不可见修复报告

日期：2026-09-26
工作树：`C:\MyProject\clintsfy.github.io\.worktrees\java-notes-completion`
范围：修复 VitePress 桌面端侧栏子项“有点击区域但无可见文字”，保持收起/展开、移动端和暗色默认主题。

## 1. 复现与证据

复现 URL：`http://127.0.0.1:4173/courses/java/01-Java基础/03-数据类型与运算符`

初始 preview 页面满足用户描述：

- `.VPSidebar` 的 computed `visibility` 为 `visible`、`transform` 为 `none`，链接矩形存在且可点击；因此不是 `SidebarCollapse.vue` 的 `sidebar-collapsed`、`visibility`、`transform` 或 `z-index` 导致。
- 子项 DOM 是 `<p class="text"></p>`，`textContent` 为空；组标题仍然可见。
- SSR 产物包含 `<p class="text"><div class="text-color-red ...">1</div>开发环境与第一个 Java 程序</p>`。
- 控制台报告 `Hydration completed but contains mismatches.`。
- 页面根节点保持 `dark`，链接 computed `opacity: 1` 且有正常主题文字色；因此排除透明度/主题变量导致的“同色不可见”。

根因：`docs/.vitepress/config/sidebar.ts` 的 `addOrderNumber()` 使用块级 `<div>` 作为序号，并把它拼接进 VitePress `VPSidebarItem` 默认的 `<p class="text" v-html="item.text">`。`<div>` 不能合法嵌套在 `<p>` 中，浏览器解析 SSR HTML 时会关闭/清空段落，随后 Vue 水合产生 mismatch，导致链接仍有点击区域但文字节点被丢失。

## 2. TDD 红绿循环

新增 `tests/sidebar-rendering.test.mjs`，通过公开的 sidebar 配置遍历链接项，断言标签文本不能在 VitePress `<p class="text">` 中注入 `<div>`。

RED（修复前）：

```text
pnpm test -- tests/sidebar-rendering.test.mjs
1 test, 0 pass, 1 fail
AssertionError: sidebar label for /my_project/03-STM32智能打印机/01-实验准备 must not put a block element inside VitePress <p class="text">
```

GREEN（修复后）：

```text
pnpm test -- tests/sidebar-rendering.test.mjs
1 test, 1 pass, 0 fail, exit 0
```

## 3. 单一修复

仅修改 `addOrderNumber()`：将四种序号标记从 `<div>` 改为 `<span>`，保留原有 class、颜色、间距、字号、序号和 `display: inline-block`。没有修改 `SidebarCollapse.vue`、主题色、折叠状态、localStorage 逻辑、依赖或部署配置。

## 4. 回归验证

- `pnpm build`：exit `0`；VitePress client/server 构建与页面渲染成功。仅保留既有大 chunk 和缺少部分语法高亮语言的非阻塞警告。
- `pnpm test`：`26` tests，`25` pass，`1` fail。唯一失败是既有 `VitePress navigation controls keep 44px targets and the scrolled nav retains its surface` 的 feature-gated CSS baseline；该失败与本修复无关，且主题/CSS 未改动。
- `git diff --check`：无输出，exit `0`。
- 构建产物抽查：子项变为合法的 `<p><span>1</span>开发环境与第一个 Java 程序</p>`。
- 重启 preview：`pnpm preview --host 127.0.0.1 --port 4173`，exec session `84450`，监听 `node.exe` PID `8344`，命令来自当前工作树。
- 本地浏览器水合后，侧栏 AX 文本恢复：`1 开发环境与第一个 Java 程序`、`2 基础语法与程序结构`、`3 数据类型与运算符`、`4 控制流与方法` 等均可见；链接 computed `visibility: visible`、`opacity: 1`、`transform: none`。
- 收起/展开回归：点击“收起左侧目录”后根节点为 `dark sidebar-collapsed`，侧栏 `visibility: hidden`、`transform: translateX(-100%)`，按钮移动到 `x=64`；点击“展开左侧目录”后根节点恢复 `dark`，侧栏回到 `visibility: visible`，上述四个链接文本仍可见，按钮回到 `x=224`。
- 暗色默认：页面根节点保持 `dark`，未修改 `appearance: 'dark'` 或主题变量。
- 移动端保护：本次未修改 SidebarCollapse/CSS；基础规则仍为 `display: none`，仅 `@media (min-width: 960px)` 显示桌面收起按钮，移动端原有 VitePress 文章菜单路径不变。

## 5. 提交与 concerns

commit message：`fix: preserve VitePress sidebar labels during hydration`；最终 commit hash 以 `git log`/父 agent 集成结果为准。

Concern：全量测试仍有一个执行前已存在的导航 CSS 断言失败；本任务没有扩大范围去修改主题样式。若该 baseline 需要处理，应另立主题/CSS 诊断任务。
