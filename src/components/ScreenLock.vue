<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useScreenLock, PATTERN_PASSWORD } from '../composables/useScreenLock'

const { isLocked, unlock } = useScreenLock()

const entered = ref<number[]>([])
const error = ref('')
const shake = ref(false)
let prevOverflow = ''

watch(isLocked, (locked) => {
  if (locked) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = prevOverflow
  }
}, { immediate: true })

function clickDot(n: number) {
  error.value = ''
  if (entered.value.includes(n)) return
  entered.value.push(n)

  if (entered.value.length === PATTERN_PASSWORD.length) {
    const ok = entered.value.every((v, i) => v === PATTERN_PASSWORD[i])
    if (ok) {
      unlock()
      entered.value = []
    } else {
      error.value = '图案错误'
      triggerShake()
      entered.value = []
    }
  }
}

function clearEntered() {
  entered.value = []
  error.value = ''
}

function triggerShake() {
  shake.value = true
  setTimeout(() => (shake.value = false), 400)
}

onUnmounted(() => {
  document.body.style.overflow = prevOverflow
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isLocked" class="screen-lock">
      <div class="screen-lock__card" :class="{ 'is-shake': shake }">
        <div class="screen-lock__icon">🔒</div>
        <h2 class="screen-lock__title">页面已锁定</h2>
        <p class="screen-lock__hint">按顺序点击九宫格圆点解锁</p>

        <div class="pattern-grid">
          <button
            v-for="n in 9"
            :key="n"
            type="button"
            class="pattern-dot"
            :class="{ 'is-entered': entered.includes(n) }"
            :disabled="entered.includes(n)"
            @click="clickDot(n)"
            :aria-label="`第 ${n} 格`"
          >
            <span class="pattern-dot__num">{{ n }}</span>
          </button>
        </div>

        <div class="pattern-progress">
          <span
            v-for="(_, i) in PATTERN_PASSWORD"
            :key="i"
            class="pattern-progress__cell"
            :class="{ 'is-filled': i < entered.length }"
          />
        </div>

        <p v-if="error" class="screen-lock__error">{{ error }}</p>

        <button
          v-if="entered.length > 0"
          type="button"
          class="screen-lock__clear"
          @click="clearEntered"
        >
          清除
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.screen-lock {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(6px);
}

.screen-lock__card {
  width: min(360px, 90vw);
  padding: 28px 24px 24px;
  background: var(--matery-card-bg, #fff);
  border-radius: var(--matery-card-radius, 10px);
  box-shadow: var(--matery-card-shadow);
  text-align: center;
}

.screen-lock__card.is-shake {
  animation: lock-shake 0.4s;
}

.screen-lock__icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.screen-lock__title {
  margin: 0 0 4px;
  font-size: 18px;
  color: var(--matery-text, #34495e);
}

.screen-lock__hint {
  color: var(--matery-text, #34495e);
  opacity: 0.7;
  font-size: 13px;
  margin: 4px 0 18px;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 18px;
  margin: 0 auto;
  width: 240px;
}

.pattern-dot {
  aspect-ratio: 1;
  border: 2px solid #d0d0d0;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  outline: none;
  padding: 0;
}

.pattern-dot:hover:not(:disabled) {
  border-color: var(--matery-primary, #0f9d58);
}

.pattern-dot:disabled {
  cursor: default;
}

.pattern-dot.is-entered {
  background: var(--matery-primary, #0f9d58);
  border-color: var(--matery-primary, #0f9d58);
}

.pattern-dot__num {
  font-size: 14px;
  color: #999;
  font-weight: 600;
  user-select: none;
}

.pattern-dot.is-entered .pattern-dot__num {
  color: #fff;
}

.pattern-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.pattern-progress__cell {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: background 0.15s;
}

.pattern-progress__cell.is-filled {
  background: var(--matery-primary, #0f9d58);
}

.screen-lock__error {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 12px;
}

.screen-lock__clear {
  margin-top: 12px;
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: transparent;
  color: var(--matery-text, #34495e);
  font-size: 13px;
  cursor: pointer;
}

@keyframes lock-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
</style>