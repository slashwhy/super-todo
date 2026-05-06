import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Task,
  TaskStats,
  TaskFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/types/task'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const stats = ref<TaskStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters (computed)
  const vitalTasks = computed(() => tasks.value.filter((t) => t.isVital))

  const completedTasks = computed(() => tasks.value.filter((t) => t.status.name === 'Completed'))

  const inProgressTasks = computed(() => tasks.value.filter((t) => t.status.name === 'In Progress'))

  const notStartedTasks = computed(() => tasks.value.filter((t) => t.status.name === 'Not Started'))

  const tasksByCategory = computed(() =>
    tasks.value.reduce(
      (acc, task) => {
        const key = task.category?.name ?? 'Uncategorized'
        acc[key] = [...(acc[key] || []), task]
        return acc
      },
      {} as Record<string, Task[]>,
    ),
  )

  const tasksByStatus = computed(() =>
    tasks.value.reduce(
      (acc, task) => {
        const key = task.status.name
        acc[key] = [...(acc[key] || []), task]
        return acc
      },
      {} as Record<string, Task[]>,
    ),
  )

  // Actions
  async function fetchTasks(filters?: TaskFilters) {
    loading.value = true
    error.value = null
    const minDelay = new Promise((r) => setTimeout(r, 400))
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value)
          }
        })
      }
      const queryString = params.toString()
      const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks'

      const [response] = await Promise.all([fetch(url), minDelay])
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`)
      }
      tasks.value = await response.json()
    } catch (e) {
      error.value = (e as Error).message
      console.error('Error fetching tasks:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch('/api/tasks/stats/summary')
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`)
      }
      stats.value = await response.json()
    } catch (e) {
      console.error('Error fetching task stats:', e)
    }
  }

  async function fetchTaskById(id: string): Promise<Task | null> {
    try {
      const response = await fetch(`/api/tasks/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to fetch task: ${response.statusText}`)
      }
      return await response.json()
    } catch (e) {
      console.error('Error fetching task:', e)
      return null
    }
  }

  async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to create task')
    }
    const newTask: Task = await response.json()
    tasks.value.unshift(newTask)
    return newTask
  }

  async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to update task')
    }
    const updatedTask: Task = await response.json()
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
    return updatedTask
  }

  async function deleteTask(id: string): Promise<void> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function $reset() {
    tasks.value = []
    stats.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    tasks,
    stats,
    loading,
    error,
    // Getters
    vitalTasks,
    completedTasks,
    inProgressTasks,
    notStartedTasks,
    tasksByCategory,
    tasksByStatus,
    // Actions
    fetchTasks,
    fetchStats,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    $reset,
  }
})
