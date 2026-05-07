import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/task'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    if (users.value.length > 0) return
    loading.value = true
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }
      users.value = await response.json()
    } catch (e) {
      console.error('Error fetching users:', e)
    } finally {
      loading.value = false
    }
  }

  function $reset() {
    users.value = []
    loading.value = false
  }

  return {
    users,
    loading,
    fetchUsers,
    $reset,
  }
})
