export interface ExecutionItem {
  kind: 'training' | 'punish' | 'reward'
  slug: string
  title: string
  description?: string
  content: string
  url: string
}

interface Module {
  data: Record<string, unknown>
  content: string
}

const modules = import.meta.glob<Module>(
  '../content/execution/{training,punish,reward}/*.md',
  { eager: true, import: 'default' },
)

function parseNote(path: string, mod: Module): ExecutionItem | null {
  const m = /\/(training|punish|reward)\/([^/]+)\.md$/.exec(path.replace(/\\/g, '/'))
  if (!m) return null
  const [, kind, file] = m
  const data = mod.data
  return {
    kind: kind as ExecutionItem['kind'],
    slug: file,
    title: (data.title as string) ?? file,
    description: data.description as string | undefined,
    content: mod.content,
    url: `/execution/${kind}/${file}/`,
  }
}

let cached: ExecutionItem[] | null = null

function allItems(): ExecutionItem[] {
  if (cached) return cached
  cached = Object.entries(modules)
    .map(([p, m]) => parseNote(p, m))
    .filter((x): x is ExecutionItem => x !== null)
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans'))
  return cached
}

export function getExecutionItems(kind: ExecutionItem['kind']): ExecutionItem[] {
  return allItems().filter((x) => x.kind === kind)
}

export function getExecutionItem(
  kind: ExecutionItem['kind'],
  slug: string,
): ExecutionItem | undefined {
  return allItems().find((x) => x.kind === kind && x.slug === slug)
}
