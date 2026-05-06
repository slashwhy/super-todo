<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppIcon from '@/components/icons/AppIcon.vue'
import AppTooltip from '@/components/common/AppTooltip.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskCreateModal from '@/components/tasks/TaskCreateModal.vue'
import TaskDetailModal from '@/components/tasks/TaskDetailModal.vue'
import { useTasksStore } from '@/stores/tasks'
import { useAnimatedCounter } from '@/composables/useAnimatedCounter'
import type { Task } from '@/types/task'

const tasksStore = useTasksStore()
const { tasks, stats, loading, error } = storeToRefs(tasksStore)

const showCreateModal = ref(false)
const selectedTask = ref<Task | null>(null)

// Animated stat counters
const totalSource = computed(() => stats.value?.total ?? 0)
const completedSource = computed(() => stats.value?.completed ?? 0)
const inProgressSource = computed(() => stats.value?.inProgress ?? 0)
const vitalSource = computed(() => stats.value?.vital ?? 0)

const animatedTotal = useAnimatedCounter(totalSource)
const animatedCompleted = useAnimatedCounter(completedSource)
const animatedInProgress = useAnimatedCounter(inProgressSource)
const animatedVital = useAnimatedCounter(vitalSource)

const teamMembers = [
  {
    id: 1,
    name: 'Alice',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Bob',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Carol',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'David',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Eve',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  },
]
const additionalMembersCount = 4

onMounted(async () => {
  await Promise.all([tasksStore.fetchTasks(), tasksStore.fetchStats()])
})

function handleTaskClick(task: Task) {
  selectedTask.value = task
}

async function handleTaskCreated() {
  await tasksStore.fetchStats()
}

async function handleTaskChanged() {
  await Promise.all([tasksStore.fetchTasks(), tasksStore.fetchStats()])
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <div class="dashboard__welcome">
        <h1 class="dashboard__title">Welcome back, Demo User 👋</h1>
      </div>

      <div class="dashboard__team">
        <div class="dashboard__team-avatars" role="group" aria-label="Team members">
          <AppTooltip v-for="member in teamMembers" :key="member.id" :text="member.name">
            <img :src="member.avatar" :alt="member.name" class="dashboard__team-avatar" />
          </AppTooltip>
          <div
            class="dashboard__team-more"
            :aria-label="`${additionalMembersCount} more team members`"
          >
            +{{ additionalMembersCount }}
          </div>
        </div>
        <button class="dashboard__invite-btn" type="button" aria-label="Invite team member">
          <AppIcon name="user-add" />
          Invite
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div v-if="stats" class="dashboard__stats">
      <div class="dashboard__stat-row">
        <span class="dashboard__stat-label">Total</span>
        <span class="dashboard__stat-value">{{ animatedTotal }}</span>
      </div>
      <div class="dashboard__stat-row">
        <span class="dashboard__stat-label">Completed</span>
        <div class="dashboard__stat-bar">
          <div
            class="dashboard__stat-bar-fill dashboard__stat-bar-fill--green"
            :style="{ width: `${stats.completedPercentage}%` }"
          ></div>
        </div>
        <span class="dashboard__stat-value">{{ animatedCompleted }}</span>
        <span class="dashboard__stat-percent">{{ stats.completedPercentage }}%</span>
      </div>
      <div class="dashboard__stat-row">
        <span class="dashboard__stat-label">In Progress</span>
        <div class="dashboard__stat-bar">
          <div
            class="dashboard__stat-bar-fill dashboard__stat-bar-fill--blue"
            :style="{ width: `${stats.inProgressPercentage}%` }"
          ></div>
        </div>
        <span class="dashboard__stat-value">{{ animatedInProgress }}</span>
        <span class="dashboard__stat-percent">{{ stats.inProgressPercentage }}%</span>
      </div>
      <div class="dashboard__stat-row">
        <span class="dashboard__stat-label">Vital</span>
        <span class="dashboard__stat-value dashboard__stat-value--vital">{{ animatedVital }}</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="dashboard__error">
      <p>⚠️ {{ error }}</p>
    </div>

    <!-- Tasks section -->
    <div class="dashboard__content">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Recent Tasks</h2>
        <button class="dashboard__create-btn" type="button" @click="showCreateModal = true">
          + New Task
        </button>
      </div>
      <TaskList
        :tasks="tasks.slice(0, 6)"
        :loading="loading"
        empty-icon="🚀"
        empty-title="No tasks yet"
        empty-description="Create your first task to get started and boost your productivity!"
        @task-click="handleTaskClick"
        @task-updated="handleTaskChanged"
      />
    </div>

    <!-- Create Modal -->
    <TaskCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskCreated"
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
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.dashboard__welcome {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.dashboard__title {
  font-size: var(--font-size-3xl);
  font-weight: 500;
  color: var(--color-text-primary);
}

.dashboard__team {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.dashboard__team-avatars {
  display: flex;
  align-items: center;
}

.dashboard__team-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-surface-alt);
  margin-left: -10px;
  transition:
    transform 0.2s ease,
    z-index 0s;
}

.dashboard__team-avatar:first-child {
  margin-left: 0;
}

.dashboard__team-avatar:hover {
  transform: scale(1.2);
  z-index: 2;
}

.dashboard__team-more {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-left: -10px;
  border: 2px solid var(--color-surface-alt);
}

.dashboard__invite-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  font-size: var(--font-size-base);
  font-weight: 500;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.dashboard__invite-btn:hover {
  background-color: var(--color-primary);
  color: white;
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.dashboard__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard__section-title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.dashboard__create-btn {
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

.dashboard__create-btn:hover {
  background-color: var(--color-primary-dark);
}

.dashboard__create-btn:active {
  opacity: 0.9;
}

.dashboard__stats {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.dashboard__stat-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  animation: stat-enter 0.4s ease backwards;
  min-width: 120px;
}

.dashboard__stat-row:nth-child(1) {
  animation-delay: 0ms;
}
.dashboard__stat-row:nth-child(2) {
  animation-delay: 60ms;
}
.dashboard__stat-row:nth-child(3) {
  animation-delay: 120ms;
}
.dashboard__stat-row:nth-child(4) {
  animation-delay: 180ms;
}

@keyframes stat-enter {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
}

.dashboard__stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.dashboard__stat-value {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 28px;
}

.dashboard__stat-value--vital {
  color: var(--color-primary);
}

.dashboard__stat-percent {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  min-width: 32px;
}

.dashboard__stat-bar {
  width: 80px;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.dashboard__stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard__stat-bar-fill--green {
  background: var(--color-accent-green);
}

.dashboard__stat-bar-fill--blue {
  background: var(--color-accent-blue);
}

.dashboard__error {
  background-color: rgba(242, 30, 30, 0.1);
  border: 1px solid var(--color-accent-red);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--color-accent-red);
}
</style>
