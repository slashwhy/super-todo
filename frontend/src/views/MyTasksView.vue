<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskCreateModal from '@/components/tasks/TaskCreateModal.vue'
import TaskDetailModal from '@/components/tasks/TaskDetailModal.vue'
import { useTasksStore } from '@/stores/tasks'
import type { Task } from '@/types/task'

const tasksStore = useTasksStore()
const { tasks, loading, error, tasksByStatus } = storeToRefs(tasksStore)

const showCreateModal = ref(false)
const selectedTask = ref<Task | null>(null)

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

function handleTaskClick(task: Task) {
  selectedTask.value = task
}

async function handleTaskChanged() {
  await tasksStore.fetchTasks()
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">My Tasks</h1>
      <button class="page__add-btn" type="button" @click="showCreateModal = true">
        + New Task
      </button>
    </div>

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
        @task-click="handleTaskClick"
        @task-updated="handleTaskChanged"
      />
    </div>

    <!-- Create Modal -->
    <TaskCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskChanged"
    />

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
  justify-content: space-between;
  align-items: center;
}

.page__title {
  font-size: var(--font-size-3xl);
  font-weight: 500;
  color: var(--color-text-primary);
}

.page__add-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page__add-btn:hover {
  background-color: var(--color-primary-dark);
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
