<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import TaskList from '@/components/tasks/TaskList.vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()
const { tasks, loading, error, tasksByStatus } = storeToRefs(tasksStore)

// Get status counts for the filter tabs
const statusCounts = computed(() => ({
  all: tasks.value.length,
  notStarted: tasksByStatus.value['Not Started']?.length || 0,
  inProgress: tasksByStatus.value['In Progress']?.length || 0,
  completed: tasksByStatus.value['Completed']?.length || 0,
}))

onMounted(async () => {
  await tasksStore.fetchTasks()
})
</script>

<template>
  <div class="page">
    <h1 class="page__title">My Tasks</h1>
    
    <!-- Status summary -->
    <div class="page__summary">
      <div class="page__summary-item">
        <span class="page__summary-count">{{ statusCounts.all }}</span>
        <span class="page__summary-label">All Tasks</span>
      </div>
      <div class="page__summary-item page__summary-item--not-started">
        <span class="page__summary-count">{{ statusCounts.notStarted }}</span>
        <span class="page__summary-label">Not Started</span>
      </div>
      <div class="page__summary-item page__summary-item--in-progress">
        <span class="page__summary-count">{{ statusCounts.inProgress }}</span>
        <span class="page__summary-label">In Progress</span>
      </div>
      <div class="page__summary-item page__summary-item--completed">
        <span class="page__summary-count">{{ statusCounts.completed }}</span>
        <span class="page__summary-label">Completed</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="page__error">
      <p>⚠️ {{ error }}</p>
    </div>

    <div class="page__content">
      <TaskList 
        :tasks="tasks" 
        :loading="loading" 
        empty-icon="✅"
        empty-title="All caught up!"
        empty-description="You don't have any tasks assigned. New tasks will appear here when created."
      />
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

.page__summary {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.page__summary-item {
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 100px;
  box-shadow: var(--shadow-sm);
}

.page__summary-item--not-started {
  border-bottom: 3px solid var(--color-text-muted);
}

.page__summary-item--in-progress {
  border-bottom: 3px solid var(--color-accent-blue);
}

.page__summary-item--completed {
  border-bottom: 3px solid var(--color-accent-green);
}

.page__summary-count {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.page__summary-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.page__error {
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-accent-red);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--color-accent-red);
}

.page__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
</style>
