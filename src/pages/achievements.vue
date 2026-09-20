<script setup lang="ts">
import { computed, ref } from 'vue'
import Banner from '@/components/Banner.vue'
import { getAllAchievements } from '@/utils/achievements'

const all = getAllAchievements()
const DEFAULT_COUNT = 10
const expanded = ref(false)
const visible = computed(() =>
  expanded.value ? all : all.slice(0, DEFAULT_COUNT),
)

function toggle() { expanded.value = !expanded.value }
</script>

<template>
  <div>
    <Banner title="成就榜" subtitle="记录让我有成就感的事 —— 按时间倒序" height="post" />

    <article class="matery-container">
      <p v-if="!all.length" class="empty">
        还没记录。去 <code>src/content/achievements.md</code> 添加吧。
      </p>

      <ol v-else class="timeline">
        <li v-for="(a, i) in visible" :key="a.date + '-' + i" class="item">
          <time class="dot" :class="{ latest: i === 0 }">{{ a.date }}</time>
          <span class="title">{{ a.title }}</span>
        </li>
      </ol>

      <div v-if="all.length > DEFAULT_COUNT" class="more">
        <button class="toggle" @click="toggle">
          {{ expanded ? '收起' : `展开更多 (+${all.length - DEFAULT_COUNT})` }}
        </button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.empty {
  color: #94a3b8;
  padding: 3rem 1rem;
  text-align: center;
}
.empty code {
  background: #f1f5f9;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.timeline {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 110px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #49b1f5 0%, #e5e7eb 100%);
}
.item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 2rem;
  align-items: center;
  padding: 0.85rem 0;
  position: relative;
}
.item::before {
  content: '';
  position: absolute;
  left: 105px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #cbd5e1;
  z-index: 1;
}
.item:first-child::before {
  border-color: #49b1f5;
  background: #49b1f5;
  box-shadow: 0 0 0 4px rgba(73, 177, 245, 0.18);
}
.dot {
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 0.82rem;
  color: #64748b;
  text-align: right;
  padding-right: 0.5rem;
}
.item:first-child .dot {
  color: #49b1f5;
  font-weight: 600;
}
.title {
  font-size: 0.95rem;
  color: #1e293b;
  line-height: 1.6;
  padding-left: 1.75rem;
}
.more {
  text-align: center;
  margin: 2rem 0 1rem;
}
.toggle {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #475569;
  padding: 0.55rem 1.5rem;
  border-radius: 999px;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.18s ease;
}
.toggle:hover {
  border-color: var(--matery-primary, #49b1f5);
  color: var(--matery-primary, #49b1f5);
  background: color-mix(in srgb, var(--matery-primary, #49b1f5) 8%, transparent);
}
@media (max-width: 600px) {
  .timeline::before {
    left: 80px;
  }
  .item {
    grid-template-columns: 70px 1fr;
    gap: 1.25rem;
  }
  .item::before {
    left: 75px;
  }
  .dot {
    font-size: 0.75rem;
  }
}
</style>
