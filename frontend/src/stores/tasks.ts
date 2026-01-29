import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStats, TaskFilters } from '@/types/task'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const stats = ref<TaskStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters (computed)
  const vitalTasks = computed(() => 
    tasks.value.filter(t => t.isVital)
  )

  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status.name === 'Completed')
  )

  const inProgressTasks = computed(() => 
    tasks.value.filter(t => t.status.name === 'In Progress')
  )

  const notStartedTasks = computed(() => 
    tasks.value.filter(t => t.status.name === 'Not Started')
  )

  const tasksByCategory = computed(() => 
    tasks.value.reduce((acc, task) => {
      const key = task.category?.name ?? 'Uncategorized'
      acc[key] = [...(acc[key] || []), task]
      return acc
    }, {} as Record<string, Task[]>)
  )

  const tasksByStatus = computed(() => 
    tasks.value.reduce((acc, task) => {
      const key = task.status.name
      acc[key] = [...(acc[key] || []), task]
      return acc
    }, {} as Record<string, Task[]>)
  )

  // Actions
  async function fetchTasks(filters?: TaskFilters) {
    loading.value = true
    error.value = null
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
      
      const response = await fetch(url)
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
    $reset
  }
})
