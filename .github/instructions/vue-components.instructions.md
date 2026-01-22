---
applyTo: '**/*.vue'
---

# Vue 3 Component Development

## Component Structure

Use `<script setup lang="ts">` syntax for all components:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/types'

// Props with TypeScript
const props = defineProps<{
  task: Task
  editable?: boolean
}>()

// Emits with type safety
const emit = defineEmits<{
  update: [task: Task]
  delete: [id: string]
}>()

// Reactive state
const isExpanded = ref(false)

// Computed properties for derived state
const statusColor = computed(() => props.task.status.color)
</script>

<template>
  <!-- Single root element preferred -->
</template>

<style scoped>
/* Component-scoped styles */
</style>
```

## Naming Conventions

- **Files:** `PascalCase.vue` (e.g., `TaskCard.vue`)
- **Components:** PascalCase in templates (`<TaskCard />`)
- **Props:** camelCase in script, kebab-case in templates
- **Events:** kebab-case (`@update-task`)

## Component Organization

| Directory | Purpose |
|-----------|---------|
| `src/components/layout/` | Layout components (MainLayout, TheHeader, TheSidebar) |
| `src/components/` | Reusable UI components |
| `src/views/` | Route-level page components |

## Props and Emits

- Use TypeScript interfaces for complex prop types
- Define defaults with `withDefaults()`:

```typescript
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}>(), {
  size: 'md',
  loading: false
})
```

## Best Practices

- Keep components focused on single responsibility
- Extract reusable logic into composables (`src/composables/`)
- Use `v-model` with `defineModel()` for two-way binding
- Prefer `computed` over watchers for derived state
- Use slots for flexible composition
- Lazy-load heavy components with `defineAsyncComponent`

## Template Guidelines

- Use `v-if` for conditional rendering, `v-show` for frequent toggles
- Always use `:key` with `v-for` loops
- Avoid complex expressions in templates - use computed properties
- Use `@click.prevent` and `@submit.prevent` for event modifiers

## Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- Add ARIA attributes for dynamic content
- Ensure keyboard navigation works
- Provide meaningful `alt` text for images
