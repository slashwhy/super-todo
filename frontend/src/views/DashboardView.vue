<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppIcon from '@/components/icons/AppIcon.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()
const { tasks, stats, loading, error } = storeToRefs(tasksStore)

const teamMembers = [
  { id: 1, name: 'Alice', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: 'Bob', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: 'Carol', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: 'David', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 5, name: 'Eve', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' }
]
const additionalMembersCount = 4

onMounted(async () => {
  await Promise.all([
    tasksStore.fetchTasks(),
    tasksStore.fetchStats()
  ])
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <div class="dashboard__welcome">
        <h1 class="dashboard__title">Welcome back, Demo User 👋</h1>
      </div>
      
      <div class="dashboard__team">
        <div class="dashboard__team-avatars" role="group" aria-label="Team members">
          <img 
            v-for="member in teamMembers" 
            :key="member.id" 
            :src="member.avatar"
            :alt="member.name"
            class="dashboard__team-avatar"
          />
          <div class="dashboard__team-more" :aria-label="`${additionalMembersCount} more team members`">
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
      <div class="dashboard__stat-card">
        <span class="dashboard__stat-value">{{ stats.total }}</span>
        <span class="dashboard__stat-label">Total Tasks</span>
      </div>
      <div class="dashboard__stat-card dashboard__stat-card--completed">
        <span class="dashboard__stat-value">{{ stats.completed }}</span>
        <span class="dashboard__stat-label">Completed</span>
        <span class="dashboard__stat-percent">{{ stats.completedPercentage }}%</span>
      </div>
      <div class="dashboard__stat-card dashboard__stat-card--progress">
        <span class="dashboard__stat-value">{{ stats.inProgress }}</span>
        <span class="dashboard__stat-label">In Progress</span>
        <span class="dashboard__stat-percent">{{ stats.inProgressPercentage }}%</span>
      </div>
      <div class="dashboard__stat-card dashboard__stat-card--vital">
        <span class="dashboard__stat-value">{{ stats.vital }}</span>
        <span class="dashboard__stat-label">Vital Tasks</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="dashboard__error">
      <p>⚠️ {{ error }}</p>
    </div>
    
    <!-- Tasks section -->
    <div class="dashboard__content">
      <h2 class="dashboard__section-title">Recent Tasks</h2>
      <TaskList 
        :tasks="tasks.slice(0, 6)" 
        :loading="loading" 
        empty-icon="🚀"
        empty-title="No tasks yet"
        empty-description="Create your first task to get started and boost your productivity!"
      />
    </div>
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
}

.dashboard__team-avatar:first-child {
  margin-left: 0;
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
  transition: background-color 0.2s, color 0.2s;
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

.dashboard__section-title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.dashboard__stat-card {
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.dashboard__stat-card--completed {
  border-left: 4px solid var(--color-accent-green);
}

.dashboard__stat-card--progress {
  border-left: 4px solid var(--color-accent-blue);
}

.dashboard__stat-card--vital {
  border-left: 4px solid var(--color-primary);
}

.dashboard__stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.dashboard__stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.dashboard__stat-percent {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.dashboard__error {
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-accent-red);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  color: var(--color-accent-red);
}
</style>
