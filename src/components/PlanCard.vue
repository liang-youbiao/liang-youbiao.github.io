<script setup lang="ts">
import { computed } from 'vue'
import type { TrainingPlan } from '@/types/content'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ plan: TrainingPlan }>()

const STATUS_LABEL: Record<string, string> = {
  active: '🔥 进行中',
  paused: '⏸ 暂停',
  archived: '📦 已归档',
}

const html = computed(() => renderMarkdown(props.plan.content))
</script>

<template>
  <details class="plan-card" :class="plan.status || ''">
    <summary>
      <div class="title-row">
        <h4>{{ plan.title }}</h4>
        <span v-if="plan.status" class="status">{{ STATUS_LABEL[plan.status] || plan.status }}</span>
      </div>
      <div class="meta">
        <span v-if="plan.category">🏷 {{ plan.category }}</span>
        <span v-if="plan.started">📅 开始 {{ plan.started }}</span>
      </div>
    </summary>
    <div class="content" v-html="html"></div>
  </details>
</template>

<style scoped>
.plan-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.plan-card summary {
  padding: 0.75rem 1rem;
  cursor: pointer;
  list-style: none;
}
.plan-card summary::-webkit-details-marker { display: none; }
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.title-row h4 { margin: 0; font-size: 0.95rem; font-weight: 600; }
.status {
  font-size: 0.72rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: #fff7ed;
  color: #c2410c;
  white-space: nowrap;
}
.meta {
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 0.3rem;
  display: flex;
  gap: 0.75rem;
}
.content {
  padding: 0 1rem 0.85rem;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.6;
}
.content :deep(h1), .content :deep(h2), .content :deep(h3) { font-size: 1rem; margin: 0.6rem 0 0.4rem; }
.content :deep(p) { margin: 0.4rem 0; }
</style>
