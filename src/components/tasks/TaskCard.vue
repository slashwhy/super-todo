<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{
  task: Task
}>()

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

function getStatusClass(statusName: string): string {
  const statusMap: Record<string, string> = {
    'Not Started': 'not-started',
    'In Progress': 'in-progress',
    'Completed': 'completed'
  }
  return statusMap[statusName] || 'default'
}

function getPriorityClass(priorityName: string): string {
  const priorityMap: Record<string, string> = {
    'Extreme': 'extreme',
    'Moderate': 'moderate',
    'Low': 'low'
  }
  return priorityMap[priorityName] || 'default'
}
</script>

<template>
  <article 
    class="task-card" 
    :class="{ 'task-card--vital': task.isVital }"
    :data-testid="`task-card-${task.id}`"
  >
    <div class="task-card__header">
      <span 
        class="task-card__priority" 
        :class="`task-card__priority--${getPriorityClass(task.priority.name)}`"
        :style="{ backgroundColor: task.priority.color }"
      >
        {{ task.priority.name }}
      </span>
      <span v-if="task.isVital" class="task-card__vital-badge" aria-label="Vital task">
        ⭐
      </span>
    </div>

    <h3 class="task-card__title">{{ task.title }}</h3>
    
    <p v-if="task.description" class="task-card__description">
      {{ task.description }}
    </p>

    <div class="task-card__footer">
      <span 
        class="task-card__status" 
        :class="`task-card__status--${getStatusClass(task.status.name)}`"
        :style="{ color: task.status.color }"
      >
        {{ task.status.name }}
      </span>
      
      <div class="task-card__meta">
        <span v-if="task.category" class="task-card__category">
          {{ task.category.name }}
        </span>
        <span v-if="task.dueDate" class="task-card__due-date">
          📅 {{ formatDate(task.dueDate) }}
        </span>
      </div>
    </div>

    <div v-if="task.assignee" class="task-card__assignee">
      <div 
        class="task-card__avatar" 
        :title="task.assignee.name"
        :aria-label="`Assigned to ${task.assignee.name}`"
      >
        {{ task.assignee.name.charAt(0) }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-card--vital {
  border-left: 4px solid var(--color-primary);
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-card__priority {
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-white);
  text-transform: uppercase;
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
  margin-top: var(--spacing-xs);
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
  border-radius: var(--radius-sm);
}

.task-card__due-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.task-card__assignee {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-xs);
}

.task-card__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 500;
}
</style>
