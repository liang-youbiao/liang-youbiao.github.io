<script setup lang="ts">
import { ref } from 'vue'
import Banner from '@/components/Banner.vue'
import ReviewTimeline from '@/components/ReviewTimeline.vue'
import { getKnowledgeNotes } from '@/utils/knowledge'
import { getReviewsByType } from '@/utils/reviews'

const notes = getKnowledgeNotes('execution')
const reviews = getReviewsByType('execution')

type Tab = 'system' | 'training' | 'punish' | 'reward'
const tab = ref<Tab>('system')
</script>

<template>
  <div>
    <Banner
      title="执行体系"
      subtitle="方法论 + 实战记录 —— 把想法变成结果"
      height="post"
    />

    <article class="matery-container">
      <nav class="tab-bar" aria-label="执行体系切换">
        <button
          :class="['tab', { active: tab === 'system' }]"
          @click="tab = 'system'"
        >
          ⚙️ 执行体系
          <span class="count">{{ notes.length + reviews.length }}</span>
        </button>
        <button
          :class="['tab', { active: tab === 'training' }]"
          @click="tab = 'training'"
        >
          🏋️ 执行力训练
          <span class="count">0</span>
        </button>
        <button
          :class="['tab', { active: tab === 'punish' }]"
          @click="tab = 'punish'"
        >
          ⚠️ 惩罚机制
          <span class="count">0</span>
        </button>
        <button
          :class="['tab', { active: tab === 'reward' }]"
          @click="tab = 'reward'"
        >
          🎁 奖赏机制
          <span class="count">0</span>
        </button>
      </nav>

      <!-- 执行体系:方法论 + 实战记录 -->
      <section v-show="tab === 'system'" class="system-grid">
        <section class="left">
          <h2 class="section-title">📚 方法论</h2>
          <p v-if="!notes.length" class="empty">
            该领域还没有方法论笔记,去 <code>src/content/knowledge/execution/</code> 添加。
          </p>
          <div v-else class="note-list">
            <RouterLink
              v-for="n in notes"
              :key="n.slug"
              :to="n.url"
              class="note-link"
            >
              <h3>{{ n.title }}</h3>
              <div class="note-meta">
                <span v-if="n.difficulty">{{ n.difficulty }}</span>
                <span v-if="n.status">{{ n.status }}</span>
              </div>
              <p v-if="n.description" class="note-desc">{{ n.description }}</p>
            </RouterLink>
          </div>
        </section>

        <section class="right">
          <h2 class="section-title">📋 实战记录</h2>
          <ReviewTimeline :reviews="reviews" domain="execution" />
        </section>
      </section>

      <!-- 执行力训练 -->
      <section v-show="tab === 'training'">
        <p class="empty">
          还没执行力训练记录。去 <code>src/content/knowledge/execution/training/</code> 添加。
        </p>
      </section>

      <!-- 惩罚机制 -->
      <section v-show="tab === 'punish'">
        <p class="empty">
          还没惩罚机制记录。去 <code>src/content/knowledge/execution/punish/</code> 添加。
        </p>
      </section>

      <!-- 奖赏机制 -->
      <section v-show="tab === 'reward'">
        <p class="empty">
          还没奖赏机制记录。去 <code>src/content/knowledge/execution/reward/</code> 添加。
        </p>
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

/* Tab 切换器(参考 achievements.vue) */
.tab-bar {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
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
  white-space: nowrap;
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

/* 执行体系:方法论 + 实战记录 */
.system-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}
.section-title {
  font-size: 1.05rem;
  color: #475569;
  margin-bottom: 0.75rem;
  font-weight: 600;
}
.note-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.note-link {
  padding: 0.85rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background: #fff;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.note-link:hover {
  transform: translateY(-1px);
  border-color: var(--matery-primary, #49b1f5);
}
.note-link h3 {
  font-size: 1rem;
  margin: 0 0 0.4rem;
}
.note-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: #94a3b8;
}
.note-desc {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0.4rem 0 0;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .system-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .tab { padding: 0.55rem 0.85rem; font-size: 0.88rem; }
}
</style>
