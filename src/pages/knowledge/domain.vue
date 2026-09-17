<script setup lang="ts">
import { computed } from 'vue'
import Banner from '@/components/Banner.vue'
import KnowledgeBreadcrumb from '@/components/KnowledgeBreadcrumb.vue'
import TopicCard from '@/components/TopicCard.vue'
import NoteCard from '@/components/NoteCard.vue'
import { getKnowledgeNotes, getKnowledgeTopics } from '@/utils/knowledge'

const props = defineProps<{ domain: string }>()

const DOMAIN_NAMES: Record<string, string> = {
  thinking: '思考',
  learning: '学习',
  execution: '执行',
  training: '训练',
}

const topics = computed(() => getKnowledgeTopics(props.domain))
const notes = computed(() => getKnowledgeNotes(props.domain))
const domainName = computed(() => DOMAIN_NAMES[props.domain] || props.domain)
</script>

<template>
  <div>
    <Banner :title="`${domainName} · 知识库`" :subtitle="`${notes.length} 篇笔记 · ${topics.length} 个子主题`" height="post" />

    <article class="matery-container">
      <KnowledgeBreadcrumb :domain="domain" />

      <section v-if="topics.length" class="topics-section">
        <h2>子主题</h2>
        <div class="grid topics-grid">
          <TopicCard v-for="t in topics" :key="t.topic" :domain="domain" :topic="t.topic" :count="t.count" />
        </div>
      </section>

      <section class="notes-section">
        <h2>全部笔记</h2>
        <div class="grid notes-grid">
          <NoteCard v-for="n in notes" :key="n.slug" :note="n" />
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
section { margin: 1.5rem 0 2rem; }
h2 { font-size: 1.15rem; margin-bottom: 0.75rem; color: #475569; }
.grid { display: grid; gap: 0.85rem; }
.topics-grid { grid-template-columns: repeat(4, 1fr); }
.notes-grid { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 900px) { .topics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .topics-grid, .notes-grid { grid-template-columns: 1fr; }
}
</style>
