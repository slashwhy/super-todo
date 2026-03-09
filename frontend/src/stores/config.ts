import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TaskStatus, TaskPriority, Category } from '@/types/task'

export const useConfigStore = defineStore('config', () => {
  // State
  const statuses = ref<TaskStatus[]>([])
  const priorities = ref<TaskPriority[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAndSet<T>(url: string, setter: (data: T) => void, label: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${label}: ${response.statusText}`)
    }
    setter(await response.json())
  }

  // Actions
  async function fetchStatuses() {
    try {
      await fetchAndSet<TaskStatus[]>('/api/config/statuses', d => (statuses.value = d), 'statuses')
    } catch (e) {
      console.error('Error fetching statuses:', e)
    }
  }

  async function fetchPriorities() {
    try {
      await fetchAndSet<TaskPriority[]>('/api/config/priorities', d => (priorities.value = d), 'priorities')
    } catch (e) {
      console.error('Error fetching priorities:', e)
    }
  }

  async function fetchCategories() {
    try {
      await fetchAndSet<Category[]>('/api/categories', d => (categories.value = d), 'categories')
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchStatuses(),
        fetchPriorities(),
        fetchCategories()
      ])
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  function $reset() {
    statuses.value = []
    priorities.value = []
    categories.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    statuses,
    priorities,
    categories,
    loading,
    error,
    // Actions
    fetchStatuses,
    fetchPriorities,
    fetchCategories,
    fetchAll,
    $reset
  }
})
