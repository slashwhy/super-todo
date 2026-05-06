<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import ToastNotification from './ToastNotification.vue'

const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" data-testid="toast-container">
      <TransitionGroup name="toast-list">
        <ToastNotification
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @close="removeToast"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1200;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: var(--spacing-sm);
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
