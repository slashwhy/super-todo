<script setup lang="ts">
defineProps<{
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>()
</script>

<template>
  <span class="tooltip-wrapper" :class="`tooltip-wrapper--${position ?? 'top'}`">
    <slot />
    <span class="tooltip-wrapper__tip" role="tooltip">{{ text }}</span>
  </span>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-wrapper__tip {
  position: absolute;
  background: var(--color-text-primary);
  color: var(--color-background);
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  z-index: 1000;
}

.tooltip-wrapper:hover .tooltip-wrapper__tip {
  opacity: 1;
  transform: translateY(0);
}

/* Positions */
.tooltip-wrapper--top .tooltip-wrapper__tip {
  bottom: calc(100% + 6px);
  left: 50%;
  translate: -50% 0;
}

.tooltip-wrapper--bottom .tooltip-wrapper__tip {
  top: calc(100% + 6px);
  left: 50%;
  translate: -50% 0;
}

.tooltip-wrapper--left .tooltip-wrapper__tip {
  right: calc(100% + 6px);
  top: 50%;
  translate: 0 -50%;
}

.tooltip-wrapper--right .tooltip-wrapper__tip {
  left: calc(100% + 6px);
  top: 50%;
  translate: 0 -50%;
}
</style>
