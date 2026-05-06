<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/config'
import { useUsersStore } from '@/stores/users'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import type { CreateTaskPayload } from '@/types/task'

const emit = defineEmits<{
  close: []
  created: []
}>()

const configStore = useConfigStore()
const usersStore = useUsersStore()
const tasksStore = useTasksStore()
const { statuses, priorities, categories } = storeToRefs(configStore)
const { users } = storeToRefs(usersStore)
const { showSuccess, showError } = useToast()

const submitting = ref(false)
const shakeError = ref(false)
const showSuccessState = ref(false)

const form = ref({
  title: '',
  description: '',
  statusId: '',
  priorityId: '',
  categoryId: '',
  ownerId: '',
  assigneeId: '',
  dueDate: '',
  isVital: false,
})

onMounted(async () => {
  await Promise.all([configStore.fetchAll(), usersStore.fetchUsers()])
  // Set defaults
  if (statuses.value.length > 0) {
    form.value.statusId = statuses.value[0].id
  }
  if (priorities.value.length > 0) {
    form.value.priorityId = priorities.value[0].id
  }
  if (users.value.length > 0) {
    form.value.ownerId = users.value[0].id
  }
})

async function handleSubmit() {
  if (!form.value.title.trim()) {
    shakeError.value = true
    setTimeout(() => (shakeError.value = false), 500)
    return
  }

  submitting.value = true
  try {
    const payload: CreateTaskPayload = {
      title: form.value.title.trim(),
      description: form.value.description.trim() || undefined,
      statusId: form.value.statusId,
      priorityId: form.value.priorityId,
      categoryId: form.value.categoryId || null,
      ownerId: form.value.ownerId,
      assigneeId: form.value.assigneeId || null,
      dueDate: form.value.dueDate || null,
      isVital: form.value.isVital,
    }
    await tasksStore.createTask(payload)
    showSuccessState.value = true
    showSuccess('Task created successfully')
    setTimeout(() => {
      emit('created')
      emit('close')
    }, 600)
  } catch (e) {
    shakeError.value = true
    setTimeout(() => (shakeError.value = false), 500)
    showError((e as Error).message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Transition name="modal" appear>
    <div class="modal-overlay" @click.self="emit('close')">
      <div
        class="modal"
        :class="{ 'modal--shake': shakeError, 'modal--success': showSuccessState }"
        role="dialog"
        aria-labelledby="create-task-title"
      >
        <!-- Success overlay -->
        <Transition name="fade">
          <div v-if="showSuccessState" class="modal__success-overlay">
            <span class="modal__success-check">✓</span>
            <p>Task Created!</p>
          </div>
        </Transition>

        <div class="modal__header">
          <h2 id="create-task-title" class="modal__title">Create New Task</h2>
          <button class="modal__close" type="button" aria-label="Close" @click="emit('close')">
            ✕
          </button>
        </div>

        <form class="modal__body" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label" for="task-title">Title *</label>
            <input
              id="task-title"
              v-model="form.title"
              class="form-input"
              type="text"
              placeholder="What needs to be done?"
              required
              data-testid="task-title-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="task-description">Description</label>
            <textarea
              id="task-description"
              v-model="form.description"
              class="form-input form-input--textarea"
              placeholder="Add details about this task..."
              rows="3"
              data-testid="task-description-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="task-status">Status</label>
              <select id="task-status" v-model="form.statusId" class="form-input">
                <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="task-priority">Priority</label>
              <select id="task-priority" v-model="form.priorityId" class="form-input">
                <option v-for="p in priorities" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="task-category">Category</label>
              <select id="task-category" v-model="form.categoryId" class="form-input">
                <option value="">None</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="task-due-date">Due Date</label>
              <input id="task-due-date" v-model="form.dueDate" class="form-input" type="date" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="task-owner">Owner *</label>
              <select id="task-owner" v-model="form.ownerId" class="form-input" required>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="task-assignee">Assignee</label>
              <select id="task-assignee" v-model="form.assigneeId" class="form-input">
                <option value="">Unassigned</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-group form-group--checkbox">
            <label class="form-checkbox">
              <input v-model="form.isVital" type="checkbox" />
              <span class="form-checkbox__label">⭐ Mark as vital task</span>
            </label>
          </div>

          <div class="modal__actions">
            <button class="btn btn--secondary" type="button" @click="emit('close')">Cancel</button>
            <button
              class="btn btn--primary"
              type="submit"
              :disabled="submitting || !form.title.trim()"
              data-testid="create-task-submit"
            >
              {{ submitting ? 'Creating...' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal transition */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal {
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active .modal {
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 1, 1),
    opacity 0.2s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from .modal {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to .modal {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal {
  background: var(--color-surface-alt);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.modal--shake {
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }
  40%,
  60% {
    transform: translateX(4px);
  }
}

.modal--success {
  pointer-events: none;
}

.modal__success-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  z-index: 10;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-accent-green);
}

.modal__success-check {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-accent-green);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--color-text-muted);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
}

.modal__close:hover {
  color: var(--color-text-primary);
  background: var(--color-surface);
}

.modal__body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.form-group--checkbox {
  flex-direction: row;
  align-items: center;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-input--textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.form-checkbox__label {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn--primary:active:not(:disabled) {
  opacity: 0.9;
}

.btn--secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-border);
  transform: translateY(-1px);
}
</style>
