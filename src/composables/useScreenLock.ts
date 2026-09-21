import { ref, onMounted, onUnmounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const DEADLINE_KEY = 'screen-lock.lock-deadline'
const TIMEOUT_MS = 30 * 60 * 1000
const CLICK_EXTEND_MS = 10 * 60 * 1000

export const PATTERN_PASSWORD = [4, 2, 3, 5, 7, 8, 6] as const

const lockDeadline = useLocalStorage<number | null>(DEADLINE_KEY, null)
const isLocked = ref(true)
let intervalId: number | null = null
let clickHandler: ((e: MouseEvent) => void) | null = null
let installed = false

function evaluateLockState() {
  if (lockDeadline.value == null) {
    isLocked.value = true
    return
  }
  isLocked.value = Date.now() > lockDeadline.value
}

function unlock() {
  lockDeadline.value = Date.now() + TIMEOUT_MS
  isLocked.value = false
}

function onPageClick() {
  if (isLocked.value) return
  if (lockDeadline.value == null) return
  lockDeadline.value += CLICK_EXTEND_MS
}

export function useScreenLock() {
  onMounted(() => {
    if (installed) return
    installed = true
    evaluateLockState()
    clickHandler = onPageClick
    document.addEventListener('click', clickHandler, { capture: true })
    intervalId = window.setInterval(evaluateLockState, 60_000)
  })

  onUnmounted(() => {
    if (clickHandler) {
      document.removeEventListener('click', clickHandler, { capture: true })
      clickHandler = null
    }
    if (intervalId != null) {
      clearInterval(intervalId)
      intervalId = null
    }
    installed = false
  })

  return {
    isLocked,
    passwordLength: PATTERN_PASSWORD.length,
    unlock,
  }
}