<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import PlanCard from '@/components/PlanCard.vue'
import TrainingDashboard from '@/components/TrainingDashboard.vue'
import { getTrainingPlans, getTrainingData } from '@/utils/training'

const plans = getTrainingPlans()
const data = getTrainingData()
</script>

<template>
  <div>
    <Banner title="训练" subtitle="身体训练计划与打卡数据" height="post" />

    <article class="matery-container">
      <div class="training-grid">
        <section class="plans">
          <h2>📋 训练计划</h2>
          <div v-if="!plans.length" class="empty">
            暂无训练计划,去 <code>src/content/training/plans/</code> 添加。
          </div>
          <div v-else class="plan-list">
            <PlanCard v-for="p in plans" :key="p.slug" :plan="p" />
          </div>
        </section>

        <section class="dashboard">
          <h2>📊 数据看板</h2>
          <TrainingDashboard :data="data" />
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.training-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}
h2 { font-size: 1.05rem; color: #475569; margin-bottom: 0.75rem; font-weight: 600; }
.empty { color: #94a3b8; padding: 2rem 1rem; text-align: center; }
.empty code { background: #f1f5f9; padding: 0.1rem 0.4rem; border-radius: 4px; }
.plan-list { display: flex; flex-direction: column; gap: 0.75rem; }
@media (max-width: 900px) { .training-grid { grid-template-columns: 1fr; } }
</style>
