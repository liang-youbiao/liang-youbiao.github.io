<script setup lang="ts">
defineProps<{
  domain: string
  title: string
  subtitle: string
  icon: string
  color: string
  noteCount: number
  extra?: string
}>()
</script>

<template>
  <RouterLink :to="`/${domain}/`" class="system-card" :style="{ '--accent': color }">
    <div class="icon">{{ icon }}</div>
    <div class="body">
      <h3>{{ title }}</h3>
      <p class="sub">{{ subtitle }}</p>
      <div class="meta">
        <span class="num">{{ noteCount }}</span>
        <span class="unit">{{ extra }}</span>
      </div>
    </div>
    <div class="arrow">→</div>
  </RouterLink>
</template>

<style scoped>
.system-card {
  --accent: #409eff;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.system-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--accent);
  opacity: 0.7;
  transition: opacity 0.25s;
}
.system-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--accent);
}
.system-card:hover::before { opacity: 1; }
.icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.body { flex: 1; min-width: 0; }
h3 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  color: #1e293b;
}
.sub {
  font-size: 0.88rem;
  color: #64748b;
  margin: 0 0 0.6rem;
}
.meta {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}
.num {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
}
.unit { font-size: 0.82rem; color: #94a3b8; }
.arrow {
  font-size: 1.4rem;
  color: #cbd5e1;
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}
.system-card:hover .arrow { transform: translateX(4px); color: var(--accent); }
@media (max-width: 640px) {
  .system-card { padding: 1rem 1.25rem; gap: 0.85rem; }
  .icon { width: 50px; height: 50px; font-size: 1.5rem; }
  h3 { font-size: 1.05rem; }
  .num { font-size: 1.2rem; }
}
</style>