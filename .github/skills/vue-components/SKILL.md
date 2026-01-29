---
name: vue-components
description: 'Vue 3 component patterns with Composition API, TypeScript, and project conventions. Use when creating Vue components, handling props, emits, slots, or component lifecycle.'
---

# Vue Components Skill

Patterns and conventions for building Vue 3 components in this project.

## When to Use This Skill

- Creating new Vue components
- Refactoring existing components
- Adding props, emits, or slots
- Implementing component lifecycle hooks
- Structuring component templates

## Reference Documentation

For detailed patterns and conventions, see:
- [Vue Components Instructions](../../instructions/vue-components.instructions.md)

## Quick Reference

### Component Structure

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// Props with TypeScript
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits with TypeScript
const emit = defineEmits<{
  update: [value: string]
  delete: []
}>()

// Reactive state
const isOpen = ref(false)

// Computed properties
const displayTitle = computed(() => props.title.toUpperCase())

// Methods
function handleClick() {
  emit('update', 'new value')
}
</script>

<template>
  <div class="component-name" data-testid="component-name">
    <h2>{{ displayTitle }}</h2>
    <button data-testid="action-btn" @click="handleClick">
      Action
    </button>
  </div>
</template>

<style scoped>
.component-name {
  padding: var(--spacing-md);
  background: var(--color-surface);
}
</style>
```

### Critical Rules

1. **Always use `<script setup lang="ts">`**
2. **Always include `data-testid` attributes** for testable elements
3. **Never use `v-if` with `v-for`** on the same element
4. **Use CSS variables** from `frontend/src/assets/styles/variables.css`
5. **Never hardcode colors or spacing**

### Props Patterns

```typescript
// Required prop
interface Props {
  id: string
}

// Optional with default
interface Props {
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Complex types
interface Props {
  task: Task
  options?: TaskOption[]
}
```

### Emits Patterns

```typescript
// Simple emit
const emit = defineEmits<{
  close: []
}>()

// Emit with payload
const emit = defineEmits<{
  update: [task: Task]
  delete: [id: string]
}>()
```

### Slots

```vue
<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

## File Naming

- Components: `PascalCase.vue` (e.g., `TaskCard.vue`)
- Tests: `ComponentName.spec.ts` alongside the component
- Location: `frontend/src/components/` for reusable, `frontend/src/views/` for pages
