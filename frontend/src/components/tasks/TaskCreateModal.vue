<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'

/**
 * Modal dialog for quick task creation.
 * Includes title, description, and priority fields.
 * 
 * @example
 * <TaskCreateModal v-model="isOpen" @taskCreated="handleCreated" />
 */

const props = defineProps<{
  /** Controls modal visibility (v-model) */
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  taskCreated: []
}>()

// Stores and composables
const configStore = useConfigStore()
const tasksStore = useTasksStore()
const { showSuccess, showError } = useToast()

// Form state
const title = ref('')
const description = ref('')
const selectedPriorityName = ref('Moderate') // Backend name, display as "Medium"
const loading = ref(false)

// Priority display mapping: Backend name → Display name
const priorityDisplayMap: Record<string, string> = {
  'Extreme': 'Extreme',
  'Moderate': 'Medium',
  'Low': 'Low'
}

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isValid = computed(() => title.value.trim().length > 0)

const sortedPriorities = computed(() => 
  [...configStore.priorities].sort((a, b) => a.order - b.order)
)

// Methods
function closeModal() {
  isOpen.value = false
}

function resetForm() {
  title.value = ''
  description.value = ''
  selectedPriorityName.value = 'Moderate'
  loading.value = false
}

async function handleSubmit() {
  if (!isValid.value || loading.value) return

  loading.value = true

  try {
    // Find the selected priority and "Not Started" status
    const priority = configStore.priorities.find(p => p.name === selectedPriorityName.value)
    const status = configStore.statuses.find(s => s.name === 'Not Started')
    
    if (!priority || !status) {
      showError('Configuration not loaded. Please try again.')
      loading.value = false
      return
    }

    // Get demo user (first user in the system for now)
    const usersResponse = await fetch('/api/users')
    if (!usersResponse.ok) {
      throw new Error('Failed to fetch users')
    }
    const users = await usersResponse.json()
    const owner = users[0]

    if (!owner) {
      showError('No users available. Please create a user first.')
      loading.value = false
      return
    }

    // Create task
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value.trim(),
        description: description.value.trim() || null,
        priorityId: priority.id,
        statusId: status.id,
        ownerId: owner.id,
        isVital: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to create task: ${response.statusText}`)
    }

    // Success
    showSuccess('Task created successfully!')
    emit('taskCreated')
    await tasksStore.fetchTasks()
    closeModal()
    resetForm()

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong'
    showError(message)
  } finally {
    loading.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Reset form when modal opens
watch(isOpen, (newValue) => {
  if (newValue) {
    resetForm()
    // Ensure config is loaded
    if (configStore.priorities.length === 0) {
      configStore.fetchAll()
    }
  }
})

// Keyboard listener
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        data-testid="task-create-modal-overlay"
        @click="handleBackdropClick"
      >
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          data-testid="task-create-modal"
        >
          <!-- Header -->
          <div class="modal__header">
            <h2 id="modal-title" class="modal__title">Add New Task</h2>
            <button
              type="button"
              class="modal__close"
              aria-label="Close modal"
              data-testid="modal-close-button"
              @click="closeModal"
            >
              ×
            </button>
          </div>

          <!-- Form -->
          <form class="modal__form" @submit.prevent="handleSubmit">
            <!-- Title field -->
            <div class="form-group">
              <label for="task-title" class="form-group__label">
                Title <span class="form-group__required">*</span>
              </label>
              <input
                id="task-title"
                v-model="title"
                type="text"
                class="form-group__input"
                placeholder="Enter task title..."
                required
                data-testid="task-title-input"
              />
            </div>

            <!-- Priority field -->
            <div class="form-group">
              <label class="form-group__label">Priority</label>
              <div class="priority-options" data-testid="priority-options">
                <label
                  v-for="priority in sortedPriorities"
                  :key="priority.id"
                  class="priority-option"
                  :class="{ 'priority-option--selected': selectedPriorityName === priority.name }"
                >
                  <input
                    v-model="selectedPriorityName"
                    type="radio"
                    :value="priority.name"
                    class="priority-option__input"
                    :data-testid="`priority-${priority.name.toLowerCase()}`"
                  />
                  <span
                    class="priority-option__dot"
                    :style="{ backgroundColor: priority.color }"
                  ></span>
                  <span class="priority-option__label">
                    {{ priorityDisplayMap[priority.name] || priority.name }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Description field -->
            <div class="form-group">
              <label for="task-description" class="form-group__label">
                Task Description
              </label>
              <textarea
                id="task-description"
                v-model="description"
                class="form-group__textarea"
                placeholder="Start writing here..."
                rows="5"
                data-testid="task-description-input"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="modal__actions">
              <button
                type="button"
                class="modal__btn modal__btn--cancel"
                data-testid="modal-cancel-button"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="modal__btn modal__btn--submit"
                :disabled="!isValid || loading"
                data-testid="modal-submit-button"
              >
                <span v-if="loading" class="modal__spinner"></span>
                {{ loading ? 'Creating...' : 'Done' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: var(--spacing-md);
}

/* Modal Container */
.modal {
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal Header */
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.modal__close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  line-height: 1;
  transition: color 0.2s ease;
}

.modal__close:hover {
  color: var(--color-text-primary);
}

/* Modal Form */
.modal__form {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group__label {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-group__required {
  color: var(--color-accent-red);
}

.form-group__input,
.form-group__textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-family: inherit;
  color: var(--color-text-primary);
  background-color: var(--color-surface-alt);
  transition: border-color 0.2s ease;
}

.form-group__input:focus,
.form-group__textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group__input::placeholder,
.form-group__textarea::placeholder {
  color: var(--color-text-muted);
}

.form-group__textarea {
  resize: vertical;
  min-height: 120px;
}

/* Priority Options */
.priority-options {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.priority-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.priority-option:hover {
  background-color: var(--color-surface);
}

.priority-option--selected {
  background-color: var(--color-surface);
}

.priority-option__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.priority-option__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.priority-option__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.priority-option--selected .priority-option__label {
  color: var(--color-text-primary);
}

/* Modal Actions */
.modal__actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
}

.modal__btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.modal__btn--cancel {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.modal__btn--cancel:hover {
  background-color: var(--color-surface);
}

.modal__btn--submit {
  background-color: var(--color-primary);
  border: none;
  color: var(--color-text-white);
  min-width: 100px;
}

.modal__btn--submit:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.modal__btn--submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.modal__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95);
}
</style>
