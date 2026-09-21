<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const storageKey = 'clintsfy:sidebar-collapsed'
const route = useRoute()
const collapsed = ref(false)
const available = ref(false)

function applyState() {
  document.documentElement.classList.toggle('sidebar-collapsed', collapsed.value)
}

function detectSidebar() {
  available.value = Boolean(document.querySelector('.VPSidebar'))
  if (!available.value) document.documentElement.classList.remove('sidebar-collapsed')
  else applyState()
}

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem(storageKey, collapsed.value ? 'true' : 'false')
  applyState()
}

onMounted(async () => {
  collapsed.value = localStorage.getItem(storageKey) === 'true'
  await nextTick()
  detectSidebar()
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    detectSidebar()
  },
)

onBeforeUnmount(() => document.documentElement.classList.remove('sidebar-collapsed'))
</script>

<template>
  <button
    v-if="available"
    class="sidebar-collapse"
    type="button"
    :aria-label="collapsed ? '展开左侧目录' : '收起左侧目录'"
    :title="collapsed ? '展开左侧目录' : '收起左侧目录'"
    :aria-expanded="!collapsed"
    @click="toggleSidebar"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  </button>
</template>

<style scoped>
.sidebar-collapse {
  position: fixed;
  z-index: 61;
  top: 14px;
  left: calc(var(--vp-sidebar-width) - 48px);
  display: none;
  width: 36px;
  height: 36px;
  place-items: center;
  color: var(--vp-c-text-2);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, transparent);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  backdrop-filter: blur(16px);
  transition: left 220ms ease, color 180ms ease, background-color 180ms ease;
}

.sidebar-collapse:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.sidebar-collapse svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 220ms ease;
}

@media (min-width: 960px) {
  .sidebar-collapse {
    display: grid;
  }

  :global(html.sidebar-collapsed .sidebar-collapse) {
    left: 64px;
  }

  :global(html.sidebar-collapsed .sidebar-collapse svg) {
    transform: rotate(180deg);
  }

  :global(html.sidebar-collapsed .VPSidebar) {
    transform: translateX(-100%);
    visibility: hidden;
  }

  :global(html.sidebar-collapsed .VPContent.has-sidebar) {
    padding-left: 0;
  }

  :global(html.sidebar-collapsed .VPNavBar.has-sidebar .title) {
    width: 112px;
  }

  :global(html.sidebar-collapsed .VPNavBar.has-sidebar .content) {
    padding-left: 112px;
  }

  :global(html.sidebar-collapsed .VPNavBarTitle > .title) {
    font-size: 0;
  }

  :global(html.sidebar-collapsed .VPNavBarTitle .logo) {
    margin-right: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-collapse,
  .sidebar-collapse svg,
  :global(.VPSidebar),
  :global(.VPContent.has-sidebar) {
    transition: none !important;
  }
}
</style>
