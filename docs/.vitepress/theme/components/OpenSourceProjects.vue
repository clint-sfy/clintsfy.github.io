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
      v-for="project in projects"
      :key="project.link"
      class="open-source-card"
    >
      <a
        class="open-source-card__main"
        :href="project.link"
        :aria-label="`${project.name}：${project.summary}。状态：${project.statusLabel}，${project.noteCount} 篇学习笔记。查看项目导读。`"
      >
        <h2 class="open-source-card__name">{{ project.name }}</h2>
        <p class="open-source-card__summary">{{ project.summary }}</p>
        <p class="open-source-card__status">状态：{{ project.statusLabel }}</p>
        <ul class="open-source-card__stack" aria-label="技术栈">
          <li v-for="technology in project.stack" :key="technology">
            {{ technology }}
          </li>
        </ul>
        <span class="open-source-card__note-count">
          {{ project.noteCount }} 篇学习笔记
        </span>
        <span class="open-source-card__entry">项目导读</span>
      </a>
      <a
        v-if="project.repo"
        class="open-source-card__repo"
        :href="project.repo"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`在新窗口打开 ${project.name} 的源码仓库`"
      >
        源码仓库
      </a>
    </article>
  </section>
</template>

<style scoped>
.open-source-card__main,
.open-source-card__repo {
  min-height: 44px;
}

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

.open-source-card__main {
  display: block;
}

.open-source-card__repo {
  display: inline-flex;
  align-items: center;
}
</style>
