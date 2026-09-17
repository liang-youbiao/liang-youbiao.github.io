<script setup lang="ts">
import SystemShell from '@/components/SystemShell.vue'
import { getKnowledgeNotes } from '@/utils/knowledge'
import { getReviewsByType } from '@/utils/reviews'

const notes = getKnowledgeNotes('execution')
const reviews = getReviewsByType('execution')
</script>

<template>
  <SystemShell
    domain="execution"
    title="执行"
    subtitle="方法论 + 实战记录 —— 把想法变成结果"
    :knowledge-notes="notes"
    :reviews="reviews"
  />
</template>
