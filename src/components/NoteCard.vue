<script setup lang="ts">
import type { KnowledgeNote } from '@/utils/knowledge'

defineProps<{ note: KnowledgeNote }>()

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '深入',
}
const STATUS_LABEL: Record<string, string> = {
  seedling: '🌱 萌芽',
  growing: '🌿 成长',
  mature: '🌳 成熟',
}
</script>

<template>
  <RouterLink :to="note.url" class="note-card">
    <h4 class="title">{{ note.title }}</h4>
    <div class="badges">
      <span v-if="note.difficulty" class="badge diff" :class="note.difficulty">{{ DIFFICULTY_LABEL[note.difficulty] }}</span>
      <span v-if="note.status" class="badge status" :class="note.status">{{ STATUS_LABEL[note.status] }}</span>
    </div>
    <div v-if="note.tags?.length" class="tags">
      <span v-for="t in note.tags" :key="t" class="tag">#{{ t }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.note-card {
  display: block;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.note-card:hover {
  transform: translateY(-1px);
  border-color: var(--matery-primary, #49b1f5);
}
.title { font-size: 1rem; margin: 0 0 0.5rem; font-weight: 600; }
.badges { display: flex; gap: 0.4rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.badge { font-size: 0.72rem; padding: 0.1rem 0.4rem; border-radius: 4px; }
.diff.beginner { background: #dbeafe; color: #1e40af; }
.diff.intermediate { background: #fef3c7; color: #92400e; }
.diff.advanced { background: #fee2e2; color: #991b1b; }
.status.seedling { background: #f0fdf4; color: #166534; }
.status.growing { background: #ecfeff; color: #155e75; }
.status.mature { background: #faf5ff; color: #6b21a8; }
.tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.tag { font-size: 0.72rem; color: #64748b; }
</style>
