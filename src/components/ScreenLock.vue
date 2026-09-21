<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { useScreenLock } from '../composables/useScreenLock'

const { isLocked, unlock } = useScreenLock()

let prevOverflow = ''

let originalTitle = ''
let faviconLinks: HTMLLinkElement[] = []
let originalFaviconHrefs: string[] = []
let originalsCaptured = false

function captureOriginals() {
  if (originalsCaptured) return
  originalsCaptured = true
  originalTitle = document.title
  faviconLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]'))
  originalFaviconHrefs = faviconLinks.map(l => l.href)
}

function applyLockedChrome() {
  captureOriginals()
  document.title = 'Site not found · GitHub Pages'
  faviconLinks.forEach(l => { l.href = '/screen-lock-logo.png' })
}

function restoreOriginalChrome() {
  if (!originalsCaptured) return
  document.title = originalTitle
  faviconLinks.forEach((l, i) => {
    const orig = originalFaviconHrefs[i]
    if (orig !== undefined) l.href = orig
  })
}

watch(isLocked, (locked) => {
  if (locked) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    applyLockedChrome()
  } else {
    document.body.style.overflow = prevOverflow
    restoreOriginalChrome()
  }
}, { immediate: true })

function onLogoClick(e: MouseEvent) {
  e.preventDefault()
}

function onLogoDblClick(e: MouseEvent) {
  e.preventDefault()
  unlock()
}

onUnmounted(() => {
  document.body.style.overflow = prevOverflow
  restoreOriginalChrome()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isLocked" class="screen-lock">
      <div class="container">
        <h1>404</h1>
        <p><strong>There isn't a GitHub Pages site here.</strong></p>
        <p>
          If you're trying to publish one,
          <a href="https://help.github.com/pages/" target="_blank" rel="noopener noreferrer">read the full documentation</a>
          to learn how to set up <strong>GitHub Pages</strong>
          for your repository, organization, or user account.
        </p>
        <div id="suggestions">
          <a href="https://www.githubstatus.com/" target="_blank" rel="noopener noreferrer">GitHub Status</a>
          —
          <a href="https://twitter.com/githubstatus" target="_blank" rel="noopener noreferrer">@githubstatus</a>
        </div>

        <a
          href="/"
          class="logo"
          aria-label="logo"
          @click="onLogoClick"
          @dblclick="onLogoDblClick"
          draggable="false"
        >
          <img width="60" height="60" alt="" src="/screen-lock-logo.png" draggable="false" />
        </a>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.screen-lock {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fafafa;
  color: #24292e;
  overflow-y: auto;
}

.container {
  width: 540px;
  max-width: calc(100vw - 40px);
  margin: 0 auto;
  padding: 70px 0 50px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
}

h1 {
  font-size: 96px;
  font-weight: 600;
  letter-spacing: -2px;
  margin: 0 0 24px;
  line-height: 1;
  color: #24292e;
}

p {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
}

p strong {
  font-weight: 600;
}

a {
  color: #0366d6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

#suggestions {
  margin-top: 16px;
  font-size: 14px;
  color: #24292e;
}

.logo {
  display: block;
  width: 60px;
  height: 60px;
  margin: 32px auto 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 0.1s ease;
}

.logo:hover {
  transform: scale(1.08);
}

.logo:active {
  transform: scale(0.95);
}

.logo img {
  display: block;
  width: 60px;
  height: 60px;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}
</style>