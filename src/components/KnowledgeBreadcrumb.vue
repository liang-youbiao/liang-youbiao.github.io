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
  mysystem: '成长系统',
}
</script>

<template>
  <nav class="kb-breadcrumb" aria-label="breadcrumb">
    <RouterLink to="/knowledge/" class="crumb crumb-home" title="返回知识地图">
      <span class="ico">🗺️</span>
      <span class="lbl">知识地图</span>
    </RouterLink>

    <template v-if="domain">
      <span class="sep" aria-hidden="true">›</span>
      <RouterLink :to="`/knowledge/${domain}/`" class="crumb">
        <span class="lbl">{{ DOMAIN_NAMES[domain] || domain }}</span>
      </RouterLink>
    </template>

    <template v-if="topic">
      <span class="sep" aria-hidden="true">›</span>
      <span class="crumb crumb-static" :title="topic">
        <span class="ico">🏷️</span>
        <span class="lbl">{{ topic }}</span>
      </span>
    </template>

    <template v-if="noteTitle">
      <span class="sep" aria-hidden="true">›</span>
      <span class="crumb crumb-current" :title="noteTitle">
        <span class="ico">📄</span>
        <span class="lbl">{{ noteTitle }}</span>
      </span>
    </template>
  </nav>
</template>

<style scoped>
.kb-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0 0 1.25rem;
  padding: 0.55rem 0.85rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  font-size: 0.85rem;
  line-height: 1.4;
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  color: var(--matery-primary, #49b1f5);
  text-decoration: none;
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
  max-width: 18rem;
  min-width: 0;
}

a.crumb:hover {
  background: color-mix(in srgb, var(--matery-primary, #49b1f5) 12%, transparent);
  color: var(--matery-primary, #49b1f5);
  transform: translateY(-1px);
}

.crumb .ico {
  font-size: 0.95rem;
  line-height: 1;
  flex-shrink: 0;
}

.crumb .lbl {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crumb-static {
  color: #64748b;
  cursor: default;
}

.crumb-current {
  color: #1e293b;
  font-weight: 600;
  background: #f1f5f9;
  cursor: default;
}

.sep {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1;
  user-select: none;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .kb-breadcrumb {
    padding: 0.45rem 0.65rem;
    gap: 0.3rem;
    font-size: 0.8rem;
  }
  .crumb {
    padding: 0.2rem 0.45rem;
    max-width: 12rem;
  }
}
</style>
