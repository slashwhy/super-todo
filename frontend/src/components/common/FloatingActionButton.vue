<script setup lang="ts">
/**
 * Material Design Floating Action Button (FAB)
 * Fixed position button for primary actions, visible on all pages.
 * 
 * @example
 * <FloatingActionButton @click="openModal" />
 */
defineProps<{
  /** Accessible label for the button */
  ariaLabel?: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="fab"
    :aria-label="ariaLabel ?? 'Create new task'"
    data-testid="fab-button"
    @click="emit('click')"
  >
    <span class="fab__icon" aria-hidden="true">+</span>
  </button>
</template>

<style scoped>
.fab {
  /* Positioning - fixed bottom-right */
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 1000;

  /* Material Design FAB specs: 56x56px */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;

  /* Colors */
  background-color: var(--color-primary);
  color: var(--color-text-white);
  
  /* Elevation (Material Design level 6) */
  box-shadow: 
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14),
    0 1px 18px 0 rgba(0, 0, 0, 0.12);
  
  /* Interaction */
  cursor: pointer;
  transition: 
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  /* Reset */
  padding: 0;
  outline: none;
}

.fab:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
}

.fab:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.fab:active {
  transform: scale(0.95);
  box-shadow: 
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14),
    0 1px 18px 0 rgba(0, 0, 0, 0.12);
}

.fab__icon {
  font-size: 28px;
  font-weight: 300;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
