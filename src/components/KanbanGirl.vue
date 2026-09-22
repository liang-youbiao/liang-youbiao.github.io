<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

interface Props {
  modelPath?: string
  position?: 'left' | 'right'
  width?: number
  height?: number
}
const props = withDefaults(defineProps<Props>(), {
  modelPath: '/kanban/shizuku/shizuku.model.json',
  position: 'right',
  width: 200,
  height: 400,
})

const mounted = ref(false)
const hidden = ref(false)
let widget: any = null

function checkMobile() {
  hidden.value = window.innerWidth < 768
}

onMounted(async () => {
  mounted.value = true
  checkMobile()
  window.addEventListener('resize', checkMobile)
  if (hidden.value) return

  // 动态 import:live2d-widget 顶层读 document/window,
  // 不能顶层 import,否则 vite-ssg SSR 阶段会炸。
  // @ts-ignore — 第三方无 .d.ts
  const mod = await import('live2d-widget')
  widget = (mod as any).L2Dwidget ?? (mod as any).default?.L2Dwidget ?? mod
  widget.init({
    model: { jsonPath: props.modelPath },
    display: {
      position: props.position,
      width: props.width,
      height: props.height,
      hOffset: 0,
      vOffset: -20,
    },
    mobile: { show: false },
    react: { opacity: 1 },
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  try { widget?.destroy?.() } catch { /* 旧版本无 destroy,容忍 */ }
})
</script>

<template>
  <div v-if="mounted && !hidden" class="kanban-girl" :class="`kanban-${position}`" aria-hidden="true" />
</template>

<style scoped>
.kanban-girl {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 400px;
  z-index: 100;
  pointer-events: auto;
}
.kanban-girl :deep(canvas) {
  display: block;
}
@media (max-width: 768px) {
  .kanban-girl { display: none; }
}
</style>