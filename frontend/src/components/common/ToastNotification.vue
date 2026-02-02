<script setup lang="ts">
import type { Toast } from '@/composables/useToast'

defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  close: [id: number]
}>()

const icons: Record<Toast['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}
</script>

<template>
  <div
    :class="['toast', `toast--${toast.type}`]"
    role="alert"
    data-testid="toast"
  >
    <span class="toast__icon" aria-hidden="true">{{ icons[toast.type] }}</span>
    <p class="toast__message">{{ toast.message }}</p>
    <button
      type="button"
      class="toast__close"
      aria-label="Dismiss notification"
      data-testid="toast-close"
      @click="emit('close', toast.id)"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  min-width: 280px;
  max-width: 400px;
  border-left: 4px solid var(--color-border);
  animation: slide-in 0.3s ease-out;
}

.toast--success {
  border-left-color: var(--color-accent-green);
}

.toast--error {
  border-left-color: var(--color-accent-red);
}

.toast--info {
  border-left-color: var(--color-accent-blue);
}

.toast__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.toast--success .toast__icon {
  background-color: var(--color-accent-green);
  color: var(--color-text-white);
}

.toast--error .toast__icon {
  background-color: var(--color-accent-red);
  color: var(--color-text-white);
}

.toast--info .toast__icon {
  background-color: var(--color-accent-blue);
  color: var(--color-text-white);
}

.toast__message {
  flex: 1;
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.toast__close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color 0.2s;
}

.toast__close:hover {
  color: var(--color-text-primary);
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
