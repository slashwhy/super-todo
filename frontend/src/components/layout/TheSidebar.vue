<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/icons/AppIcon.vue'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

const route = useRoute()

const user = {
  name: 'Sundar Gurung',
  email: 'sundargurung360@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
  { id: 'vital-task', label: 'Vital Task', icon: 'vital', path: '/vital-tasks' },
  { id: 'my-task', label: 'My Task', icon: 'task', path: '/my-tasks' },
  { id: 'task-categories', label: 'Task Categories', icon: 'categories', path: '/categories' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
  { id: 'help', label: 'Help', icon: 'help', path: '/help' }
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="sidebar">
    <!-- User Profile -->
    <div class="sidebar__profile">
      <img :src="user.avatar" :alt="user.name" class="sidebar__avatar" />
      <div class="sidebar__user-info">
        <h2 class="sidebar__user-name">{{ user.name }}</h2>
        <p class="sidebar__user-email">{{ user.email }}</p>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="sidebar__nav" aria-label="Main navigation">
      <ul class="sidebar__nav-list">
        <li v-for="item in mainNavItems" :key="item.id">
          <router-link
            :to="item.path"
            class="sidebar__nav-item"
            :class="{ 'sidebar__nav-item--active': activePath === item.path }"
            :aria-current="activePath === item.path ? 'page' : undefined"
          >
            <span class="sidebar__nav-icon">
              <AppIcon :name="item.icon" />
            </span>
            <span class="sidebar__nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <div class="sidebar__footer">
      <button class="sidebar__logout" type="button" aria-label="Logout from application">
        <span class="sidebar__nav-icon">
          <AppIcon name="logout" />
        </span>
        <span class="sidebar__nav-label">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background-color: var(--color-primary);
  border-top-right-radius: var(--radius-sm);
  border-bottom-right-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.sidebar__profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.sidebar__avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: var(--spacing-md);
}

.sidebar__user-info {
  color: var(--color-text-white);
}

.sidebar__user-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.sidebar__user-email {
  font-size: var(--font-size-sm);
  font-weight: 400;
  opacity: 0.9;
}

.sidebar__nav {
  flex: 1;
}

.sidebar__nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-text-white);
  font-size: var(--font-size-lg);
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar__nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar__nav-item--active {
  background-color: var(--color-surface-alt);
  color: var(--color-primary);
}

.sidebar__nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.sidebar__nav-label {
  flex: 1;
}

.sidebar__footer {
  margin-top: auto;
  padding-top: var(--spacing-lg);
}

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-text-white);
  font-size: var(--font-size-lg);
  font-weight: 500;
  transition: background-color 0.2s;
}

.sidebar__logout:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
