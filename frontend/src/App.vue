<script setup lang="ts">
import MainLayout from './components/layout/MainLayout.vue'
import ToastContainer from './components/common/ToastContainer.vue'
</script>

<template>
  <MainLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </MainLayout>
  <ToastContainer />
</template>

<style>
@import './assets/styles/base.css';

/* Page transitions */
.page-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
