<script setup lang="ts">
import type { KnowledgeNote, ReviewNote } from '@/types/content'
import Banner from '@/components/Banner.vue'
import ReviewTimeline from '@/components/ReviewTimeline.vue'

defineProps<{
  domain: string
  title: string
  subtitle: string
  knowledgeNotes: KnowledgeNote[]
  reviews: ReviewNote[]
}>()
</script>

<template>
  <div>
    <Banner :title="title" :subtitle="subtitle" height="post" />

    <article class="matery-container">
      <div class="system-grid">
        <section class="left">
          <h2 class="section-title">📚 方法论</h2>
          <p v-if="!knowledgeNotes.length" class="empty">
            该领域还没有方法论笔记,去 <code>src/content/knowledge/{{ domain }}/</code> 添加。
          </p>
          <div v-else class="note-list">
            <RouterLink v-for="n in knowledgeNotes" :key="n.slug" :to="n.url" class="note-link">
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
          <ReviewTimeline :reviews="reviews" :domain="domain" />
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.system-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}
.section-title { font-size: 1.05rem; color: #475569; margin-bottom: 0.75rem; font-weight: 600; }
.empty { color: #94a3b8; padding: 2rem 1rem; text-align: center; }
.empty code { background: #f1f5f9; padding: 0.1rem 0.4rem; border-radius: 4px; }
.note-list { display: flex; flex-direction: column; gap: 0.75rem; }
.note-link {
  padding: 0.85rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  background: #fff;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.note-link:hover { transform: translateY(-1px); border-color: var(--matery-primary, #49b1f5); }
.note-link h3 { font-size: 1rem; margin: 0 0 0.4rem; }
.note-meta { display: flex; gap: 0.5rem; font-size: 0.78rem; color: #94a3b8; }
.note-desc { font-size: 0.85rem; color: #64748b; margin: 0.4rem 0 0; line-height: 1.5; }
@media (max-width: 900px) { .system-grid { grid-template-columns: 1fr; } }
</style>
