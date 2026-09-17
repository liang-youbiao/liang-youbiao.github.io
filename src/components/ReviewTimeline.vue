<script setup lang="ts">
import type { ReviewNote } from '@/types/content'
import ReviewCard from './ReviewCard.vue'

defineProps<{ reviews: ReviewNote[]; domain: string }>()
</script>

<template>
  <div v-if="!reviews.length" class="empty">
    该领域还没有复盘记录,去 <code>src/content/reviews/{{ domain }}/</code> 添加。
  </div>
  <div v-else class="timeline">
    <div v-for="(r, i) in reviews" :key="r.slug" class="timeline-item">
      <div class="dot" :class="r.status || ''"></div>
      <ReviewCard :review="r" :is-last="i === reviews.length - 1" />
    </div>
  </div>
</template>

<style scoped>
.empty { color: #94a3b8; padding: 2rem 1rem; text-align: center; }
.empty code { background: #f1f5f9; padding: 0.1rem 0.4rem; border-radius: 4px; }
.timeline { position: relative; padding-left: 1.5rem; }
.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #e2e8f0;
}
.timeline-item { position: relative; margin-bottom: 0.75rem; }
.dot {
  position: absolute;
  left: -1.5rem;
  top: 0.85rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #cbd5e1;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #cbd5e1;
}
.dot.mature { background: #a855f7; box-shadow: 0 0 0 2px #a855f7; }
.dot.growing { background: #06b6d4; box-shadow: 0 0 0 2px #06b6d4; }
.dot.seedling { background: #22c55e; box-shadow: 0 0 0 2px #22c55e; }
</style>
