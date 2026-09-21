<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useScreenLock } from '../composables/useScreenLock'
import logo1x from '../assets/screen-lock-logo-1x.png'
import logo2x from '../assets/screen-lock-logo-2x.png'

const { isLocked, unlock } = useScreenLock()

const hint = ref('')
let prevOverflow = ''

watch(isLocked, (locked) => {
  if (locked) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = prevOverflow
  }
}, { immediate: true })

function onLogoClick(e: MouseEvent) {
  e.preventDefault()
  hint.value = '再点一次'
  setTimeout(() => (hint.value = ''), 1500)
}

function onLogoDblClick(e: MouseEvent) {
  e.preventDefault()
  unlock()
}

onUnmounted(() => {
  document.body.style.overflow = prevOverflow
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

        <p v-if="hint" class="screen-lock__hint">{{ hint }}</p>

        <a href="/" class="logo logo-img-1x" @click="onLogoClick" @dblclick="onLogoDblClick" draggable="false">
          <img width="32" height="32" alt="" :src="logo1x" draggable="false" />
        </a>
        <a href="/" class="logo logo-img-2x" @click="onLogoClick" @dblclick="onLogoDblClick" draggable="false">
          <img width="32" height="32" alt="" :src="logo2x" draggable="false" />
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
  max-width: 600px;
  margin: 0 auto;
  padding: 70px 20px 50px;
  text-align: center;
  position: relative;
}

h1 {
  font-size: 96px;
  font-weight: 600;
  letter-spacing: -2px;
  margin: 0 0 8px;
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

.screen-lock__hint {
  margin-top: 12px !important;
  font-size: 13px;
  color: #586069;
  min-height: 18px;
}

.logo {
  display: block;
  width: 32px;
  height: 32px;
  margin: 32px auto 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 0.1s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.logo:active {
  transform: scale(0.95);
}

.logo img {
  display: block;
  width: 32px;
  height: 32px;
  user-select: none;
  -webkit-user-drag: none;
}

.logo-img-1x {
  display: block;
}

.logo-img-2x {
  display: none;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo-img-1x {
    display: none;
  }
  .logo-img-2x {
    display: block;
  }
}
</style>