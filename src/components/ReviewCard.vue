<script setup lang="ts">
import { computed } from 'vue'
import type { ReviewNote } from '@/types/content'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ review: ReviewNote; isLast?: boolean }>()
defineEmits<{ (e: 'expand'): void }>()

const STATUS_LABEL: Record<string, string> = {
  seedling: '🌱 萌芽',
  growing: '🌿 成长',
  mature: '🌳 成熟',
}

const html = computed(() => renderMarkdown(props.review.content))
</script>

<template>
  <details class="review-card" :class="review.status || ''">
    <summary>
      <div class="title-row">
        <h4>{{ review.title }}</h4>
        <span v-if="review.status" class="status">{{ STATUS_LABEL[review.status] }}</span>
      </div>
      <div class="meta">
        <span v-if="review.period">📆 {{ review.period }}</span>
        <span v-if="review.updated">更新 {{ review.updated }}</span>
      </div>
    </summary>
    <div class="content" v-html="html"></div>
  </details>
</template>

<style scoped>
.review-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.review-card[open] { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); }
.review-card summary {
  padding: 0.75rem 1rem;
  cursor: pointer;
  list-style: none;
}
.review-card summary::-webkit-details-marker { display: none; }
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
  background: #f1f5f9;
  color: #475569;
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
.content :deep(ul), .content :deep(ol) { padding-left: 1.25rem; }
</style>
