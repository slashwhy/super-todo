---
description: 'Patterns for Vue 3 composables with reactive state, cleanup, and TypeScript'
applyTo: '**/composables/**/*.ts'
---

# Vue Composables Development

> Create composables in `frontend/src/composables/` directory when needed.

## Composable Structure

Create reusable logic functions that encapsulate reactive state and side effects:

```typescript
import { ref, computed, onUnmounted } from 'vue'

export function useFeature(options?: FeatureOptions) {
  // Reactive state
  const data = ref<Data | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Computed properties
  const isEmpty = computed(() => !data.value || data.value.length === 0)

  // Methods
  async function fetch() {
    loading.value = true
    error.value = null
    try {
      data.value = await api.getData()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    // Cancel pending requests, clear timers, etc.
  })

  // Return reactive state and methods
  return {
    data,
    loading,
    error,
    isEmpty,
    fetch
  }
}
```

## Naming Conventions

- Prefix with `use` (e.g., `useTasks`, `useAuth`, `useLocalStorage`)
- File name matches function: `useTasks.ts` exports `useTasks()`
- Return object with named properties (not tuple)

## Common Patterns

### Data Fetching Composable

```typescript
export function useTasks() {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  
  async function fetchTasks(filters?: TaskFilters) {
    loading.value = true
    try {
      const response = await fetch('/api/tasks?' + new URLSearchParams(filters))
      tasks.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  return { tasks, loading, fetchTasks }
}
```

### State with LocalStorage

```typescript
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return data
}
```

## Best Practices

- Keep composables focused on one concern
- Always handle loading and error states
- Clean up side effects in `onUnmounted`
- Use `watchEffect` for automatic dependency tracking
- Use `watch` with explicit dependencies when needed
- Type return values for better IDE support
- Accept options object for configuration

## Common Pitfalls

- ❌ Not cleaning up timers/listeners → Memory leaks (use `onUnmounted`)
- ❌ Accessing `.value` in template → Not needed, Vue unwraps automatically
- ❌ Creating composables inside components → Define at module level
- ❌ Mixing concerns in one composable → Split into focused units

## Testing Composables

Test composables by mounting a simple component wrapper:

```typescript
import { mount } from '@vue/test-utils'
import { useTasks } from '@/composables/useTasks'

const TestComponent = defineComponent({
  setup() {
    return useTasks()
  },
  template: '<div />'
})

test('fetches tasks', async () => {
  const wrapper = mount(TestComponent)
  await wrapper.vm.fetchTasks()
  expect(wrapper.vm.tasks).toHaveLength(5)
})
```
