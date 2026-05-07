<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const searchQuery = ref('')
const isScrolled = ref(false)
const { isDark, toggle: toggleDark } = useDarkMode()

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// Use computed for reactive date values (updates if component remounts)
const currentDate = computed(() => new Date())
const dayName = computed(() => currentDate.value.toLocaleDateString('en-US', { weekday: 'long' }))
const formattedDate = computed(() =>
  currentDate.value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
)

const emit = defineEmits<{
  'toggle-sidebar': []
}>()
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }" role="banner">
    <button
      class="header__hamburger"
      type="button"
      aria-label="Toggle menu"
      @click="emit('toggle-sidebar')"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="header__brand">
      <h1 class="header__logo"><span class="header__logo-accent">Dash</span>board</h1>
    </div>

    <div class="header__search" role="search">
      <input
        v-model="searchQuery"
        type="search"
        class="header__search-input"
        placeholder="Search your task here..."
        aria-label="Search tasks"
      />
      <button class="header__search-btn" type="button" aria-label="Search">
        <AppIcon name="search" />
      </button>
    </div>

    <div class="header__actions">
      <button
        class="header__action-btn header__action-btn--theme"
        type="button"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleDark"
      >
        <span class="header__theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
      </button>

      <button
        class="header__action-btn header__action-btn--notification"
        type="button"
        aria-label="Notifications"
      >
        <AppIcon name="notification" :size="18" />
      </button>

      <button
        class="header__action-btn header__action-btn--calendar"
        type="button"
        aria-label="Calendar"
      >
        <AppIcon name="calendar" :size="14" />
      </button>

      <div class="header__date" aria-label="Current date">
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
  transition:
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.header--scrolled {
  box-shadow: none;
}

.header__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 34px;
  height: 34px;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.header__hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 1px;
  transition: transform 0.2s;
}

.header__hamburger:hover {
  background-color: var(--color-surface);
}

@media (max-width: 768px) {
  .header__hamburger {
    display: flex;
  }
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
  transition: max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.header__search:focus-within {
  max-width: 750px;
}

.header__search-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--spacing-md);
  padding-right: 44px;
  background-color: var(--color-background);
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  font-family: 'Montserrat', sans-serif;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
}

.header__search-input::placeholder {
  color: var(--color-text-muted);
}

.header__search-input:focus {
  outline: none;
  border-color: var(--color-primary);
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
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.header__action-btn--theme {
  background-color: var(--color-surface-alt);
  border: 1px solid var(--color-border);
}

.header__theme-icon {
  font-size: 16px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.header__action-btn--theme:hover .header__theme-icon {
  transform: rotate(20deg) scale(1.2);
}

.header__action-btn:hover {
  background-color: var(--color-primary-dark);
  transform: scale(1.08);
}

.header__action-btn:active {
  transform: scale(0.95);
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

/* Mobile responsive */
@media (max-width: 768px) {
  .header {
    padding: 0 var(--spacing-md);
    height: 60px;
  }

  .header__search {
    display: none;
  }

  .header__date {
    display: none;
  }

  .header__action-btn--calendar {
    display: none;
  }
}
</style>
