<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskDetailModal from '@/components/tasks/TaskDetailModal.vue'
import { useTasksStore } from '@/stores/tasks'
import type { Task } from '@/types/task'

const tasksStore = useTasksStore()
const { vitalTasks, loading, error } = storeToRefs(tasksStore)

const selectedTask = ref<Task | null>(null)

onMounted(async () => {
  await tasksStore.fetchTasks({ isVital: 'true' })
})

function handleTaskClick(task: Task) {
  selectedTask.value = task
}

async function handleTaskChanged() {
  await tasksStore.fetchTasks({ isVital: 'true' })
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">⭐ Vital Tasks</h1>
      <span class="page__count">{{ vitalTasks.length }} tasks</span>
    </div>

    <p class="page__description">
      Tasks marked as vital require immediate attention and priority handling.
    </p>

    <!-- Error state -->
    <div v-if="error" class="page__error">
      <p>⚠️ {{ error }}</p>
    </div>

    <div class="page__content">
      <TaskList
        :tasks="vitalTasks"
        :loading="loading"
        empty-icon="⭐"
        empty-title="No vital tasks"
        empty-description="Mark important tasks as vital to prioritize them and see them here."
        @task-click="handleTaskClick"
        @task-updated="handleTaskChanged"
      />
    </div>

    <!-- Detail Modal -->
    <TaskDetailModal
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @updated="handleTaskChanged"
      @deleted="handleTaskChanged"
    />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.page__title {
  font-size: var(--font-size-3xl);
  font-weight: 500;
  color: var(--color-text-primary);
}

.page__count {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.page__description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  margin: 0;
}

.page__error {
  background-color: rgba(242, 30, 30, 0.1);
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
