import type { TrainingData, TrainingPlan } from '@/types/content'
import trainingData from '@/data/training.json'

interface PlanModule {
  data: Record<string, unknown>
  content: string
}

const modules = import.meta.glob<PlanModule>('../content/training/plans/*.md', {
  eager: true,
  import: 'default',
})

function parsePlan(path: string, mod: PlanModule): TrainingPlan {
  const data = mod.data
  const fileName = path.split('/').pop() || ''
  const slug = fileName.replace(/\.md$/, '')
  return {
    title: (data.title as string) ?? slug,
    slug,
    category: data.category as string | undefined,
    status: data.status as TrainingPlan['status'],
    started: data.started as string | undefined,
    updated: data.updated as string | undefined,
    url: `/training/plans/${slug}/`,
    content: mod.content,
  }
}

let cached: TrainingPlan[] | null = null

export function getTrainingPlans(): TrainingPlan[] {
  if (cached) return cached
  cached = Object.entries(modules)
    .map(([path, mod]) => parsePlan(path, mod))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  return cached
}

export function getTrainingPlan(slug: string): TrainingPlan | undefined {
  return getTrainingPlans().find((p) => p.slug === slug)
}

export function getTrainingData(): TrainingData {
  return trainingData as TrainingData
}
