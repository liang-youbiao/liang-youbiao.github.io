<script setup lang="ts">
defineProps<{
  domain?: string
  topic?: string
  noteTitle?: string
}>()

const DOMAIN_NAMES: Record<string, string> = {
  thinking: '思考',
  learning: '学习',
  execution: '执行',
  training: '训练',
}
</script>

<template>
  <nav class="kb-breadcrumb">
    <RouterLink to="/knowledge/">知识地图</RouterLink>
    <template v-if="domain">
      <span class="sep">/</span>
      <RouterLink :to="`/knowledge/${domain}/`">{{ DOMAIN_NAMES[domain] || domain }}</RouterLink>
    </template>
    <template v-if="topic">
      <span class="sep">/</span>
      <span>{{ topic }}</span>
    </template>
    <template v-if="noteTitle">
      <span class="sep">/</span>
      <span class="current">{{ noteTitle }}</span>
    </template>
  </nav>
</template>

<style scoped>
.kb-breadcrumb {
  font-size: 0.88rem;
  color: #64748b;
  margin-bottom: 1rem;
}
.kb-breadcrumb a {
  color: var(--matery-primary, #49b1f5);
  text-decoration: none;
}
.kb-breadcrumb a:hover { text-decoration: underline; }
.sep { margin: 0 0.4rem; color: #cbd5e1; }
.current { color: #475569; font-weight: 500; }
</style>
