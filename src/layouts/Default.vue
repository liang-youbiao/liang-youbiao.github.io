<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import KanbanGirl from '@/components/KanbanGirl.vue'
import { site } from '@/utils/site'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const year = new Date().getFullYear()
const route = useRoute()

const navItems = [
  { name: '首页', path: '/' },
  { name: '知识', path: '/knowledge/' },
  { name: '成长系统', path: '/mysystem/' },
  { name: '成就榜', path: '/achievements/' },
  { name: '思考体系', path: '/thinking/' },
  { name: '执行体系', path: '/execution/' },
  { name: '学习体系', path: '/learning/' },
  { name: '训练体系', path: '/training/' },
  { name: '归档', path: '/archives/' },
  { name: '分类', path: '/categories/' },
  { name: '标签', path: '/tags/' },
]

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  const nav = document.querySelector('.matery-nav-inner')
  if (nav && !nav.contains(e.target as Node)) closeMenu()
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

watch(() => route.path, () => { closeMenu() })
</script>

<template>
  <div class="app">
    <nav class="matery-nav">
      <div class="matery-nav-inner">
        <RouterLink to="/" class="matery-brand">
          <span class="brand-icon">{{ site.brandIcon }}</span>
          <span>{{ site.shortTitle }}</span>
        </RouterLink>
        <button class="hamburger" :aria-expanded="menuOpen" aria-label="菜单" @click.stop="toggleMenu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
        <ul class="matery-menu" :class="{ 'is-open': menuOpen }">
          <li v-for="item in navItems" :key="item.path">
            <RouterLink
              :to="item.path"
              :exact-active-class="item.path === '/' ? 'router-link-active' : ''"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <p>© {{ year }} {{ site.author }} · 记录生活 · 记录自己</p>
      <p class="footer-meta"></p>
      <p class="footer-stats">
        <span class="stat-item" title="本站总访问量">
          <i class="far fa-eye"></i>
          <span id="busuanzi_value_site_pv">—</span> 次访问
        </span>
        <span class="stat-sep">·</span>
        <span class="stat-item" title="本站访客数">
          <i class="fas fa-user"></i>
          <span id="busuanzi_value_site_uv">—</span> 位访客
        </span>
      </p>
    </footer>

    <ProgressBar />
    <KanbanGirl
      model-path="/kanban/epsilon2.1/Epsilon2.1.model.json"
      position="left"
    />
    <KanbanGirl
      model-path="/kanban/shizuku/shizuku.model.json"
      position="right"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--matery-bg);
}

.site-main {
  flex: 1;
}

.brand-icon {
  font-size: 1.6rem;
}

.site-footer {
  border: 0;
  padding: 2rem 0;
  margin-top: 3rem;
  text-align: center;
  color: #888;
  font-size: 0.85rem;
  background-color: #fff;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.06);
}

.footer-meta {
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  opacity: 0.7;
}

.footer-stats {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.stat-item i {
  color: var(--matery-primary);
  font-size: 0.85rem;
}

.stat-item span {
  font-weight: 600;
  color: #666;
  min-width: 1.5em;
  text-align: left;
}

.stat-sep {
  color: #ddd;
}

/* 汉堡按钮(默认隐藏) */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.5rem;
  flex-direction: column;
  gap: 4px;
  font-family: inherit;
}
.hamburger-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: #2c3e50;
  border-radius: 1px;
  transition: transform 0.2s, opacity 0.2s;
}
.hamburger[aria-expanded="true"] .hamburger-bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.hamburger[aria-expanded="true"] .hamburger-bar:nth-child(2) { opacity: 0; }
.hamburger[aria-expanded="true"] .hamburger-bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* 移动端:汉堡 + 抽屉 */
@media (max-width: 768px) {
  .hamburger { display: inline-flex; }

  .matery-nav-inner {
    padding: 0 1rem;
    gap: 0.8rem;
    position: relative;
  }

  .matery-brand {
    font-size: 1.15rem;
  }

  .matery-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.5rem 0;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    border-top: 1px solid #e5e7eb;
    overflow-x: visible;
    white-space: normal;
    z-index: 99;
  }
  .matery-menu.is-open { display: flex; }
  .matery-menu > li {
    width: 100%;
    padding: 0.6rem 1.25rem;
    border-bottom: 1px solid #f1f5f9;
  }
  .matery-menu > li:last-child { border-bottom: none; }
}
</style>