<script setup lang="ts">
import type { Task } from '@/types/task'
import TaskCard from './TaskCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'

withDefaults(
  defineProps<{
    tasks: Task[]
    loading?: boolean
    emptyIcon?: string
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    loading: false,
    emptyIcon: '📋',
    emptyTitle: 'No tasks found',
    emptyDescription: '',
  },
)

const emit = defineEmits<{
  'task-click': [task: Task]
  'task-updated': []
}>()
</script>

<template>
  <div class="task-list" data-testid="task-list">
    <!-- Loading skeleton -->
    <Transition name="fade" mode="out-in">
      <SkeletonCard v-if="loading" key="loading" data-testid="task-list-loading" />

      <!-- Empty state -->
      <EmptyState
        v-else-if="tasks.length === 0"
        key="empty"
        :icon="emptyIcon"
        :title="emptyTitle"
        :description="emptyDescription"
        data-testid="task-list-empty"
      >
        <template #action>
          <slot name="empty-action"></slot>
        </template>
      </EmptyState>

      <!-- Task grid wrapper (for fade between states) -->
      <div v-else key="grid" class="task-list__grid-wrapper">
        <TransitionGroup
          name="task-grid"
          tag="div"
          class="task-list__grid"
          data-testid="task-list-grid"
        >
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @click="emit('task-click', task)"
            @updated="emit('task-updated')"
          />
        </TransitionGroup>
      </div>
    </Transition>
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

/* Individual item enter/leave — only the affected card animates */
.task-grid-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.task-grid-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  position: absolute;
}

.task-grid-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.task-grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Remaining items slide to fill the gap smoothly */
.task-grid-move {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Fade transition for state switching */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
