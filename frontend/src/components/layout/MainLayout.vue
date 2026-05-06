<script setup lang="ts">
import { ref, provide } from 'vue'
import TheHeader from './TheHeader.vue'
import TheSidebar from './TheSidebar.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

provide('sidebar', { sidebarOpen, toggleSidebar, closeSidebar })
</script>

<template>
  <div class="layout">
    <TheHeader @toggle-sidebar="toggleSidebar" />
    <Transition name="sidebar-slide">
      <div v-if="sidebarOpen" class="layout__sidebar-backdrop" @click="closeSidebar"></div>
    </Transition>
    <TheSidebar :class="{ 'sidebar--open': sidebarOpen }" />
    <main class="layout__main" @click="closeSidebar">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: var(--color-background);
}

.layout__main {
  margin-left: var(--sidebar-width);
  margin-top: var(--header-height);
  padding: var(--spacing-xl);
  min-height: calc(100vh - var(--header-height));
  transition: margin-left 0.3s ease;
}

.layout__sidebar-backdrop {
  display: none;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout__main {
    margin-left: 0;
    padding: var(--spacing-md);
  }

  .layout__sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 150;
  }
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  opacity: 0;
}
</style>
