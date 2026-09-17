<script setup lang="ts">
import type { KnowledgeDomainSummary } from '@/utils/knowledge'

const props = defineProps<{ summary: KnowledgeDomainSummary }>()

const ICONS: Record<string, string> = {
  thinking: '🧠',
  learning: '📘',
  execution: '⚡',
  training: '💪',
}

const NAMES: Record<string, { cn: string; en: string; desc: string }> = {
  thinking: { cn: '思考', en: 'Thinking', desc: '逻辑、决策、批判性思维' },
  learning: { cn: '学习', en: 'Learning', desc: '方法、专注、记忆、时间管理' },
  execution: { cn: '执行', en: 'Execution', desc: '效率、状态、精力管理' },
  training: { cn: '训练', en: 'Training', desc: '身体训练方法与日志' },
}

const COLOR: Record<string, string> = {
  thinking: '#7c3aed',
  learning: '#2563eb',
  execution: '#0891b2',
  training: '#ea580c',
}

const icon = ICONS[props.summary.domain] || '📂'
const name = NAMES[props.summary.domain] || { cn: props.summary.domain, en: '', desc: '' }
const color = COLOR[props.summary.domain] || '#64748b'
</script>

<template>
  <RouterLink :to="`/knowledge/${summary.domain}/`" class="domain-card">
    <div class="icon" :style="{ background: color + '15', color }">{{ icon }}</div>
    <div class="body">
      <h3>{{ name.cn }} <span class="en">{{ name.en }}</span></h3>
      <p class="desc">{{ name.desc }}</p>
      <div class="topics">
        <span v-for="t in summary.topics" :key="t.topic" class="topic-chip">{{ t.topic }} · {{ t.count }}</span>
      </div>
      <div class="meta">
        <span class="count">{{ summary.count }} 篇笔记</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.domain-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.domain-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--matery-primary, #49b1f5);
}
.icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}
.body { flex: 1; min-width: 0; }
h3 {
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.en { font-size: 0.85rem; color: #94a3b8; font-weight: 500; }
.desc { color: #64748b; font-size: 0.9rem; margin: 0 0 0.75rem; }
.topics { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
.topic-chip {
  font-size: 0.78rem;
  padding: 0.15rem 0.5rem;
  background: #f1f5f9;
  border-radius: 4px;
  color: #475569;
}
.meta { font-size: 0.85rem; color: #94a3b8; }
.count { font-weight: 600; color: #475569; }
</style>
