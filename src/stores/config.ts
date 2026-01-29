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

  // Actions
  async function fetchStatuses() {
    try {
      const response = await fetch('/api/config/statuses')
      if (!response.ok) {
        throw new Error(`Failed to fetch statuses: ${response.statusText}`)
      }
      statuses.value = await response.json()
    } catch (e) {
      console.error('Error fetching statuses:', e)
    }
  }

  async function fetchPriorities() {
    try {
      const response = await fetch('/api/config/priorities')
      if (!response.ok) {
        throw new Error(`Failed to fetch priorities: ${response.statusText}`)
      }
      priorities.value = await response.json()
    } catch (e) {
      console.error('Error fetching priorities:', e)
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`)
      }
      categories.value = await response.json()
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
