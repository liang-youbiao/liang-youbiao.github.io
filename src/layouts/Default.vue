<script setup lang="ts">
import ProgressBar from '@/components/ProgressBar.vue'
import SearchBox from '@/components/SearchBox.vue'
import { site } from '@/utils/site'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const year = new Date().getFullYear()
const route = useRoute()

interface NavItem {
  name: string
  path?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { name: '首页', path: '/' },
  { name: '知识', path: '/knowledge/' },
  {
    name: '系统',
    children: [
      { name: '思考', path: '/thinking/' },
      { name: '执行', path: '/execution/' },
      { name: '学习', path: '/learning/' },
      { name: '训练', path: '/training/' },
    ],
  },
  { name: '归档', path: '/archives/' },
  { name: '分类', path: '/categories/' },
  { name: '标签', path: '/tags/' },
  { name: '小工具', path: '/demos/' },
  { name: '关于', path: '/about/' },
]

const openIndex = ref<number | null>(null)
const menuRef = ref<HTMLElement | null>(null)

function toggle(idx: number) {
  openIndex.value = openIndex.value === idx ? null : idx
}
function close() {
  openIndex.value = null
}

function onClickOutside(e: MouseEvent) {
  if (!menuRef.value) return
  if (!menuRef.value.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

// 路由变化关闭下拉
function onNavClick() { close() }

watch(() => route.path, () => { close() })
</script>

<template>
  <div class="app">
    <nav class="matery-nav">
      <div class="matery-nav-inner">
        <RouterLink to="/" class="matery-brand">
          <span class="brand-icon">{{ site.brandIcon }}</span>
          <span>{{ site.shortTitle }}</span>
        </RouterLink>
        <ul ref="menuRef" class="matery-menu">
          <li v-for="(item, i) in navItems" :key="i" :class="{ 'has-dropdown': item.children, open: openIndex === i }">
            <template v-if="item.children">
              <button class="menu-toggle" @click.stop="toggle(i)">
                {{ item.name }}
                <span class="caret">▾</span>
              </button>
              <ul v-show="openIndex === i" class="dropdown">
                <li v-for="c in item.children" :key="c.path">
                  <RouterLink :to="c.path!" @click="onNavClick">{{ c.name }}</RouterLink>
                </li>
              </ul>
            </template>
            <RouterLink
              v-else
              :to="item.path!"
              :exact-active-class="item.path === '/' ? 'router-link-active' : ''"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
        <div class="nav-end">
          <SearchBox />
          <a class="nav-search" href="https://github.com/liangyoubiao" target="_blank" rel="noopener" title="GitHub">
            <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
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

.nav-end {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-search {
  color: var(--matery-text);
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-search:hover { color: var(--matery-primary); }

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

/* 下拉菜单 */
.has-dropdown { position: relative; }
.menu-toggle {
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.menu-toggle:hover { color: var(--matery-primary); }
.caret { font-size: 0.7em; opacity: 0.7; transition: transform 0.2s; }
.has-dropdown.open .caret { transform: rotate(180deg); }
.dropdown {
  position: absolute;
  top: calc(100% + 0.6rem);
  left: -0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  list-style: none;
  margin: 0;
  padding: 0.4rem 0;
  min-width: 120px;
  z-index: 100;
}
.dropdown li { margin: 0; }
.dropdown a {
  display: block;
  padding: 0.5rem 1rem;
  color: #475569;
  text-decoration: none;
  font-size: 0.88rem;
  transition: background 0.15s, color 0.15s;
}
.dropdown a:hover {
  background: #f1f5f9;
  color: var(--matery-primary);
}

@media (max-width: 768px) {
  .matery-menu {
    gap: 0.8rem;
    font-size: 0.85rem;
    overflow-x: auto;
    white-space: nowrap;
  }
  .matery-nav-inner {
    padding: 0 1rem;
    gap: 0.8rem;
  }
  .matery-brand {
    font-size: 1.15rem;
  }
  .dropdown { left: 0; }
}
</style>