<script setup lang="ts">
import SystemShell from '@/components/SystemShell.vue'
import { getKnowledgeNotes } from '@/utils/knowledge'
import { getReviewsByType } from '@/utils/reviews'

const notes = getKnowledgeNotes('thinking')
const reviews = getReviewsByType('thinking')
</script>

<template>
  <SystemShell
    domain="thinking"
    title="思考"
    subtitle="方法论 + 实战记录 —— 让思考成为习惯"
    :knowledge-notes="notes"
    :reviews="reviews"
  />
</template>
