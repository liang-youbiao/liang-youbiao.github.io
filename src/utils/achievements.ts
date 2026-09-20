export interface Achievement {
  date: string
  title: string
}

interface Module {
  data: Record<string, unknown>
  content: string
}

const modules = import.meta.glob<Module>('../content/achievements.md', {
  eager: true,
  import: 'default',
})

// 兼容半角 / 全角冒号
const LINE_RE = /^-\s+(\d{4}-\d{2}-\d{2})\s*[:：]\s*(.+?)\s*$/

export function getAllAchievements(): Achievement[] {
  const mod = Object.values(modules)[0]
  if (!mod) return []
  return mod.content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((l) => {
      const m = LINE_RE.exec(l)
      return m ? { date: m[1], title: m[2] } : null
    })
    .filter((a): a is Achievement => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}
