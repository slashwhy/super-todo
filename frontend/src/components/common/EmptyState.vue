<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
}>(), {
  icon: '📋',
  description: ''
})
</script>

<template>
  <div class="empty-state" data-testid="empty-state">
    <span class="empty-state__icon" aria-hidden="true">{{ icon }}</span>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-2xl);
  min-height: 250px;
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
}

.empty-state__icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.empty-state__title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 300px;
}
</style>
