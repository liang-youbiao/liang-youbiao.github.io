<script setup lang="ts">
import { computed } from 'vue'
import Banner from '@/components/Banner.vue'
import KnowledgeBreadcrumb from '@/components/KnowledgeBreadcrumb.vue'
import KnowledgeMeta from '@/components/KnowledgeMeta.vue'
import TocSidebar from '@/components/TocSidebar.vue'
import Lightbox from '@/components/Lightbox.vue'
import { getKnowledgeNote, getKnowledgeNotes } from '@/utils/knowledge'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  domain: string
  topic: string
  slug: string
}>()

const note = computed(() => getKnowledgeNote(props.domain, props.topic, props.slug))
const html = computed(() => (note.value ? renderMarkdown(note.value.content) : ''))
const relatedNotes = computed(() => {
  if (!note.value) return []
  return getKnowledgeNotes(props.domain).filter((n) => n.slug !== props.slug).slice(0, 4)
})
</script>

<template>
  <article v-if="note">
    <Banner :title="note.title" height="post" />

    <div class="kb-layout">
      <aside class="kb-toc"><TocSidebar :html="html" /></aside>

      <div class="kb-container">
        <div class="card">
          <KnowledgeBreadcrumb :domain="domain" :topic="topic" :note-title="note.title" />
          <KnowledgeMeta :note="note" />

          <div class="card-content kb-content" v-html="html"></div>

          <div v-if="relatedNotes.length" class="related">
            <h3>同领域其他笔记</h3>
            <ul>
              <li v-for="n in relatedNotes" :key="n.slug">
                <RouterLink :to="n.url">{{ n.title }}</RouterLink>
              </li>
            </ul>
          </div>

          <div class="back">
            <RouterLink to="/knowledge/">← 返回知识地图</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <Lightbox />
  </article>

  <section v-else class="not-found">
    <h1>笔记未找到</h1>
    <RouterLink to="/knowledge/">返回知识地图</RouterLink>
  </section>
</template>

<style scoped>
.kb-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 860px) 1fr;
  gap: 1.75rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  align-items: start;
}
.kb-toc { position: sticky; top: 80px; align-self: start; }
.kb-toc :deep(.toc-sidebar) { width: 100%; max-height: calc(100vh - 100px); }
.kb-container { width: 100%; }
.kb-content :deep(h2) { margin-top: 1.5rem; }
.related {
  padding: 1.5rem 2.5rem;
  border-top: 1px solid #f0f0f0;
  background: #f8fafc;
}
.related h3 { font-size: 1rem; margin: 0 0 0.75rem; color: #475569; }
.related ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.4rem; }
.related a { color: var(--matery-primary, #49b1f5); text-decoration: none; }
.related a:hover { text-decoration: underline; }
.back { padding: 1rem 2.5rem 2rem; }
.back a { color: var(--matery-primary, #49b1f5); text-decoration: none; }
.back a:hover { text-decoration: underline; }
.not-found { text-align: center; padding: 5rem 1rem; }
.not-found a { color: var(--matery-primary, #49b1f5); text-decoration: none; }
@media (max-width: 1100px) {
  .kb-layout { grid-template-columns: 1fr; max-width: 860px; }
  .kb-toc { display: none; }
}
@media (max-width: 640px) {
  .kb-layout { padding: 0 1rem; }
}
</style>
