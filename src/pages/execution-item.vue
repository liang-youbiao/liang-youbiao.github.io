<script setup lang="ts">
import { computed } from 'vue'
import Banner from '@/components/Banner.vue'
import KnowledgeBreadcrumb from '@/components/KnowledgeBreadcrumb.vue'
import { getExecutionItem } from '@/utils/execution-items'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  kind: 'training' | 'punish' | 'reward'
  slug: string
}>()

const item = computed(() => getExecutionItem(props.kind, props.slug))
const html = computed(() => (item.value ? renderMarkdown(item.value.content) : ''))

const KIND_ICON: Record<'training' | 'punish' | 'reward', string> = {
  training: '🏋️',
  punish: '⚠️',
  reward: '🎁',
}
const KIND_CN: Record<'training' | 'punish' | 'reward', string> = {
  training: '执行力训练',
  punish: '惩罚机制',
  reward: '奖赏机制',
}
</script>

<template>
  <article v-if="item">
    <Banner :title="item.title" height="post" />

    <div class="kb-layout">
      <div class="kb-container">
        <div class="card">
          <KnowledgeBreadcrumb
            :domain="KIND_CN[kind]"
            :note-title="KIND_ICON[kind] + ' ' + item.title"
          />

          <p v-if="item.description" class="meta">{{ item.description }}</p>

          <div class="card-content kb-content" v-html="html"></div>

          <div class="back">
            <RouterLink :to="`/execution/#${kind}`">← 返回执行体系</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </article>

  <section v-else class="not-found">
    <h1>未找到该条目</h1>
    <RouterLink to="/execution/">返回执行体系</RouterLink>
  </section>
</template>

<style scoped>
.kb-layout {
  display: grid;
  grid-template-columns: minmax(0, 860px);
  gap: 1.75rem;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.kb-container { width: 100%; }
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin: 1.5rem 0;
}
.card-content {
  padding: 1.5rem 2.5rem 2rem;
}
.meta {
  margin: 0 2.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.9rem;
}
.kb-content :deep(h1) { font-size: 1.5rem; margin: 1.5rem 0 1rem; }
.kb-content :deep(h2) { font-size: 1.2rem; margin: 1.5rem 0 0.75rem; }
.kb-content :deep(h3) { font-size: 1.05rem; margin: 1.25rem 0 0.6rem; }
.kb-content :deep(p) { line-height: 1.7; margin: 0.6rem 0; color: #1e293b; }
.kb-content :deep(ul), .kb-content :deep(ol) { padding-left: 1.5rem; line-height: 1.7; }
.kb-content :deep(li) { margin: 0.25rem 0; }
.kb-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.88rem;
}
.kb-content :deep(th), .kb-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.65rem;
  text-align: left;
}
.kb-content :deep(th) {
  background: #f8fafc;
  font-weight: 600;
}
.kb-content :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--matery-primary, #49b1f5);
  background: #f0f9ff;
  color: #475569;
  border-radius: 0 6px 6px 0;
}
.back {
  padding: 1rem 2.5rem 2rem;
  border-top: 1px solid #f0f0f0;
}
.back a {
  color: var(--matery-primary, #49b1f5);
  text-decoration: none;
}
.back a:hover { text-decoration: underline; }
.not-found { text-align: center; padding: 5rem 1rem; }
.not-found a { color: var(--matery-primary, #49b1f5); }
@media (max-width: 640px) {
  .kb-layout { padding: 0 1rem; }
  .meta { margin: 0 1.5rem; }
  .card-content { padding: 1.25rem 1.5rem 1.5rem; }
}
</style>
