import type { RouteRecordRaw } from 'vue-router'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/categories/',
    name: 'categories',
    component: () => import('@/pages/categories.vue'),
  },
  {
    path: '/tags/',
    name: 'tags',
    component: () => import('@/pages/tags.vue'),
  },
  {
    path: '/archives/',
    name: 'archives',
    component: () => import('@/pages/archives.vue'),
  },
  {
    path: '/calendar/',
    name: 'calendar',
    component: () => import('@/pages/Calendar.vue'),
  },
  {
    path: '/friends/',
    name: 'friends',
    component: () => import('@/pages/friends.vue'),
  },
  {
    path: '/contact/',
    name: 'contact',
    component: () => import('@/pages/contact.vue'),
  },
  {
    path: '/knowledge/',
    name: 'knowledge',
    component: () => import('@/pages/knowledge/index.vue'),
  },
  {
    path: '/mysystem/',
    name: 'mysystem',
    component: () => import('@/pages/system/mysystem.vue'),
  },
  {
    path: '/thinking/',
    name: 'thinking',
    component: () => import('@/pages/system/thinking.vue'),
  },
  {
    path: '/execution/',
    name: 'execution',
    component: () => import('@/pages/system/execution.vue'),
  },
  {
    path: '/learning/',
    name: 'learning',
    component: () => import('@/pages/system/learning.vue'),
  },
  {
    path: '/training/',
    name: 'training',
    component: () => import('@/pages/system/training.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/404.vue'),
  },
]

