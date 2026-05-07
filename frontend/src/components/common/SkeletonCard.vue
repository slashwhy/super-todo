<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  { count: 6 },
)
</script>

<template>
  <div class="skeleton-grid">
    <div v-for="i in count" :key="i" class="skeleton-card" :style="{ '--delay': `${i * 100}ms` }">
      <div class="skeleton-card__header">
        <div class="skeleton skeleton--badge"></div>
      </div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text skeleton--text-short"></div>
      <div class="skeleton-card__footer">
        <div class="skeleton skeleton--tag"></div>
        <div class="skeleton skeleton--avatar"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.skeleton-card {
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  animation: skeleton-fade-in 0.4s ease backwards;
  animation-delay: var(--delay, 0ms);
}

@keyframes skeleton-fade-in {
  from {
    opacity: 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-background) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton--badge {
  width: 60px;
  height: 20px;
  border-radius: 20px;
}

.skeleton--title {
  height: 18px;
  width: 80%;
}

.skeleton--text {
  height: 12px;
  width: 100%;
}

.skeleton--text-short {
  width: 60%;
}

.skeleton--tag {
  width: 70px;
  height: 20px;
  border-radius: 20px;
}

.skeleton--avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.skeleton-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xs);
}
</style>
