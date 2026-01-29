---
name: vue-composables
description: 'Vue 3 composable patterns with reactive state, lifecycle hooks, and cleanup. Use when creating reusable logic, managing shared state, or implementing custom hooks.'
---

# Vue Composables Skill

Patterns for creating reusable Vue 3 composables with proper TypeScript typing.

## When to Use This Skill

- Creating reusable reactive logic
- Sharing state between components
- Implementing custom lifecycle hooks
- Managing async operations with cleanup
- Building utility composables

## Reference Documentation

For detailed patterns and conventions, see:
- [Vue Composables Instructions](../../instructions/vue-composables.instructions.md)

## Quick Reference

### Basic Composable Structure

```typescript
// frontend/src/composables/useFeature.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useFeature(initialValue: string) {
  // Reactive state
  const value = ref(initialValue)
  const isLoading = ref(false)
  
  // Computed
  const isEmpty = computed(() => value.value.length === 0)
  
  // Methods
  function updateValue(newValue: string) {
    value.value = newValue
  }
  
  async function fetchData() {
    isLoading.value = true
    try {
      // async operation
    } finally {
      isLoading.value = false
    }
  }
  
  // Lifecycle
  onMounted(() => {
    fetchData()
  })
  
  // Return public API
  return {
    value,
    isLoading,
    isEmpty,
    updateValue,
    fetchData
  }
}
```

### Critical Rules

1. **Prefix with `use`** (e.g., `useTaskFilter`)
2. **Return reactive refs** not raw values
3. **Clean up side effects** in `onUnmounted`
4. **Type all parameters and returns**
5. **Keep composables focused** on a single concern

### With Cleanup

```typescript
export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener
) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}
```

### With Async and Error Handling

```typescript
export function useAsync<T>(asyncFn: () => Promise<T>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  
  async function execute() {
    isLoading.value = true
    error.value = null
    
    try {
      data.value = await asyncFn()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      isLoading.value = false
    }
  }
  
  return { data, error, isLoading, execute }
}
```

### Shared State Pattern

```typescript
// Shared state outside function = singleton
const globalCount = ref(0)

export function useGlobalCounter() {
  function increment() {
    globalCount.value++
  }
  
  return {
    count: readonly(globalCount),
    increment
  }
}
```

## File Naming

- Composables: `useFeatureName.ts` (e.g., `useTaskFilter.ts`)
- Location: `frontend/src/composables/`
- Tests: `useFeatureName.spec.ts` alongside
