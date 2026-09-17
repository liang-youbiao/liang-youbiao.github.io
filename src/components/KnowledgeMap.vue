<script setup lang="ts">
import type { KnowledgeDomainSummary } from '@/utils/knowledge'

defineProps<{ domains: KnowledgeDomainSummary[] }>()

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
</script>

<template>
  <div class="kmap">
    <RouterLink
      v-for="d in domains"
      :key="d.domain"
      :to="`/knowledge/${d.domain}/`"
      class="kmap-card"
      :style="{ '--c': COLOR[d.domain] || '#64748b' }"
    >
      <div class="kmap-icon">{{ ICONS[d.domain] || '📂' }}</div>
      <div class="kmap-body">
        <h3>{{ NAMES[d.domain]?.cn || d.domain }} <span class="en">{{ NAMES[d.domain]?.en }}</span></h3>
        <p>{{ NAMES[d.domain]?.desc }}</p>
        <div class="kmap-topics">
          <span v-for="t in d.topics" :key="t.topic">{{ t.topic }} · {{ t.count }}</span>
        </div>
      </div>
      <div class="kmap-count">{{ d.count }} 篇笔记</div>
    </RouterLink>
  </div>
</template>

<style scoped>
.kmap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.kmap-card {
  --c: #64748b;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.kmap-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--c);
}
.kmap-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--c) 14%, transparent);
  color: var(--c);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kmap-body { min-width: 0; }
h3 {
  margin: 0 0 0.2rem;
  font-size: 1.1rem;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}
.en { font-size: 0.78rem; color: #94a3b8; font-weight: 500; }
.kmap-body p { margin: 0 0 0.4rem; font-size: 0.85rem; color: #64748b; }
.kmap-topics { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.kmap-topics span {
  font-size: 0.72rem;
  padding: 0.1rem 0.4rem;
  background: #f1f5f9;
  border-radius: 4px;
  color: #475569;
}
.kmap-count {
  font-size: 0.85rem;
  color: var(--c);
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}
@media (max-width: 768px) {
  .kmap { grid-template-columns: 1fr; }
}
</style>