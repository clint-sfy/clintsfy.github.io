<script lang="ts" setup>
import { data as projects } from '../data/open-source.data'
</script>

<template>
  <section class="open-source-grid" aria-label="开源项目列表">
    <div v-if="projects.length === 0" class="open-source-empty">
      <p class="open-source-empty__eyebrow">CURATING</p>
      <h2>下一份源码，宁缺毋滥</h2>
      <p>这里已经准备好承载多个项目。新项目会自动生成项目卡片、独立导读和可折叠的左侧文档目录。</p>
    </div>
    <article
      v-for="(project, projectIndex) in projects"
      :key="project.link"
      class="open-source-card"
    >
      <div class="open-source-card__main">
        <div class="open-source-card__header">
          <span class="open-source-card__index">{{ String(projectIndex + 1).padStart(2, '0') }}</span>
        </div>
        <div class="open-source-card__title-row">
          <h2 class="open-source-card__name">{{ project.name }}</h2>
        </div>
        <p class="open-source-card__summary">{{ project.summary }}</p>
        <div class="open-source-card__stack" aria-label="技术栈">
          <span v-for="technology in project.stack" :key="technology">
            {{ technology }}
          </span>
        </div>
        <p class="open-source-card__note-count">
          {{ project.noteCount }} 篇学习笔记
        </p>
      </div>
      <div class="open-source-card__actions">
        <a class="open-source-card__entry" :href="project.link">查看项目导读 <span aria-hidden="true">→</span></a>
        <a
          v-if="project.repo"
          class="open-source-card__repo"
          :href="project.repo"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`在新窗口打开 ${project.name} 的源码仓库`"
        >
          源码仓库 <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  </section>
</template>

<style scoped>
.open-source-empty {
  padding: 28px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
}

.open-source-empty__eyebrow {
  margin: 0;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.open-source-empty h2 {
  margin: 12px 0 8px;
  border: 0;
}

.open-source-empty p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.open-source-card__entry,
.open-source-card__repo {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
</style>
