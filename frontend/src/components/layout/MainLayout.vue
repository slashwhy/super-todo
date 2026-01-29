<script setup lang="ts">
import TheHeader from './TheHeader.vue'
import TheSidebar from './TheSidebar.vue'
</script>

<template>
  <div class="layout">
    <TheHeader />
    <TheSidebar />
    <main class="layout__main">
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
}
</style>
