<script setup lang="ts">
// Dashboard view - main content will be added later
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <div class="dashboard__welcome">
        <h1 class="dashboard__title">Welcome back, Sundar 👋</h1>
      </div>
      
      <div class="dashboard__team">
        <div class="dashboard__team-avatars">
          <div class="dashboard__team-avatar" v-for="i in 5" :key="i"></div>
          <div class="dashboard__team-more">+4</div>
        </div>
        <button class="dashboard__invite-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Invite
        </button>
      </div>
    </div>
    
    <!-- Content placeholder - will be filled in later -->
    <div class="dashboard__content">
      <p class="dashboard__placeholder">Dashboard content will be added here</p>
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
  border-radius: var(--radius-sm);
  background-color: var(--color-text-muted);
  margin-left: -8px;
}

.dashboard__team-avatar:first-child {
  margin-left: 0;
}

.dashboard__team-more {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  font-weight: 500;
  margin-left: -8px;
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
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard__placeholder {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}
</style>
