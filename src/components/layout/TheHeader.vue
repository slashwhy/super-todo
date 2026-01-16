<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const currentDate = new Date()
const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
const formattedDate = currentDate.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})
</script>

<template>
  <header class="header">
    <div class="header__brand">
      <h1 class="header__logo">
        <span class="header__logo-accent">Dash</span>board
      </h1>
    </div>

    <div class="header__search">
      <input
        v-model="searchQuery"
        type="search"
        class="header__search-input"
        placeholder="Search your task here..."
      />
      <button class="header__search-btn" aria-label="Search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </div>

    <div class="header__actions">
      <button class="header__action-btn header__action-btn--notification" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </button>

      <button class="header__action-btn header__action-btn--calendar" aria-label="Calendar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      </button>

      <div class="header__date">
        <span class="header__date-day">{{ dayName }}</span>
        <span class="header__date-full">{{ formattedDate }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  height: var(--header-height);
  padding: 0 var(--spacing-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header__brand {
  flex-shrink: 0;
}

.header__logo {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
}

.header__logo-accent {
  color: var(--color-primary);
}

.header__search {
  flex: 1;
  max-width: 695px;
  margin-left: var(--spacing-2xl);
  position: relative;
}

.header__search-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--spacing-md);
  padding-right: 44px;
  background-color: var(--color-background);
  border: none;
  border-radius: var(--radius-sm);
  font-family: 'Montserrat', sans-serif;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  box-shadow: -26px 108px 31px 0px rgba(0, 0, 0, 0),
    -17px 69px 28px 0px rgba(0, 0, 0, 0.01),
    -9px 39px 24px 0px rgba(0, 0, 0, 0.02),
    -4px 17px 18px 0px rgba(0, 0, 0, 0.03),
    -1px 4px 10px 0px rgba(0, 0, 0, 0.04);
}

.header__search-input::placeholder {
  color: var(--color-text-muted);
}

.header__search-input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.header__search-btn {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  color: white;
  transition: background-color 0.2s;
}

.header__search-btn:hover {
  background-color: var(--color-primary-dark);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-left: auto;
}

.header__action-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  color: white;
  transition: background-color 0.2s;
}

.header__action-btn:hover {
  background-color: var(--color-primary-dark);
}

.header__date {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: var(--spacing-sm);
}

.header__date-day {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-primary);
}

.header__date-full {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-accent-blue);
}
</style>
