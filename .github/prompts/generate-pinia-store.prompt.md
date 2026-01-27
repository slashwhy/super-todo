---
description: Generate Pinia store using Setup Store syntax with TypeScript
agent: Implement
---

# Generate Pinia Store

Create a new Pinia store following the Setup Store pattern.

## Task

Generate a complete Pinia store with:
- Setup Store syntax (not Options API)
- TypeScript types for state
- Async actions for API calls
- Computed getters for derived state

## Requirements

- Use Setup Store syntax with `defineStore()` and setup function
- Define explicit TypeScript interfaces for state shape
- Use `ref()` for state, `computed()` for getters
- Handle loading and error states
- Never mutate state directly from components

## Context

Reference these files for conventions:
- `.github/instructions/pinia-stores.instructions.md` for store patterns
- `src/stores/tasks.ts` for existing store example
- `src/types/task.ts` for type definitions

## Output

Provide the complete store file with:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { YourType } from '@/types'

export const useYourStore = defineStore('storeName', () => {
  // State
  const items = ref<YourType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const itemCount = computed(() => items.value.length)

  // Actions
  async function fetchItems() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/items')
      items.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, itemCount, fetchItems }
})
```

## Validation

After generating:
1. Import store in a component and verify types work
2. Check Vue DevTools for proper store registration
3. Verify state reactivity works correctly
