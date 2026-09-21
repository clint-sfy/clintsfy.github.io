<script setup lang="ts">
import { data as projects } from '../data/open-source.data'

const featuredProjects = projects.slice(0, 3)
</script>

<template>
  <section class="home-projects" aria-labelledby="home-projects-title">
    <div class="home-projects__heading">
      <div>
        <p class="home-projects__eyebrow">LEARNING IN PUBLIC</p>
        <h2 id="home-projects-title">正在拆解的开源项目</h2>
        <p>从目录结构到启动链路，把源码阅读沉淀成可以持续扩展的项目文档。</p>
      </div>
      <a class="home-projects__all" href="/open-source/">查看全部项目 <span aria-hidden="true">→</span></a>
    </div>

    <div class="home-projects__grid">
      <a v-for="project in featuredProjects" :key="project.link" class="home-project" :href="project.link">
        <span class="home-project__status">{{ project.statusLabel }}</span>
        <h3>{{ project.name }}</h3>
        <p>{{ project.summary }}</p>
        <span class="home-project__meta">{{ project.noteCount }} 篇学习笔记</span>
      </a>
      <div v-if="featuredProjects.length === 0" class="home-projects__empty">
        <span>CURATING</span>
        <h3>下一份源码，宁缺毋滥</h3>
        <p>正在筛选架构清晰、设计值得反复推敲的项目。确定后会从结构、核心链路和工程取舍开始完整拆解。</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-projects {
  max-width: 1152px;
  margin: 24px auto 80px;
  padding: 48px 32px;
  background:
    radial-gradient(circle at 85% 10%, rgba(48, 209, 88, 0.12), transparent 32%),
    radial-gradient(circle at 65% 90%, rgba(10, 132, 255, 0.12), transparent 38%),
    var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 28px;
}

.home-projects__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 28px;
}

.home-projects__eyebrow {
  margin: 0 0 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.home-projects h2 {
  margin: 0;
  border: 0;
  font-size: clamp(26px, 4vw, 40px);
  letter-spacing: -0.04em;
}

.home-projects__heading p:last-child {
  max-width: 620px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
}

.home-projects__all {
  flex: none;
  padding: 10px 14px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  border-radius: 12px;
}

.home-projects__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.home-project {
  min-height: 190px;
  padding: 22px;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.home-project:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 42%, var(--vp-c-divider));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.home-project__status {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 650;
}

.home-project h3 {
  margin: 18px 0 8px;
  font-size: 21px;
}

.home-project p {
  min-height: 48px;
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.home-project__meta {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.home-projects__empty {
  grid-column: 1 / -1;
  padding: 30px;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-divider));
  border-radius: 20px;
}

.home-projects__empty span {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.home-projects__empty h3 {
  margin: 12px 0 6px;
}

.home-projects__empty p {
  max-width: 700px;
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

@media (max-width: 767px) {
  .home-projects {
    margin: 16px 24px 56px;
    padding: 32px 20px;
    border-radius: 22px;
  }

  .home-projects__heading {
    display: block;
  }

  .home-projects__all {
    display: inline-block;
    margin-top: 18px;
  }

  .home-projects__grid {
    grid-template-columns: 1fr;
  }
}
</style>
