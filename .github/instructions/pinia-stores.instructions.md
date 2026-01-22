---
description: 'Pinia store patterns using Setup Store syntax with TypeScript'
applyTo: '**/stores/**/*.ts'
---

# Pinia Store Development

## Store Structure

Use the Setup Store syntax for better TypeScript support:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters (computed)
  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status.name === 'Done')
  )
  
  const tasksByCategory = computed(() => 
    tasks.value.reduce((acc, task) => {
      const key = task.category?.name ?? 'Uncategorized'
      acc[key] = [...(acc[key] || []), task]
      return acc
    }, {} as Record<string, Task[]>)
  )

  // Actions
  async function fetchTasks(filters?: TaskFilters) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/tasks?' + new URLSearchParams(filters))
      tasks.value = await response.json()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function createTask(task: CreateTaskDto) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    const newTask = await response.json()
    tasks.value.push(newTask)
    return newTask
  }

  function $reset() {
    tasks.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    tasks,
    loading,
    error,
    // Getters
    completedTasks,
    tasksByCategory,
    // Actions
    fetchTasks,
    createTask,
    $reset
  }
})
```

## Store Organization

| Store | Responsibility |
|-------|---------------|
| `useTasksStore` | Task CRUD, filtering, task state |
| `useAuthStore` | User authentication, session |
| `useConfigStore` | App settings, preferences |

## Naming Conventions

- Store files: `camelCase.ts` (e.g., `tasks.ts`)
- Store function: `use[Name]Store` (e.g., `useTasksStore`)
- Place in `src/stores/` directory

## Best Practices

- Keep state normalized - avoid deeply nested structures
- Use getters (computed) for derived state
- Actions handle async operations and API calls
- Include a `$reset()` action for testing and logout
- Don't mutate state directly from components - use actions
- Use `storeToRefs()` when destructuring reactive state:

```typescript
import { storeToRefs } from 'pinia'

const tasksStore = useTasksStore()
const { tasks, loading } = storeToRefs(tasksStore)
const { fetchTasks, createTask } = tasksStore
```

## Common Pitfalls

- ❌ Destructuring without `storeToRefs()` → Loses reactivity
- ❌ Mutating state outside actions → Breaks DevTools time-travel
- ❌ Circular store dependencies → Use callbacks or events instead
- ❌ Storing computed values as state → Use getters instead

## Store Composition

Stores can use other stores:

```typescript
export const useNotificationsStore = defineStore('notifications', () => {
  const tasksStore = useTasksStore()
  
  const hasOverdueTasks = computed(() => 
    tasksStore.tasks.some(t => new Date(t.dueDate) < new Date())
  )
  
  return { hasOverdueTasks }
})
```

## Persistence

Use Pinia plugins for persistence:

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

Then in store:

```typescript
export const useSettingsStore = defineStore('settings', () => {
  // ... store logic
}, {
  persist: true
})
```
