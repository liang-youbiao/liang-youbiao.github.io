<script setup lang="ts">
import SystemShell from '@/components/SystemShell.vue'
import { getKnowledgeNotes } from '@/utils/knowledge'
import { getReviewsByType } from '@/utils/reviews'

const notes = getKnowledgeNotes('mysystem')
const reviews = getReviewsByType('mysystem')
</script>

<template>
  <SystemShell
    domain="mysystem"
    title="成长系统"
    subtitle="方法论 + 实战记录 —— 把系统本身当作一门手艺打磨"
    :knowledge-notes="notes"
    :reviews="reviews"
  />
</template>