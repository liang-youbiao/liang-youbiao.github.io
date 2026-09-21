import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { staticRoutes } from './router'
import { generatedPosts, generatedKnowledgeNotes, generatedTags } from './__generated_routes'
import './assets/main.css'
import './assets/matery.css'

// 由 vite.config.ts 的 generateRoutes 插件在 buildStart 时生成(每次构建自动更新)
// 不依赖 import.meta.glob 或运行时解析,直接拿到 URL 列表
const postRoutes = generatedPosts.map((post) => ({
  path: post.url,
  component: () => import('./pages/PostDetail.vue'),
}))

const tagRoutes = generatedTags.map((tag) => ({
  path: `/tags/${encodeURIComponent(tag)}/`,
  component: () => import('./pages/TagDetail.vue'),
}))

// 知识库:每个 domain 一条路由,props 传 domain 区分
const knowledgeDomainRoutes = generatedKnowledgeNotes.reduce<{ path: string; component: any; props: { domain: string } }[]>((acc, note) => {
  const path = `/knowledge/${note.domain}/`
  if (!acc.find((r) => r.path === path)) {
    acc.push({
      path,
      component: () => import('./pages/knowledge/domain.vue'),
      props: { domain: note.domain },
    })
  }
  return acc
}, [])

// 知识库:每条笔记一条路由,props 传 domain/topic/slug
const knowledgeNoteRoutes = generatedKnowledgeNotes.map((note) => ({
  path: note.url,
  component: () => import('./pages/knowledge/note.vue'),
  props: { domain: note.domain, topic: note.topic, slug: note.slug },
}))

// 执行体系:训练 / 惩罚 / 奖赏 三类条目详情路由
// 通过 import.meta.glob 直接读 src/content/execution/{kind}/*.md 拿到所有 slug
const executionModules = import.meta.glob('./content/execution/{training,punish,reward}/*.md', { eager: true })
const executionItemRoutes = Object.keys(executionModules).map((path) => {
  const m = /\/(training|punish|reward)\/([^/]+)\.md$/.exec(path)
  if (!m) return null
  return {
    path: `/execution/${m[1]}/${m[2]}/`,
    component: () => import('./pages/execution-item.vue'),
    props: { kind: m[1], slug: m[2] },
  }
}).filter((r): r is { path: string; component: any; props: { kind: string; slug: string } } => r !== null)

export const createApp = ViteSSG(
  App,
  { routes: [...staticRoutes, ...postRoutes, ...tagRoutes, ...knowledgeDomainRoutes, ...knowledgeNoteRoutes, ...executionItemRoutes] },
)
