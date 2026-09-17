<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { TrainingData } from '@/types/content'

const props = defineProps<{ data: TrainingData }>()

const lineRef = ref<HTMLDivElement | null>(null)
const catRef = ref<HTMLDivElement | null>(null)
let lineChart: any = null
let catChart: any = null

async function init() {
  const echarts = await import('echarts')
  if (lineRef.value) {
    lineChart = echarts.init(lineRef.value)
    lineChart.setOption(buildLineOption())
  }
  if (catRef.value) {
    catChart = echarts.init(catRef.value)
    catChart.setOption(buildCategoryOption())
  }
  window.addEventListener('resize', resize)
}

function resize() {
  lineChart?.resize()
  catChart?.resize()
}

function buildLineOption() {
  const byDate = new Map<string, number>()
  for (const log of props.data.logs) {
    byDate.set(log.date, (byDate.get(log.date) || 0) + (log.duration || 0))
  }
  const sorted = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  return {
    tooltip: { trigger: 'axis' },
    grid: { top: 30, left: 50, right: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: sorted.map(([d]) => d.slice(5)),
      axisLabel: { fontSize: 11 },
    },
    yAxis: { type: 'value', name: '分钟', nameTextStyle: { fontSize: 11 } },
    series: [
      {
        type: 'line',
        smooth: true,
        data: sorted.map(([, v]) => v),
        itemStyle: { color: '#ea580c' },
        areaStyle: { opacity: 0.25, color: '#fed7aa' },
        lineStyle: { width: 2 },
      },
    ],
  }
}

function buildCategoryOption() {
  const byCategory: Record<string, number> = {}
  for (const log of props.data.logs) {
    const plan = props.data.plans.find((p) => p.id === log.planId)
    const cat = plan?.category || '其他'
    byCategory[cat] = (byCategory[cat] || 0) + (log.duration || 0)
  }
  return {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, left: 50, right: 20, bottom: 40 },
    xAxis: { type: 'category', data: Object.keys(byCategory), axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', name: '分钟', nameTextStyle: { fontSize: 11 } },
    series: [
      {
        type: 'bar',
        data: Object.values(byCategory),
        itemStyle: { color: '#0891b2', borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
}

onMounted(init)
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  lineChart?.dispose()
  catChart?.dispose()
})
</script>

<template>
  <div class="dashboard">
    <div class="kpis">
      <div class="kpi">
        <div class="num">{{ data.stats.streak || 0 }}</div>
        <div class="label">🔥 连续打卡</div>
      </div>
      <div class="kpi">
        <div class="num">{{ data.stats.totalDays || 0 }}</div>
        <div class="label">📅 总训练天数</div>
      </div>
      <div class="kpi">
        <div class="num">{{ data.logs.length }}</div>
        <div class="label">📝 日志条数</div>
      </div>
    </div>

    <div class="chart-block">
      <h3>训练时长趋势</h3>
      <div ref="lineRef" class="chart"></div>
    </div>

    <div class="chart-block">
      <h3>分类总时长</h3>
      <div ref="catRef" class="chart"></div>
    </div>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 1rem; }
.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.kpi {
  padding: 1rem;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  border-radius: 8px;
  text-align: center;
}
.kpi .num { font-size: 1.5rem; font-weight: 700; color: #c2410c; }
.kpi .label { font-size: 0.78rem; color: #9a3412; margin-top: 0.25rem; }
.chart-block { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.75rem; }
.chart-block h3 { font-size: 0.9rem; color: #475569; margin: 0 0 0.5rem; }
.chart { width: 100%; height: 220px; }
</style>
