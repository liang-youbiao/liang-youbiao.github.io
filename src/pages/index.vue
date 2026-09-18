<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import Dream from '@/components/Dream.vue'
import Recommend from '@/components/Recommend.vue'
import SystemCard from '@/components/SystemCard.vue'
import KnowledgeMap from '@/components/KnowledgeMap.vue'
import PostCard from '@/components/PostCard.vue'
import { getAllPosts, getRecommendedPosts } from '@/utils/posts'
import { getKnowledgeDomains } from '@/utils/knowledge'
import { getReviewsByType } from '@/utils/reviews'
import { getTrainingData } from '@/utils/training'

const posts = getAllPosts()
const recommended = getRecommendedPosts()
const latestPosts = posts.filter((p) => !p.top)
const domains = getKnowledgeDomains()
const totalNotes = domains.reduce((s, d) => s + d.count, 0)

const reviewCounts = {
  thinking: getReviewsByType('thinking').length,
  execution: getReviewsByType('execution').length,
  learning: getReviewsByType('learning').length,
}
const trainingData = getTrainingData()
</script>

<template>
  <div class="home-page">
    <Banner homepage />

    <Dream />

    <section class="systems-section">
      <div class="matery-container">
        <header class="section-header">
          <h2>
            <span class="title-icon">⚙️</span>
            <span>个人系统</span>
          </h2>
          <p>四大模块,持续构建 —— 方法论 + 实战记录 + 数据</p>
        </header>
        <div class="systems-grid">
          <SystemCard
            domain="thinking"
            title="思考"
            subtitle="让思考成为习惯"
            icon="🧠"
            color="#7c3aed"
            :note-count="reviewCounts.thinking"
            extra="篇复盘"
          />
          <SystemCard
            domain="execution"
            title="执行"
            subtitle="把想法变成结果"
            icon="⚡"
            color="#0891b2"
            :note-count="reviewCounts.execution"
            extra="篇复盘"
          />
          <SystemCard
            domain="learning"
            title="学习"
            subtitle="让输入变成能力"
            icon="📘"
            color="#2563eb"
            :note-count="reviewCounts.learning"
            extra="篇复盘"
          />
          <SystemCard
            domain="training"
            title="训练"
            subtitle="身体训练计划与数据"
            icon="💪"
            color="#ea580c"
            :note-count="trainingData.stats.streak || 0"
            extra="天连续"
          />
        </div>
      </div>
    </section>

    <section class="knowledge-section">
      <div class="matery-container">
        <header class="section-header">
          <h2>
            <span class="title-icon">🗺️</span>
            <span>知识地图</span>
          </h2>
          <p>{{ domains.length }} 个领域 · {{ totalNotes }} 篇笔记 —— 点击进入查看子主题与详情</p>
        </header>
        <KnowledgeMap :domains="domains" />
      </div>
    </section>

    <Recommend v-if="recommended.length" :posts="recommended" />

    <article id="articles" class="container articles">
      <header class="latest-header">
        <h2 class="latest-title">
          <span class="title-icon">📚</span>
          <span>最新文章</span>
        </h2>
        <p class="latest-sub">共 {{ latestPosts.length }} 篇 · 按发布时间倒序</p>
      </header>

      <div class="row article-row">
        <div v-for="post in latestPosts" :key="post.slug" class="article-col">
          <PostCard :post="post" />
        </div>
        <div v-if="!latestPosts.length" class="empty">
          <p>还没有文章,先去 <code>src/content/posts/</code> 添加一篇吧。</p>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.home-page {
  user-select: none;
  -webkit-user-select: none;
}

.home-page :deep(.empty code) {
  user-select: text;
  -webkit-user-select: text;
}

/* 四大系统区块 */
.systems-section {
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  padding: 4rem 0 2rem;
  border-bottom: 1px solid #f0f0f0;
}
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}
.section-header h2 {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: var(--matery-text);
  margin: 0 0 0.4rem;
  font-weight: 600;
}
.title-icon { font-size: 1.4rem; }
.section-header p {
  color: #888;
  font-size: 0.92rem;
  margin: 0;
}
.systems-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1rem;
}
@media (max-width: 768px) {
  .systems-grid { grid-template-columns: 1fr; }
  .systems-section { padding: 2.5rem 0 1.5rem; }
}

/* 知识地图区块 */
.knowledge-section {
  background: #fff;
  padding: 4rem 0 3rem;
  border-bottom: 1px solid #f0f0f0;
}
@media (max-width: 768px) {
  .knowledge-section { padding: 2.5rem 0 2rem; }
}

/* 最新文章 */
.latest-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}
.latest-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: var(--matery-text);
  margin: 0 0 0.4rem;
  font-weight: 600;
}
.latest-sub {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
  width: 100%;
}

.empty code {
  background: #f5f5f5;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>