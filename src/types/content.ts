// 知识库笔记 frontmatter
export interface KnowledgeNoteMeta {
  title: string
  slug: string
  domain: string
  topic: string
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  status?: 'seedling' | 'growing' | 'mature'
  connections?: string[]
  description?: string
  updated?: string
  url: string
}

export interface KnowledgeNote extends KnowledgeNoteMeta {
  content: string
}

// 复盘 frontmatter(思考 / 执行 / 学习)
export interface ReviewNoteMeta {
  title: string
  slug: string
  type: 'thinking' | 'execution' | 'learning'
  period?: string
  status?: 'seedling' | 'growing' | 'mature'
  updated?: string
  url: string
}

export interface ReviewNote extends ReviewNoteMeta {
  content: string
}

// 训练计划 md frontmatter
export interface TrainingPlanMeta {
  title: string
  slug: string
  category?: string
  status?: 'active' | 'paused' | 'archived'
  started?: string
  updated?: string
  url: string
}

export interface TrainingPlan extends TrainingPlanMeta {
  content: string
}

// 训练日志 JSON 契约
export interface TrainingLog {
  date: string
  planId: string
  duration?: number
  metric?: number
  note?: string
}

export interface TrainingPlanEntry {
  id: string
  title: string
  category?: string
  target?: string
}

export interface TrainingStats {
  streak?: number
  totalDays?: number
  byCategory?: Record<string, number>
}

export interface TrainingData {
  schema: string
  plans: TrainingPlanEntry[]
  logs: TrainingLog[]
  stats: TrainingStats
}
