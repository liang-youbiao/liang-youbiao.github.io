import type { ReviewNote } from '@/types/content'

interface ReviewModule {
  data: Record<string, unknown>
  content: string
}

const modules = import.meta.glob<ReviewModule>('../content/reviews/**/*.md', {
  eager: true,
  import: 'default',
})

function parseNote(path: string, mod: ReviewModule): ReviewNote {
  const data = mod.data
  const fileName = path.split('/').pop() || ''
  const slug = fileName.replace(/\.md$/, '')
  const type = (data.type as ReviewNote['type']) ?? 'thinking'
  return {
    title: (data.title as string) ?? slug,
    slug,
    type,
    period: data.period as string | undefined,
    status: data.status as ReviewNote['status'],
    updated: data.updated as string | undefined,
    url: `/reviews/${type}/${slug}/`,
    content: mod.content,
  }
}

let cached: ReviewNote[] | null = null

function allReviews(): ReviewNote[] {
  if (cached) return cached
  cached = Object.entries(modules)
    .map(([path, mod]) => parseNote(path, mod))
    .sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
  return cached
}

export function getAllReviews(): ReviewNote[] {
  return allReviews()
}

export function getReviewsByType(type: ReviewNote['type']): ReviewNote[] {
  return allReviews().filter((r) => r.type === type)
}

export function getReview(type: ReviewNote['type'], slug: string): ReviewNote | undefined {
  return allReviews().find((r) => r.type === type && r.slug === slug)
}
