<script setup lang="ts">
import SystemShell from '@/components/SystemShell.vue'
import { getKnowledgeNotes } from '@/utils/knowledge'
import { getReviewsByType } from '@/utils/reviews'

const notes = getKnowledgeNotes('learning')
const reviews = getReviewsByType('learning')
</script>

<template>
  <SystemShell
    domain="learning"
    title="学习"
    subtitle="方法论 + 实战记录 —— 让输入变成能力"
    :knowledge-notes="notes"
    :reviews="reviews"
  />
</template>
