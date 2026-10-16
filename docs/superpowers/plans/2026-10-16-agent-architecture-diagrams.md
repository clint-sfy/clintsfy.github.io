# Agent Architecture Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a title-free, neon-circuit Agent architecture diagram gallery under “前沿 & 工作”, with fifteen progressively ordered diagrams for Agent, RAG, MCP, orchestration, safety, and Coding Agent Harness concepts.

**Architecture:** A typed catalog is the single source of truth for routes, stages, nodes, edges, legends, and responsive layout slots. Reusable Vue/SVG components render the catalog into a gallery route and fifteen diagram pages, while VitePress navigation and sidebar consume the same stable route structure.

**Tech Stack:** VitePress 1, Vue 3, TypeScript, inline SVG, Node test runner, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-10-16-agent-architecture-diagrams-design.md`

## Global Constraints

- Exactly four stages and fifteen diagrams in the approved learning order.
- Diagram pages render no visible H1 or large article title; the structure graphic is the first dominant content.
- Keep only sequence, compact topic label, node/edge labels, legend, one-line selected-node responsibility, and previous/next navigation.
- Use the approved neon-circuit visual language; dark mode is primary, with readable light-mode and narrow-screen layouts.
- Use Vue and inline SVG only; no external image host, drawing service, runtime API, or new dependency.
- Colors have stable semantics: Agent blue, RAG/context green, MCP/tools purple, safety/approval orange, infrastructure neutral.
- Every edge has a direction and a flow type: `request`, `result`, `state`, or `control`.
- Interactive nodes are keyboard accessible and have accessible names.
- Respect `prefers-reduced-motion`; no looping animation.
- Do not duplicate Agent course prose or add code/API tutorials.

## Review Focus

- A narrow viewport must reflow labels and nodes rather than scale text below readability; Task 2 adds a responsive layout contract test.
- Catalog edges must never reference missing nodes or duplicate node IDs; Task 1 adds graph integrity tests.
- Page frontmatter titles must remain available for route/SEO while visible page titles remain hidden; Task 3 adds rendered-source contracts.
- Keyboard focus and click selection must produce the same highlighted path and responsibility text; Task 2 adds component interaction tests/contracts.
- Diagram terminology and direction must preserve Agent/RAG/MCP responsibility boundaries; Task 4 adds semantic assertions for the fifteen diagrams.

---

## File Structure

- `docs/.vitepress/theme/agent-diagrams/types.ts`: graph and catalog interfaces.
- `docs/.vitepress/theme/agent-diagrams/catalog.ts`: four stages and fifteen diagram definitions.
- `docs/.vitepress/theme/components/agent-diagrams/AgentDiagramGallery.vue`: title-free stage route.
- `docs/.vitepress/theme/components/agent-diagrams/AgentDiagramShell.vue`: sequence, legend, graph, detail, previous/next.
- `docs/.vitepress/theme/components/agent-diagrams/ArchitectureDiagram.vue`: responsive inline SVG renderer and selection logic.
- `docs/.vitepress/theme/components/agent-diagrams/DiagramNode.vue`: accessible SVG node.
- `docs/.vitepress/theme/components/agent-diagrams/DiagramEdge.vue`: directed edge renderer.
- `docs/.vitepress/theme/styles/agent-diagrams.css`: neon theme, light/dark tokens, responsive and reduced-motion rules.
- `docs/categories/agent-diagrams/index.md`: gallery mount only.
- `docs/categories/agent-diagrams/01-*.md` through `15-*.md`: frontmatter plus shell mount only.
- `docs/.vitepress/config/nav.ts`: add “Agent 架构图” under “前沿 & 工作”.
- `docs/.vitepress/config/sidebar.ts`: explicit staged sidebar for the new route.
- `docs/.vitepress/theme/index.ts`: register gallery and shell components; import styles.
- `tests/agent-diagrams-catalog.test.mjs`: catalog order, graph integrity, semantic boundaries.
- `tests/agent-diagrams-pages.test.mjs`: routes, mounts, no visible headings, nav/sidebar, style/accessibility contracts.

### Task 1: Typed Catalog Foundation

**Files:**
- Create: `docs/.vitepress/theme/agent-diagrams/types.ts`
- Create: `docs/.vitepress/theme/agent-diagrams/catalog.ts`
- Create: `tests/agent-diagrams-catalog.test.mjs`

**Interfaces:**
- Produces: `DiagramCategory`, `DiagramFlowType`, `DiagramNodeDefinition`, `DiagramEdgeDefinition`, `AgentDiagramDefinition`, `AgentDiagramStage`, `agentDiagramStages`, `agentDiagrams`, `getAgentDiagram(slug)`.
- Layout slots use normalized coordinates and optional narrow-screen coordinates; renderer must not invent semantic graph data.

- [ ] **Step 1: Write failing catalog tests**

Assert four stages, fifteen unique ordered slugs, required category/flow enums, unique node IDs per graph, existing edge endpoints, one main directed path per graph, and previous/next sequence continuity.

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/agent-diagrams-catalog.test.mjs`
Expected: FAIL because catalog modules do not exist.

- [ ] **Step 3: Implement types and the complete fifteen-diagram catalog**

Use the exact approved topics and stable color semantics. Keep descriptions to one sentence per node and edge labels short.

- [ ] **Step 4: Run the catalog test**

Run: `node --test tests/agent-diagrams-catalog.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/theme/agent-diagrams tests/agent-diagrams-catalog.test.mjs
git commit -m "feat(agent-diagrams): add typed architecture catalog"
```

### Task 2: Reusable Neon Diagram Renderer

**Files:**
- Create: `docs/.vitepress/theme/components/agent-diagrams/DiagramNode.vue`
- Create: `docs/.vitepress/theme/components/agent-diagrams/DiagramEdge.vue`
- Create: `docs/.vitepress/theme/components/agent-diagrams/ArchitectureDiagram.vue`
- Create: `docs/.vitepress/theme/components/agent-diagrams/AgentDiagramShell.vue`
- Create: `docs/.vitepress/theme/styles/agent-diagrams.css`
- Modify: `tests/agent-diagrams-pages.test.mjs`

**Interfaces:**
- Consumes: `AgentDiagramDefinition` and catalog lookup from Task 1.
- Produces: global `<AgentDiagram slug="..." />`-ready shell behavior, node selection state, related-path highlighting, one-line responsibility output, previous/next links.

- [ ] **Step 1: Write failing renderer contract tests**

Assert semantic button/focus behavior, accessible labels, selection detail, all four edge classes, light/dark tokens, `prefers-reduced-motion`, and a narrow-screen reflow rule that uses alternate coordinates/layout rather than CSS scaling alone.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test tests/agent-diagrams-pages.test.mjs`
Expected: FAIL because renderer files do not exist.

- [ ] **Step 3: Implement node and edge components**

`DiagramNode` emits the node ID on focus/click. `DiagramEdge` renders directional markers and flow-type classes without owning graph state.

- [ ] **Step 4: Implement `ArchitectureDiagram` selection and responsive layout**

Selected/focused nodes highlight incident edges and directly connected nodes. Empty canvas activation clears selection. Render an SVG `<title>` and `<desc>` for every graph.

- [ ] **Step 5: Implement `AgentDiagramShell` and shared neon CSS**

No visible article title. Render compact sequence/topic tokens, legend, diagram, one-line detail, and previous/next controls. Use shared CSS tokens for dark/light and disable transitions under reduced motion.

- [ ] **Step 6: Run renderer tests**

Run: `node --test tests/agent-diagrams-pages.test.mjs`
Expected: PASS for renderer contracts.

- [ ] **Step 7: Commit**

```bash
git add docs/.vitepress/theme/components/agent-diagrams docs/.vitepress/theme/styles/agent-diagrams.css tests/agent-diagrams-pages.test.mjs
git commit -m "feat(agent-diagrams): add neon graph renderer"
```

### Task 3: Gallery, Routes, Navigation, and Theme Registration

**Files:**
- Create: `docs/.vitepress/theme/components/agent-diagrams/AgentDiagramGallery.vue`
- Create: `docs/categories/agent-diagrams/index.md`
- Create: `docs/categories/agent-diagrams/01-llm-workflow-agent.md` through `15-coding-agent-harness.md`
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/.vitepress/config/nav.ts`
- Modify: `docs/.vitepress/config/sidebar.ts`
- Modify: `tests/agent-diagrams-pages.test.mjs`

**Interfaces:**
- Consumes: catalog and shell from Tasks 1–2.
- Produces: `/categories/agent-diagrams/` plus fifteen stable routes and the “前沿 & 工作 → Agent 架构图” entry.

- [ ] **Step 1: Extend failing route and navigation tests**

Assert sixteen Markdown paths, exact component mounts, frontmatter titles, absence of Markdown H1/H2 in diagram pages, nav entry, staged sidebar ordering, and theme registration/imports.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test tests/agent-diagrams-pages.test.mjs`
Expected: FAIL because pages and navigation are missing.

- [ ] **Step 3: Implement the gallery component**

Render the four stages and fifteen compact visual entries from the catalog. Do not render article cards, summaries, dates, tag walls, or a traditional hero title.

- [ ] **Step 4: Create title-free Markdown routes**

Each diagram page contains frontmatter and one `<AgentDiagram slug="..." />` mount. The index contains one `<AgentDiagramGallery />` mount.

- [ ] **Step 5: Register components and styles**

Register `AgentDiagram` and `AgentDiagramGallery` globally and import the dedicated stylesheet.

- [ ] **Step 6: Add navigation and staged sidebar**

Add the new item under “前沿 & 工作” and an explicit four-stage sidebar whose routes follow catalog order.

- [ ] **Step 7: Run route tests and build**

Run: `node --test tests/agent-diagrams-pages.test.mjs && pnpm build`
Expected: tests PASS and VitePress build exits 0.

- [ ] **Step 8: Commit**

```bash
git add docs/categories/agent-diagrams docs/.vitepress/theme docs/.vitepress/config tests/agent-diagrams-pages.test.mjs
git commit -m "feat(agent-diagrams): publish visual learning gallery"
```

### Task 4: Semantic Review, Visual QA, and Deployment

**Files:**
- Modify only files found defective by review in Tasks 1–3.

**Interfaces:**
- Consumes: complete gallery and fifteen pages.
- Produces: reviewed, tested, deployed static site.

- [ ] **Step 1: Run semantic graph audit**

Verify Agent versus LLM, RAG versus loop, MCP versus model decision, state/session/memory, single versus multi-agent, and guardrail/sandbox/approval/trace boundaries against the existing Agent course.

- [ ] **Step 2: Run visual QA**

Inspect gallery and representative core/RAG/MCP/workflow/final diagrams at desktop and narrow widths in both themes. Confirm no large page titles, clipped labels, unreadable arrows, or inaccessible controls.

- [ ] **Step 3: Fix review findings and add regression assertions**

Every material finding gets a targeted assertion in the owning test file before the fix.

- [ ] **Step 4: Run full verification**

Run: `pnpm test`, `pnpm build`, `git diff --check`.
Expected: all exit 0.

- [ ] **Step 5: Commit final fixes**

```bash
git add docs tests
git commit -m "fix(agent-diagrams): polish visual learning flow"
```

- [ ] **Step 6: Push and monitor deployment**

Push `main`, monitor the matching GitHub Pages workflow to `completed/success`, and verify the live gallery plus representative routes.
