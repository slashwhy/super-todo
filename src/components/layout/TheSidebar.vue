<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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

const isActive = (path: string) => {
  return route.path === path
}
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
    <nav class="sidebar__nav">
      <ul class="sidebar__nav-list">
        <li v-for="item in mainNavItems" :key="item.id">
          <router-link
            :to="item.path"
            class="sidebar__nav-item"
            :class="{ 'sidebar__nav-item--active': isActive(item.path) }"
          >
            <span class="sidebar__nav-icon">
              <!-- Dashboard Icon -->
              <svg v-if="item.icon === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <!-- Vital Task Icon -->
              <svg v-else-if="item.icon === 'vital'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <!-- My Task Icon -->
              <svg v-else-if="item.icon === 'task'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <!-- Categories Icon -->
              <svg v-else-if="item.icon === 'categories'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <!-- Settings Icon -->
              <svg v-else-if="item.icon === 'settings'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <!-- Help Icon -->
              <svg v-else-if="item.icon === 'help'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span class="sidebar__nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <div class="sidebar__footer">
      <button class="sidebar__logout">
        <span class="sidebar__nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
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
