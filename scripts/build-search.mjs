// Pre-build: 从 src/content/posts/*.md 抽取可搜索数据,写入 public/search-data.json
// Vite build 时会被原样复制到 dist/search-data.json

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const POSTS_DIR = join(ROOT, 'src/content/posts')
const KNOWLEDGE_DIR = join(ROOT, 'src/content/knowledge')
const OUT = join(ROOT, 'public/search-data.json')

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) return { data: {}, content: raw }
  const data = {}
  m[1].split(/\r?\n/).forEach((line) => {
    const mm = line.match(/^(\w+):\s*(.*)$/)
    if (!mm) return
    let v = mm[2].trim()
    if (v.startsWith('[')) {
      try { v = JSON.parse(v.replace(/'([\w\s-]+)'/g, '"$1"')) } catch { v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')) }
    } else {
      v = v.replace(/^["']|["']$/g, '')
    }
    data[mm[1]] = v
  })
  return { data, content: m[2] }
}

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

function stripMarkdown(content) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!?\[.*?\]\(.*?\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~]+/g, ' ')
    .replace(/!\[[^\]]*\]/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const docs = []
for (const file of walk(POSTS_DIR)) {
  const raw = readFileSync(file, 'utf-8')
  const { data, content } = parseFrontMatter(raw)
  const slug = file.split(/[\\/]/).pop().replace(/\.md$/, '')
  const date = data.date ? new Date(data.date) : new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const plain = stripMarkdown(content)
  docs.push({
    type: 'post',
    title: data.title || slug,
    slug,
    url: `/${y}/${m}/${d}/${slug}/`,
    date: date.toISOString().slice(0, 10),
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    description: (data.description || '').trim(),
    summary: plain.substring(0, 160),
    content: plain.substring(0, 4000),
  })
}

// 知识库笔记(纳入搜索)
for (const file of walk(KNOWLEDGE_DIR)) {
  const raw = readFileSync(file, 'utf-8')
  const { data, content } = parseFrontMatter(raw)
  const parts = file.slice(KNOWLEDGE_DIR.length + 1).replace(/\\/g, '/').split('/')
  if (parts.length < 3) continue
  const domain = parts[parts.length - 3].toLowerCase()
  const topic = parts[parts.length - 2].toLowerCase()
  const slug = parts[parts.length - 1].replace(/\.md$/, '')
  const plain = stripMarkdown(content)
  docs.push({
    type: 'knowledge',
    title: data.title || slug,
    slug,
    url: `/knowledge/${domain}/${topic}/${slug}/`,
    date: (data.updated || '').toString().slice(0, 10),
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    description: (data.description || '').trim(),
    summary: plain.substring(0, 160),
    content: plain.substring(0, 4000),
  })
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(docs), 'utf-8')
console.log(`[search] wrote ${docs.length} docs to ${OUT}`)

