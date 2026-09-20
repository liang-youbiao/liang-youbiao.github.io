<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, ref } from 'vue'

interface Props {
  modelPath: string
  position: 'left' | 'right'
  width?: number
  height?: number
}
const props = withDefaults(defineProps<Props>(), {
  width: 280,
  height: 360,
})

const mounted = ref(false)
const hidden = ref(false)
let app: any = null
let model: any = null

function checkMobile() {
  hidden.value = window.innerWidth < 768
}

onMounted(async () => {
  mounted.value = true
  checkMobile()
  window.addEventListener('resize', checkMobile)
  if (hidden.value) return

  // nextTick 确保 SSR/CSR DOM 完全提交,父布局的 mount 顺序有时让 getElementById 拿到 null
  await nextTick()
  const container = document.getElementById(`kanban-${props.position}`)
  if (!container) {
    console.warn('[KanbanGirl] container not found:', `kanban-${props.position}`)
    return
  }

  try {
    // @ts-ignore — 无 .d.ts,运行时 any
    const PIXI = await import('pixi.js')
    // @ts-ignore — /cubism2 子路径,只含 Cubism 2.1 运行时(我们用的是 .moc 文件)
    const { Live2DModel } = await import('pixi-live2d-display/cubism2')

    // pixi-live2d-display 需要 window.PIXI 暴露才能 hook ticker
    ;(window as any).PIXI = PIXI

    // pixi.js v8:Application() + await init() 异步初始化,canvas 字段而非 view
    app = new PIXI.Application()
    await app.init({
      width: props.width,
      height: props.height,
      backgroundAlpha: 0,
      antialias: true,
      resizeTo: container,
    })
    container.appendChild(app.canvas)

    // 模型
    model = await Live2DModel.from(props.modelPath, {
      autoInteract: false,
    })

    // 锚点底部居中 + 缩放适应画布
    model.anchor.set(0.5, 1.0)
    model.x = props.width / 2
    model.y = props.height
    const fitScale = Math.min(props.width, props.height) / 800
    model.scale.set(fitScale, fitScale)

    app.stage.addChild(model)

    // 互动:点击身体触发 tap_body 动作
    model.on('hit', (hitAreas: string[]) => {
      if (hitAreas.includes('body')) model.motion('tap_body')
      else if (hitAreas.includes('head')) model.motion('flick_head')
    })
  } catch (e) {
    console.error('[KanbanGirl] init failed:', e)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  try { model?.destroy?.() } catch { /* 忽略 */ }
  try { app?.destroy?.() } catch { /* 忽略 */ }
  app = null
  model = null
})
</script>

<template>
  <div
    v-if="mounted && !hidden"
    :id="`kanban-${position}`"
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="kanban-girl"
    :class="`kanban-${position}`"
    aria-hidden="true"
  />
</template>

<style scoped>
.kanban-girl {
  position: fixed;
  bottom: 0;
  width: 280px;
  height: 360px;
  z-index: 100;
  pointer-events: auto;
  overflow: hidden;
}
.kanban-girl :deep(canvas) {
  display: block;
}
.kanban-left {
  left: 0;
  right: auto;
}
.kanban-right {
  right: 0;
  left: auto;
}
@media (max-width: 768px) {
  .kanban-girl { display: none; }
}
</style>