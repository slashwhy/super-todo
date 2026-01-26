---
name: pinia-stores
description: 'Pinia store patterns using Setup Store syntax with TypeScript. Use when creating stores, managing global state, or implementing actions and getters.'
---

# Pinia Stores Skill

Patterns for creating Pinia stores using the Setup Store syntax.

## When to Use This Skill

- Creating new Pinia stores
- Managing global application state
- Implementing async actions with API calls
- Creating computed getters
- Sharing state between components

## Reference Documentation

For detailed patterns and conventions, see:
- [Pinia Stores Instructions](../../instructions/pinia-stores.instructions.md)

## Quick Reference

### Setup Store Structure

```typescript
// src/stores/tasks.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Task } from '@/types/task'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters (computed)
  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status.name === 'Done')
  )
  
  const taskCount = computed(() => tasks.value.length)
  
  // Actions
  async function fetchTasks() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/tasks')
      tasks.value = await response.json()
    } catch (e) {
      error.value = 'Failed to fetch tasks'
    } finally {
      isLoading.value = false
    }
  }
  
  async function createTask(data: Partial<Task>) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const newTask = await response.json()
    tasks.value.push(newTask)
    return newTask
  }
  
  function $reset() {
    tasks.value = []
    isLoading.value = false
    error.value = null
  }
  
  // Return public API
  return {
    // State
    tasks,
    isLoading,
    error,
    // Getters
    completedTasks,
    taskCount,
    // Actions
    fetchTasks,
    createTask,
    $reset
  }
})
```

### Critical Rules

1. **Use Setup Store syntax** (function style, not options)
2. **Never mutate state directly** from components
3. **Always implement `$reset`** for testing
4. **Handle loading and error states** in async actions
5. **Type all state with TypeScript**

### Using Store in Components

```vue
<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const tasksStore = useTasksStore()

// Destructure with storeToRefs for reactivity
const { tasks, isLoading, error } = storeToRefs(tasksStore)

// Actions can be destructured directly
const { fetchTasks, createTask } = tasksStore

// Fetch on mount
onMounted(() => {
  fetchTasks()
})
</script>
```

### Filtering Pattern

```typescript
// In store
const filterStatus = ref<string | null>(null)

const filteredTasks = computed(() => {
  if (!filterStatus.value) return tasks.value
  return tasks.value.filter(t => t.status.name === filterStatus.value)
})

function setFilter(status: string | null) {
  filterStatus.value = status
}
```

### Optimistic Updates

```typescript
async function updateTask(id: string, data: Partial<Task>) {
  // Find and update optimistically
  const index = tasks.value.findIndex(t => t.id === id)
  const original = { ...tasks.value[index] }
  tasks.value[index] = { ...original, ...data }
  
  try {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch {
    // Rollback on error
    tasks.value[index] = original
    throw error
  }
}
```

## File Naming

- Stores: `featureName.ts` (e.g., `tasks.ts`)
- Location: `src/stores/`
- Tests: `featureName.spec.ts` alongside
