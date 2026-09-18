<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import type { KnowledgeNote } from '@/utils/knowledge'
import { initScene } from '@/utils/knowledgeMap3d'

const props = defineProps<{ notes: KnowledgeNote[] }>()
const router = useRouter()

const containerRef = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

let cleanup: (() => void) | null = null

onMounted(async () => {
  if (!containerRef.value) return
  try {
    const THREE = await import('three')
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
    const SpriteText = (await import('three-spritetext')).default
    cleanup = initScene(containerRef.value, props.notes, THREE, OrbitControls, SpriteText, (note) => {
      router.push(note.url)
    })
  } catch (e) {
    console.error('[KnowledgeMap3D] init failed:', e)
    errorMsg.value = '3D 视图加载失败'
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>

<template>
  <div class="km3d-wrap">
    <div v-if="loading" class="km3d-loading">3D 视图加载中…</div>
    <div v-else-if="errorMsg" class="km3d-error">{{ errorMsg }}</div>
    <div ref="containerRef" class="km3d-canvas" />
    <div class="km3d-tip">🖱 拖拽旋转 · 滚轮缩放 · 点击节点查看笔记</div>
  </div>
</template>

<style scoped>
.km3d-wrap {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 480px;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.km3d-canvas { width: 100%; height: 100%; }
.km3d-loading,
.km3d-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.95rem;
  z-index: 1;
}
.km3d-error { color: #dc2626; }
.km3d-tip {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.92);
  border: 1px solid #e5e7eb;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: #475569;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style>