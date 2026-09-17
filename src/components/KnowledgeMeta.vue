<script setup lang="ts">
import type { KnowledgeNote } from '@/utils/knowledge'
import { getAllKnowledgeNotes } from '@/utils/knowledge'

const props = defineProps<{ note: KnowledgeNote }>()

const DIFFICULTY: Record<string, { cn: string; cls: string }> = {
  beginner: { cn: '入门', cls: 'diff-beginner' },
  intermediate: { cn: '进阶', cls: 'diff-intermediate' },
  advanced: { cn: '深入', cls: 'diff-advanced' },
}
const STATUS: Record<string, { cn: string; cls: string }> = {
  seedling: { cn: '🌱 萌芽', cls: 'status-seedling' },
  growing: { cn: '🌿 成长', cls: 'status-growing' },
  mature: { cn: '🌳 成熟', cls: 'status-mature' },
}

const allNotes = getAllKnowledgeNotes()
const connectedNotes = (props.note.connections || [])
  .map((slug) => allNotes.find((n) => n.slug === slug))
  .filter((n): n is NonNullable<typeof n> => Boolean(n))
</script>

<template>
  <div class="kb-meta">
    <div class="row">
      <span v-if="note.difficulty" class="badge" :class="DIFFICULTY[note.difficulty]?.cls">
        {{ DIFFICULTY[note.difficulty]?.cn }}
      </span>
      <span v-if="note.status" class="badge" :class="STATUS[note.status]?.cls">
        {{ STATUS[note.status]?.cn }}
      </span>
      <span v-if="note.updated" class="updated">更新于 {{ note.updated }}</span>
    </div>
    <div v-if="note.tags?.length" class="tags">
      <RouterLink v-for="t in note.tags" :key="t" :to="`/knowledge/?tag=${encodeURIComponent(t)}`" class="tag">#{{ t }}</RouterLink>
    </div>
    <div v-if="connectedNotes.length" class="connections">
      <span class="label">相关笔记:</span>
      <RouterLink v-for="n in connectedNotes" :key="n.slug" :to="n.url" class="conn">{{ n.title }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.kb-meta {
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.88rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.badge { font-size: 0.78rem; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 500; }
.diff-beginner { background: #dbeafe; color: #1e40af; }
.diff-intermediate { background: #fef3c7; color: #92400e; }
.diff-advanced { background: #fee2e2; color: #991b1b; }
.status-seedling { background: #f0fdf4; color: #166534; }
.status-growing { background: #ecfeff; color: #155e75; }
.status-mature { background: #faf5ff; color: #6b21a8; }
.updated { color: #94a3b8; font-size: 0.82rem; margin-left: auto; }
.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tag { color: #475569; text-decoration: none; font-size: 0.82rem; padding: 0.1rem 0.4rem; background: #fff; border-radius: 4px; border: 1px solid #e2e8f0; }
.tag:hover { background: #f1f5f9; }
.connections { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; }
.label { color: #64748b; font-weight: 500; }
.conn { color: var(--matery-primary, #49b1f5); text-decoration: none; font-size: 0.85rem; padding: 0.1rem 0.4rem; background: #fff; border-radius: 4px; border: 1px solid #e2e8f0; }
.conn:hover { background: #f1f5f9; }
</style>
