<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Task } from '@/types/task'
import { useConfigStore } from '@/stores/config'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  click: [task: Task]
  updated: []
}>()

const configStore = useConfigStore()
const tasksStore = useTasksStore()
const { statuses } = storeToRefs(configStore)
const { showSuccess, showError } = useToast()

const showStatusMenu = ref(false)

async function changeStatus(task: Task, statusId: string) {
  showStatusMenu.value = false
  if (statusId === task.statusId) return
  try {
    await tasksStore.updateTask(task.id, { statusId })
    showSuccess('Status updated')
    emit('updated')
  } catch (e) {
    showError((e as Error).message)
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getStatusClass(statusName: string): string {
  const statusMap: Record<string, string> = {
    'Not Started': 'not-started',
    'In Progress': 'in-progress',
    Completed: 'completed',
  }
  return statusMap[statusName] || 'default'
}

function getPriorityClass(priorityName: string): string {
  const priorityMap: Record<string, string> = {
    Extreme: 'extreme',
    Moderate: 'moderate',
    Low: 'low',
  }
  return priorityMap[priorityName] || 'default'
}
</script>

<template>
  <article
    class="task-card"
    :class="{
      'task-card--vital': task.isVital,
      'task-card--completed': task.status.name === 'Completed',
    }"
    :data-testid="`task-card-${task.id}`"
    @click="emit('click', task)"
  >
    <div class="task-card__header">
      <span
        class="task-card__priority"
        :class="`task-card__priority--${getPriorityClass(task.priority.name)}`"
        :style="{ backgroundColor: task.priority.color }"
      >
        {{ task.priority.name }}
      </span>
      <span v-if="task.isVital" class="task-card__vital-badge" aria-label="Vital task"> ⭐ </span>
    </div>

    <h3 class="task-card__title">{{ task.title }}</h3>

    <p v-if="task.description" class="task-card__description">
      {{ task.description }}
    </p>

    <div class="task-card__footer">
      <div class="task-card__status-wrapper">
        <button
          class="task-card__status-btn"
          :class="`task-card__status--${getStatusClass(task.status.name)}`"
          :style="{ color: task.status.color }"
          type="button"
          aria-label="Change status"
          @click.stop="showStatusMenu = !showStatusMenu"
        >
          {{ task.status.name }} ▾
        </button>
        <div v-if="showStatusMenu" class="task-card__status-menu" @click.stop>
          <button
            v-for="s in statuses"
            :key="s.id"
            class="task-card__status-option"
            :class="{ 'task-card__status-option--active': s.id === task.statusId }"
            :style="{ color: s.color }"
            type="button"
            @click="changeStatus(task, s.id)"
          >
            {{ s.name }}
          </button>
        </div>
      </div>

      <div class="task-card__meta">
        <span v-if="task.category" class="task-card__category">
          {{ task.category.name }}
        </span>
        <span v-if="task.dueDate" class="task-card__due-date">
          📅 {{ formatDate(task.dueDate) }}
        </span>
        <div
          v-if="task.assignee"
          class="task-card__avatar"
          :title="task.assignee.name"
          :aria-label="`Assigned to ${task.assignee.name}`"
        >
          {{ task.assignee.name.charAt(0) }}
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
  height: 100%;
}

.task-card:hover {
  background-color: var(--color-surface);
}

.task-card:active {
  opacity: 0.9;
}

.task-card--vital {
}

.task-card--completed {
  opacity: 0.75;
}

.task-card--completed .task-card__title {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-card__priority {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 20px;
  color: var(--color-text-white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-card__priority--extreme {
  background-color: var(--color-accent-red);
}

.task-card__priority--moderate {
  background-color: var(--color-accent-blue);
}

.task-card__priority--low {
  background-color: var(--color-accent-green);
}

.task-card__vital-badge {
  font-size: var(--font-size-md);
  animation: pulse-star 2s ease-in-out infinite;
}

@keyframes pulse-star {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.task-card__title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.4;
}

.task-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.task-card__status {
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.task-card__status--not-started {
  color: var(--color-text-muted);
}

.task-card__status--in-progress {
  color: var(--color-accent-blue);
}

.task-card__status--completed {
  color: var(--color-accent-green);
}

.task-card__status-wrapper {
  position: relative;
}

.task-card__status-btn {
  font-size: var(--font-size-xs);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.task-card__status-btn:hover {
  background-color: var(--color-surface);
}

.task-card__status-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  z-index: 100;
  min-width: 140px;
  overflow: hidden;
  animation: menu-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}

@keyframes menu-pop {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.task-card__status-option {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-align: left;
  transition: background-color 0.15s;
}

.task-card__status-option:hover {
  background-color: var(--color-surface);
}

.task-card__status-option--active {
  background-color: var(--color-surface);
}

.task-card__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.task-card__category {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  background-color: var(--color-surface);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 20px;
  transition: background-color 0.2s ease;
}

.task-card:hover .task-card__category {
  background-color: var(--color-border);
}

.task-card__due-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.task-card__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
  transition: transform 0.2s ease;
}

.task-card:hover .task-card__avatar {
  transform: scale(1.1);
}
</style>
