export interface StageGoal {
  year: number
  title: string
  done: boolean
}

export interface ChallengeGoal {
  title: string
  difficulty: number
  done: boolean
}

interface Module {
  data: Record<string, unknown>
  content: string
}

const modules = import.meta.glob<Module>('../content/goals.md', {
  eager: true,
  import: 'default',
})

const STAGE_RE = /^-\s+\[( |x)\]\s+(.+)$/i
const CHALLENGE_RE = /^-\s+\[( |x)\]\s+(⭐+)\s+(.+)$/u

export interface ParsedGoals {
  stages: StageGoal[]
  challenges: ChallengeGoal[]
}

function parse(content: string): ParsedGoals {
  const stages: StageGoal[] = []
  const challenges: ChallengeGoal[] = []
  const lines = content.split('\n')

  let section: 'stage' | 'challenge' | null = null
  let currentYear = 0

  for (const raw of lines) {
    const line = raw.trim()

    if (line.startsWith('## ')) {
      section = line.includes('阶段') ? 'stage' : line.includes('挑战') ? 'challenge' : null
      currentYear = 0
      continue
    }

    if (section === 'stage') {
      const yearMatch = /^###\s+(\d{4})/.exec(line)
      if (yearMatch) {
        currentYear = parseInt(yearMatch[1], 10)
        continue
      }
      const m = STAGE_RE.exec(line)
      if (m && currentYear) {
        stages.push({
          year: currentYear,
          title: m[2].trim(),
          done: m[1].toLowerCase() === 'x',
        })
      }
    } else if (section === 'challenge') {
      const m = CHALLENGE_RE.exec(line)
      if (m) {
        challenges.push({
          title: m[3].trim(),
          difficulty: m[2].length,
          done: m[1].toLowerCase() === 'x',
        })
      }
    }
  }

  return { stages, challenges }
}

export function getGoals(): ParsedGoals {
  const mod = Object.values(modules)[0]
  if (!mod) return { stages: [], challenges: [] }
  return parse(mod.content)
}
