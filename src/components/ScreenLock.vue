<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useScreenLock } from '../composables/useScreenLock'
import octocatUrl from '../assets/screen-lock-octocat.png'

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

function onOctocatDblClick() {
  unlock()
}

function onOctocatSingleClick() {
  hint.value = '再点一次'
  setTimeout(() => (hint.value = ''), 1500)
}

onUnmounted(() => {
  document.body.style.overflow = prevOverflow
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isLocked" class="screen-lock">
      <div class="screen-lock__container">
        <h1 class="screen-lock__404">404</h1>
        <h2 class="screen-lock__heading">There isn't a GitHub Pages site here.</h2>
        <p class="screen-lock__text">
          If you're trying to publish one, read the full documentation to learn how to set up
          GitHub Pages for your repository, organization, or user account.
        </p>

        <img
          :src="octocatUrl"
          alt="octocat"
          class="screen-lock__octocat"
          @click="onOctocatSingleClick"
          @dblclick="onOctocatDblClick"
          draggable="false"
        />

        <p v-if="hint" class="screen-lock__hint">{{ hint }}</p>

        <p class="screen-lock__footer">
          <a
            href="https://www.githubstatus.com/"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub Status</a>
          — @githubstatus
        </p>
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
  background: #fafbfc;
  overflow-y: auto;
  padding: 40px 20px;
}

.screen-lock__container {
  max-width: 720px;
  width: 100%;
  text-align: center;
}

.screen-lock__404 {
  font-size: 96px;
  font-weight: 600;
  color: #24292e;
  margin: 0 0 16px;
  line-height: 1;
  letter-spacing: -2px;
}

.screen-lock__heading {
  font-size: 32px;
  font-weight: 400;
  color: #24292e;
  margin: 0 0 16px;
  line-height: 1.25;
}

.screen-lock__text {
  font-size: 16px;
  color: #586069;
  line-height: 1.5;
  margin: 0 0 40px;
}

.screen-lock__octocat {
  width: 256px;
  height: auto;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 0.1s ease;
  display: block;
  margin: 0 auto;
}

.screen-lock__octocat:hover {
  transform: scale(1.03);
}

.screen-lock__octocat:active {
  transform: scale(0.97);
}

.screen-lock__hint {
  margin-top: 16px;
  color: #586069;
  font-size: 13px;
  min-height: 18px;
}

.screen-lock__footer {
  margin-top: 40px;
  font-size: 14px;
  color: #586069;
}

.screen-lock__footer a {
  color: #0366d6;
  text-decoration: none;
}

.screen-lock__footer a:hover {
  text-decoration: underline;
}
</style>