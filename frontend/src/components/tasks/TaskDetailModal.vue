<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/config'
import { useUsersStore } from '@/stores/users'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import type { Task, UpdateTaskPayload } from '@/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
  updated: []
  deleted: []
}>()

const configStore = useConfigStore()
const usersStore = useUsersStore()
const tasksStore = useTasksStore()
const { statuses, priorities, categories } = storeToRefs(configStore)
const { users } = storeToRefs(usersStore)
const { showSuccess, showError } = useToast()

const editing = ref(false)
const submitting = ref(false)
const confirmingDelete = ref(false)

const form = ref({
  title: props.task.title,
  description: props.task.description || '',
  statusId: props.task.statusId,
  priorityId: props.task.priorityId,
  categoryId: props.task.categoryId || '',
  assigneeId: props.task.assigneeId || '',
  dueDate: props.task.dueDate ? props.task.dueDate.split('T')[0] : '',
  isVital: props.task.isVital,
})

const hasChanges = computed(() => {
  return (
    form.value.title !== props.task.title ||
    form.value.description !== (props.task.description || '') ||
    form.value.statusId !== props.task.statusId ||
    form.value.priorityId !== props.task.priorityId ||
    form.value.categoryId !== (props.task.categoryId || '') ||
    form.value.assigneeId !== (props.task.assigneeId || '') ||
    form.value.dueDate !== (props.task.dueDate ? props.task.dueDate.split('T')[0] : '') ||
    form.value.isVital !== props.task.isVital
  )
})

onMounted(async () => {
  await Promise.all([configStore.fetchAll(), usersStore.fetchUsers()])
})

function formatDate(dateString: string | null): string {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

async function handleSave() {
  if (!form.value.title.trim()) return

  submitting.value = true
  try {
    const payload: UpdateTaskPayload = {
      title: form.value.title.trim(),
      description: form.value.description.trim() || null,
      statusId: form.value.statusId,
      priorityId: form.value.priorityId,
      categoryId: form.value.categoryId || null,
      assigneeId: form.value.assigneeId || null,
      dueDate: form.value.dueDate || null,
      isVital: form.value.isVital,
    }
    await tasksStore.updateTask(props.task.id, payload)
    showSuccess('Task updated successfully')
    editing.value = false
    emit('updated')
  } catch (e) {
    showError((e as Error).message)
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  submitting.value = true
  try {
    await tasksStore.deleteTask(props.task.id)
    showSuccess('Task deleted')
    emit('deleted')
    emit('close')
  } catch (e) {
    showError((e as Error).message)
  } finally {
    submitting.value = false
    confirmingDelete.value = false
  }
}

function cancelEdit() {
  editing.value = false
  form.value = {
    title: props.task.title,
    description: props.task.description || '',
    statusId: props.task.statusId,
    priorityId: props.task.priorityId,
    categoryId: props.task.categoryId || '',
    assigneeId: props.task.assigneeId || '',
    dueDate: props.task.dueDate ? props.task.dueDate.split('T')[0] : '',
    isVital: props.task.isVital,
  }
}
</script>

<template>
  <Transition name="modal" appear>
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-labelledby="detail-task-title">
        <div class="modal__header">
          <h2 id="detail-task-title" class="modal__title">
            {{ editing ? 'Edit Task' : 'Task Details' }}
          </h2>
          <button class="modal__close" type="button" aria-label="Close" @click="emit('close')">
            ✕
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="!editing" class="modal__body">
          <div class="detail">
            <div class="detail__header">
              <h3 class="detail__title">
                <span v-if="task.isVital" class="detail__vital">⭐</span>
                {{ task.title }}
              </h3>
              <span class="detail__priority" :style="{ backgroundColor: task.priority.color }">
                {{ task.priority.name }}
              </span>
            </div>

            <p v-if="task.description" class="detail__description">{{ task.description }}</p>
            <p v-else class="detail__description detail__description--empty">No description</p>

            <div class="detail__grid">
              <div class="detail__field">
                <span class="detail__label">Status</span>
                <span class="detail__value" :style="{ color: task.status.color }">
                  {{ task.status.name }}
                </span>
              </div>
              <div class="detail__field">
                <span class="detail__label">Priority</span>
                <span class="detail__value">{{ task.priority.name }}</span>
              </div>
              <div class="detail__field">
                <span class="detail__label">Category</span>
                <span class="detail__value">{{ task.category?.name || 'None' }}</span>
              </div>
              <div class="detail__field">
                <span class="detail__label">Due Date</span>
                <span class="detail__value">{{ formatDate(task.dueDate) }}</span>
              </div>
              <div class="detail__field">
                <span class="detail__label">Owner</span>
                <span class="detail__value">{{ task.owner.name }}</span>
              </div>
              <div class="detail__field">
                <span class="detail__label">Assignee</span>
                <span class="detail__value">{{ task.assignee?.name || 'Unassigned' }}</span>
              </div>
            </div>

            <div class="detail__meta">
              <span>Created: {{ formatDate(task.createdAt) }}</span>
              <span v-if="task.completedAt">Completed: {{ formatDate(task.completedAt) }}</span>
            </div>
          </div>

          <div class="modal__actions">
            <button class="btn btn--danger" type="button" @click="confirmingDelete = true">
              Delete
            </button>
            <button class="btn btn--primary" type="button" @click="editing = true">
              Edit Task
            </button>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else class="modal__body" @submit.prevent="handleSave">
          <div class="form-group">
            <label class="form-label" for="edit-title">Title *</label>
            <input id="edit-title" v-model="form.title" class="form-input" type="text" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-description">Description</label>
            <textarea
              id="edit-description"
              v-model="form.description"
              class="form-input form-input--textarea"
              rows="3"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-status">Status</label>
              <select id="edit-status" v-model="form.statusId" class="form-input">
                <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="edit-priority">Priority</label>
              <select id="edit-priority" v-model="form.priorityId" class="form-input">
                <option v-for="p in priorities" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-category">Category</label>
              <select id="edit-category" v-model="form.categoryId" class="form-input">
                <option value="">None</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="edit-due-date">Due Date</label>
              <input id="edit-due-date" v-model="form.dueDate" class="form-input" type="date" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-assignee">Assignee</label>
              <select id="edit-assignee" v-model="form.assigneeId" class="form-input">
                <option value="">Unassigned</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>

            <div class="form-group form-group--checkbox">
              <label class="form-checkbox">
                <input v-model="form.isVital" type="checkbox" />
                <span class="form-checkbox__label">⭐ Vital</span>
              </label>
            </div>
          </div>

          <div class="modal__actions">
            <button class="btn btn--secondary" type="button" @click="cancelEdit">Cancel</button>
            <button
              class="btn btn--primary"
              type="submit"
              :disabled="submitting || !form.title.trim() || !hasChanges"
            >
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>

        <!-- Delete Confirmation -->
        <div v-if="confirmingDelete" class="confirm-overlay" @click.self="confirmingDelete = false">
          <div class="confirm">
            <p class="confirm__message">Are you sure you want to delete this task?</p>
            <p class="confirm__sub">This action cannot be undone.</p>
            <div class="confirm__actions">
              <button class="btn btn--secondary" type="button" @click="confirmingDelete = false">
                Cancel
              </button>
              <button
                class="btn btn--danger"
                type="button"
                :disabled="submitting"
                @click="handleDelete"
              >
                {{ submitting ? 'Deleting...' : 'Delete Task' }}
              </button>
            </div>
          </div>
        </div>
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
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

.detail__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.detail__title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.detail__vital {
  margin-right: var(--spacing-xs);
}

.detail__priority {
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-white);
  text-transform: uppercase;
  white-space: nowrap;
}

.detail__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.detail__description--empty {
  color: var(--color-text-muted);
  font-style: italic;
}

.detail__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
}

.detail__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail__label {
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.detail__value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.detail__meta {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.modal__actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
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
  justify-content: flex-start;
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

.btn--secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-border);
}

.btn--danger {
  background-color: var(--color-accent-red);
  color: var(--color-text-white);
}

.btn--danger:hover:not(:disabled) {
  opacity: 0.9;
}

.confirm-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  z-index: 10;
}

.confirm {
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
  max-width: 320px;
}

.confirm__message {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs);
}

.confirm__sub {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-lg);
}

.confirm__actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}
</style>
