import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  const addToast = (type: Toast['type'], message: string, duration = 4000) => {
    const id = nextId++
    toasts.value.push({ id, type, message })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showSuccess = (message: string, duration?: number) => {
    addToast('success', message, duration)
  }

  const showError = (message: string, duration?: number) => {
    addToast('error', message, duration)
  }

  const showInfo = (message: string, duration?: number) => {
    addToast('info', message, duration)
  }

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    removeToast
  }
}
