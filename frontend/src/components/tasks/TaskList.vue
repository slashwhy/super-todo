<script setup lang="ts">
import type { Task } from '@/types/task'
import TaskCard from './TaskCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

withDefaults(defineProps<{
  tasks: Task[]
  loading?: boolean
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  loading: false,
  emptyIcon: '📋',
  emptyTitle: 'No tasks found',
  emptyDescription: ''
})
</script>

<template>
  <div class="task-list" data-testid="task-list">
    <!-- Loading state -->
    <div v-if="loading" class="task-list__loading" data-testid="task-list-loading">
      <div class="task-list__spinner" aria-label="Loading tasks"></div>
      <p>Loading tasks...</p>
    </div>

    <!-- Empty state -->
    <EmptyState 
      v-else-if="tasks.length === 0"
      :icon="emptyIcon"
      :title="emptyTitle"
      :description="emptyDescription"
      data-testid="task-list-empty"
    >
      <template #action>
        <slot name="empty-action"></slot>
      </template>
    </EmptyState>

    <!-- Task grid -->
    <div v-else class="task-list__grid" data-testid="task-list-grid">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
      />
    </div>
  </div>
</template>

<style scoped>
.task-list {
  width: 100%;
}

.task-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.task-list__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-text-muted);
  gap: var(--spacing-md);
}

.task-list__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
