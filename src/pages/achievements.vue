<script setup lang="ts">
import { computed, ref } from 'vue'
import Banner from '@/components/Banner.vue'
import { getAllAchievements } from '@/utils/achievements'
import { getGoals } from '@/utils/goals'

const all = getAllAchievements()
const DEFAULT_COUNT = 10
const expanded = ref(false)
const visible = computed(() =>
  expanded.value ? all : all.slice(0, DEFAULT_COUNT),
)
function toggle() { expanded.value = !expanded.value }

type Tab = 'achievements' | 'stage' | 'challenge'
const tab = ref<Tab>('achievements')

const goals = getGoals()
const stagesByYear = computed(() => {
  const m: Record<number, typeof goals.stages> = {}
  for (const g of goals.stages) {
    ;(m[g.year] ??= []).push(g)
  }
  return m
})
const stageYears = computed(() =>
  Object.keys(stagesByYear.value)
    .map(Number)
    .sort((a, b) => b - a),
)
function yearProgress(year: number) {
  const list = stagesByYear.value[year] || []
  const done = list.filter((g) => g.done).length
  return { done, total: list.length, pct: list.length ? (done / list.length) * 100 : 0 }
}
function difficultyColor(d: number): string {
  return d >= 5 ? '#dc2626' : d >= 4 ? '#ea580c' : d >= 3 ? '#ca8a04' : d >= 2 ? '#0891b2' : '#64748b'
}
</script>

<template>
  <div>
    <Banner title="成就 & 目标" subtitle="自我肯定 + 阶段性目标 + 挑战目标" height="post" />

    <article class="matery-container">
      <nav class="tab-bar" aria-label="成就/目标切换">
        <button
          :class="['tab', { active: tab === 'achievements' }]"
          @click="tab = 'achievements'"
        >
          🏆 成就
          <span class="count">{{ all.length }}</span>
        </button>
        <button
          :class="['tab', { active: tab === 'stage' }]"
          @click="tab = 'stage'"
        >
          📅 阶段性目标
          <span class="count">{{ goals.stages.length }}</span>
        </button>
        <button
          :class="['tab', { active: tab === 'challenge' }]"
          @click="tab = 'challenge'"
        >
          🔥 挑战目标
          <span class="count">{{ goals.challenges.length }}</span>
        </button>
      </nav>

      <!-- 成就视图 -->
      <section v-show="tab === 'achievements'">
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
      </section>

      <!-- 阶段性目标视图 -->
      <section v-show="tab === 'stage'">
        <div v-if="!goals.stages.length" class="empty">
          还没阶段性目标。去 <code>src/content/goals.md</code> 添加。
        </div>
        <div v-for="year in stageYears" :key="year" class="year-block">
          <header class="year-head">
            <span class="year">{{ year }}</span>
            <span class="progress-text">{{ yearProgress(year).done }} / {{ yearProgress(year).total }}</span>
          </header>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: yearProgress(year).pct + '%' }"
            />
          </div>
          <ul class="goal-list">
            <li
              v-for="g in stagesByYear[year]"
              :key="g.title"
              :class="{ done: g.done }"
            >
              <span class="check" aria-hidden="true">{{ g.done ? '✓' : '○' }}</span>
              <span class="text">{{ g.title }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- 挑战目标视图 -->
      <section v-show="tab === 'challenge'">
        <div v-if="!goals.challenges.length" class="empty">
          还没挑战目标。去 <code>src/content/goals.md</code> 添加。
        </div>
        <div class="challenge-grid">
          <article
            v-for="g in goals.challenges"
            :key="g.title"
            :class="['challenge-card', { done: g.done }]"
          >
            <div class="difficulty" :title="`难度 ${g.difficulty} / 5`">
              <span
                v-for="i in 5"
                :key="i"
                :class="['star', { filled: i <= g.difficulty }]"
                :style="i <= g.difficulty ? { color: difficultyColor(g.difficulty) } : null"
              >★</span>
            </div>
            <div class="card-title">{{ g.title }}</div>
            <div class="card-status">
              <span class="badge" :class="g.done ? 'done' : 'pending'">
                {{ g.done ? '已达成' : '挑战中' }}
              </span>
            </div>
          </article>
        </div>
      </section>
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

/* Tab 切换器 */
.tab-bar {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.tab {
  background: none;
  border: none;
  padding: 0.65rem 1.1rem;
  font-size: 0.95rem;
  color: #64748b;
  cursor: pointer;
  position: relative;
  border-radius: 8px 8px 0 0;
  transition: color 0.18s ease;
}
.tab:hover { color: #1e293b; }
.tab.active {
  color: var(--matery-primary, #49b1f5);
  font-weight: 600;
}
.tab.active::after {
  content: '';
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: -1px;
  height: 2px;
  background: var(--matery-primary, #49b1f5);
  border-radius: 2px 2px 0 0;
}
.count {
  display: inline-block;
  margin-left: 0.35rem;
  padding: 0.05rem 0.45rem;
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 999px;
}
.tab.active .count {
  background: color-mix(in srgb, var(--matery-primary, #49b1f5) 14%, transparent);
  color: var(--matery-primary, #49b1f5);
}

/* 成就时间线 */
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
.timeline .item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 2rem;
  align-items: center;
  padding: 0.85rem 0;
  position: relative;
}
.timeline .item::before {
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
.timeline .item:first-child::before {
  border-color: #49b1f5;
  background: #49b1f5;
  box-shadow: 0 0 0 4px rgba(73, 177, 245, 0.18);
}
.timeline .dot {
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 0.82rem;
  color: #64748b;
  text-align: right;
  padding-right: 0.5rem;
}
.timeline .item:first-child .dot {
  color: #49b1f5;
  font-weight: 600;
}
.timeline .title {
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

/* 目标视图 */
.year-block {
  margin-bottom: 1.25rem;
  padding: 0.9rem 1.1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}
.year-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}
.year {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}
.progress-text {
  font-size: 0.78rem;
  color: #64748b;
  font-family: 'SF Mono', Consolas, monospace;
}
.progress-bar {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.65rem;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #49b1f5 0%, #16a34a 100%);
  border-radius: 3px;
  transition: width 0.4s ease;
}
.goal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
}
.goal-list li {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  font-size: 0.9rem;
  color: #1e293b;
  line-height: 1.55;
}
.goal-list li.done .text {
  text-decoration: line-through;
  color: #94a3b8;
}
.goal-list .check {
  width: 1.1rem;
  height: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 0.75rem;
  flex-shrink: 0;
}
.goal-list li.done .check {
  background: #16a34a;
  color: #fff;
}

.challenge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
  margin-bottom: 2rem;
}
.challenge-card {
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: transform 0.18s ease, border-color 0.18s ease;
  position: relative;
}
.challenge-card:hover {
  transform: translateY(-2px);
  border-color: var(--matery-primary, #49b1f5);
}
.challenge-card.done {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.difficulty {
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-bottom: 0.45rem;
}
.star {
  color: #e5e7eb;
  font-size: 1rem;
}
.star.filled {
  text-shadow: 0 0 4px color-mix(in srgb, currentColor 30%, transparent);
}
.card-title {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 0.55rem;
  line-height: 1.5;
}
.challenge-card.done .card-title {
  text-decoration: line-through;
  color: #64748b;
}
.badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  font-size: 0.72rem;
  border-radius: 999px;
  font-weight: 500;
}
.badge.done {
  background: #16a34a;
  color: #fff;
}
.badge.pending {
  background: #fef3c7;
  color: #b45309;
}

@media (max-width: 600px) {
  .timeline::before {
    left: 80px;
  }
  .timeline .item {
    grid-template-columns: 70px 1fr;
    gap: 1.25rem;
  }
  .timeline .item::before {
    left: 75px;
  }
  .timeline .dot {
    font-size: 0.75rem;
  }
  .challenge-grid {
    grid-template-columns: 1fr;
  }
  .tab {
    padding: 0.55rem 0.85rem;
    font-size: 0.88rem;
  }
}
</style>
