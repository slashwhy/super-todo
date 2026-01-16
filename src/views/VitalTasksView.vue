<script setup lang="ts">
// Placeholder view for Vital Tasks
</script>

<template>
  <div class="page">
    <h1 class="page__title">Vital Tasks</h1>
    <div class="page__content">
      <p class="page__placeholder">Vital tasks content will be added here</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page__title {
  font-size: var(--font-size-3xl);
  font-weight: 500;
  color: var(--color-text-primary);
}

.page__content {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page__placeholder {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}
</style>
