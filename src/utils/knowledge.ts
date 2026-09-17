import type { KnowledgeNote } from '@/types/content'

export type { KnowledgeNote }

interface KnowledgeModule {
  data: Record<string, unknown>
  content: string
}

const modules = import.meta.glob<KnowledgeModule>('../content/knowledge/**/*.md', {
  eager: true,
  import: 'default',
})

function partsFromPath(path: string): { domain: string; topic: string } {
  const normalized = path.replace(/\\/g, '/').split('/')
  return {
    domain: (normalized[normalized.length - 3] || '').toLowerCase(),
    topic: (normalized[normalized.length - 2] || '').toLowerCase(),
  }
}

function parseNote(path: string, mod: KnowledgeModule): KnowledgeNote {
  const data = mod.data
  const fileName = path.split('/').pop() || ''
  const slug = fileName.replace(/\.md$/, '')
  const { domain, topic } = partsFromPath(path)
  return {
    title: (data.title as string) ?? slug,
    slug,
    domain,
    topic,
    tags: (data.tags as string[]) ?? [],
    difficulty: data.difficulty as KnowledgeNote['difficulty'],
    status: data.status as KnowledgeNote['status'],
    connections: (data.connections as string[]) ?? [],
    description: data.description as string | undefined,
    updated: data.updated as string | undefined,
    url: `/knowledge/${domain}/${topic}/${slug}/`,
    content: mod.content,
  }
}

let cached: KnowledgeNote[] | null = null

function allNotes(): KnowledgeNote[] {
  if (cached) return cached
  cached = Object.entries(modules)
    .map(([path, mod]) => parseNote(path, mod))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  return cached
}

export function getAllKnowledgeNotes(): KnowledgeNote[] {
  return allNotes()
}

export interface KnowledgeDomainSummary {
  domain: string
  count: number
  topics: { topic: string; count: number }[]
}

export function getKnowledgeDomains(): KnowledgeDomainSummary[] {
  const notes = allNotes()
  const byDomain: Record<string, KnowledgeNote[]> = {}
  for (const n of notes) {
    ;(byDomain[n.domain] ??= []).push(n)
  }
  return Object.keys(byDomain)
    .sort()
    .map((domain) => {
      const list = byDomain[domain]
      const byTopic: Record<string, number> = {}
      for (const n of list) byTopic[n.topic] = (byTopic[n.topic] || 0) + 1
      return {
        domain,
        count: list.length,
        topics: Object.keys(byTopic)
          .sort()
          .map((topic) => ({ topic, count: byTopic[topic] })),
      }
    })
}

export function getKnowledgeTopics(domain: string): { topic: string; count: number }[] {
  const notes = allNotes().filter((n) => n.domain === domain)
  const byTopic: Record<string, number> = {}
  for (const n of notes) byTopic[n.topic] = (byTopic[n.topic] || 0) + 1
  return Object.keys(byTopic)
    .sort()
    .map((topic) => ({ topic, count: byTopic[topic] }))
}

export function getKnowledgeNotes(domain: string, topic?: string): KnowledgeNote[] {
  return allNotes().filter((n) => n.domain === domain && (!topic || n.topic === topic))
}

export function getKnowledgeNote(domain: string, topic: string, slug: string): KnowledgeNote | undefined {
  return allNotes().find((n) => n.domain === domain && n.topic === topic && n.slug === slug)
}
