<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import DomainCard from '@/components/DomainCard.vue'
import { getKnowledgeDomains } from '@/utils/knowledge'

const domains = getKnowledgeDomains()
const totalNotes = domains.reduce((sum, d) => sum + d.count, 0)
</script>

<template>
  <div>
    <Banner title="知识地图" subtitle="自我提升的方法论与框架沉淀" height="post" />

    <article class="matery-container">
      <p class="intro">共 {{ domains.length }} 个领域 / {{ totalNotes }} 篇笔记 —— 按领域浏览,点击进入查看子主题与笔记。</p>

      <div v-if="domains.length" class="grid">
        <DomainCard v-for="d in domains" :key="d.domain" :summary="d" />
      </div>
      <p v-else class="empty">暂无知识库内容,请到 <code>src/content/knowledge/</code> 添加笔记。</p>
    </article>
  </div>
</template>

<style scoped>
.intro { text-align: center; color: #64748b; margin: 1.5rem 0; }
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;
}
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
.empty { text-align: center; padding: 4rem 1rem; color: #94a3b8; }
.empty code { background: #f1f5f9; padding: 0.1rem 0.4rem; border-radius: 4px; }
</style>
