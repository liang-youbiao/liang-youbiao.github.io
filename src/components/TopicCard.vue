<script setup lang="ts">
defineProps<{
  domain: string
  topic: string
  count: number
}>()
</script>

<template>
  <RouterLink :to="`/knowledge/${domain}/${topic}/`" class="topic-card">
    <div class="title">{{ topic }}</div>
    <div class="count">{{ count }} 篇</div>
  </RouterLink>
</template>

<style scoped>
.topic-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.topic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
.title { font-size: 1.05rem; font-weight: 600; }
.count { font-size: 0.85rem; color: #94a3b8; }
</style>
