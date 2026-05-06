<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/config'
import { useToast } from '@/composables/useToast'
import type { Category } from '@/types/task'

interface CategoryWithCount extends Category {
  _count?: { tasks: number }
}

const configStore = useConfigStore()
const { categories } = storeToRefs(configStore)
const { showSuccess, showError } = useToast()

const loading = ref(true)
const showForm = ref(false)
const editingCategory = ref<CategoryWithCount | null>(null)
const submitting = ref(false)
const confirmingDelete = ref<string | null>(null)

const form = ref({
  name: '',
  description: '',
  color: '#3abeff',
  icon: '',
})

const colorOptions = [
  '#3abeff',
  '#04c400',
  '#f21e1e',
  '#0225ff',
  '#ff6767',
  '#9b59b6',
  '#f39c12',
  '#1abc9c',
]

onMounted(async () => {
  await fetchCategories()
})

async function fetchCategories() {
  loading.value = true
  try {
    const response = await fetch('/api/categories')
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    configStore.categories = data
  } catch (e) {
    showError((e as Error).message)
  } finally {
    loading.value = false
  }
}

function openCreateForm() {
  editingCategory.value = null
  form.value = { name: '', description: '', color: '#3abeff', icon: '' }
  showForm.value = true
}

function openEditForm(category: CategoryWithCount) {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    color: category.color,
    icon: category.icon || '',
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingCategory.value = null
}

async function handleSubmit() {
  if (!form.value.name.trim()) return

  submitting.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      color: form.value.color,
      icon: form.value.icon.trim() || null,
    }

    if (editingCategory.value) {
      const response = await fetch(`/api/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to update category')
      showSuccess('Category updated')
    } else {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to create category')
      showSuccess('Category created')
    }

    closeForm()
    await fetchCategories()
  } catch (e) {
    showError((e as Error).message)
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: string) {
  try {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete category')
    showSuccess('Category deleted')
    confirmingDelete.value = null
    await fetchCategories()
  } catch (e) {
    showError((e as Error).message)
  }
}
</script>

<template>
  <div class="categories">
    <div class="categories__header">
      <h1 class="categories__title">Task Categories</h1>
      <button class="categories__add-btn" type="button" @click="openCreateForm">
        + New Category
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="categories__loading">
      <p>Loading categories...</p>
    </div>

    <!-- Category Grid -->
    <div v-else-if="categories.length > 0" class="categories__grid">
      <div
        v-for="cat in categories as CategoryWithCount[]"
        :key="cat.id"
        class="category-card"
        :style="{ borderTopColor: cat.color }"
      >
        <div class="category-card__header">
          <div class="category-card__icon" :style="{ backgroundColor: cat.color }">
            {{ cat.icon || cat.name.charAt(0) }}
          </div>
          <div class="category-card__actions">
            <button
              class="category-card__btn"
              type="button"
              aria-label="Edit"
              @click="openEditForm(cat)"
            >
              ✏️
            </button>
            <button
              class="category-card__btn"
              type="button"
              aria-label="Delete"
              @click="confirmingDelete = cat.id"
            >
              🗑️
            </button>
          </div>
        </div>
        <h3 class="category-card__name">{{ cat.name }}</h3>
        <p v-if="cat.description" class="category-card__description">{{ cat.description }}</p>
        <span class="category-card__count">{{ cat._count?.tasks ?? 0 }} tasks</span>

        <!-- Delete confirmation -->
        <div v-if="confirmingDelete === cat.id" class="category-card__confirm">
          <p>Delete this category?</p>
          <div class="category-card__confirm-actions">
            <button
              class="btn btn--sm btn--secondary"
              type="button"
              @click="confirmingDelete = null"
            >
              No
            </button>
            <button class="btn btn--sm btn--danger" type="button" @click="handleDelete(cat.id)">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="categories__empty">
      <p class="categories__empty-icon">📁</p>
      <p class="categories__empty-title">No categories yet</p>
      <p class="categories__empty-text">Create categories to organize your tasks.</p>
      <button class="btn btn--primary" type="button" @click="openCreateForm">
        Create First Category
      </button>
    </div>

    <!-- Create/Edit Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal" role="dialog">
        <div class="modal__header">
          <h2 class="modal__title">{{ editingCategory ? 'Edit Category' : 'New Category' }}</h2>
          <button class="modal__close" type="button" aria-label="Close" @click="closeForm">
            ✕
          </button>
        </div>
        <form class="modal__body" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label" for="cat-name">Name *</label>
            <input
              id="cat-name"
              v-model="form.name"
              class="form-input"
              type="text"
              placeholder="Category name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="cat-description">Description</label>
            <input
              id="cat-description"
              v-model="form.description"
              class="form-input"
              type="text"
              placeholder="Optional description"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Color</label>
            <div class="color-picker">
              <button
                v-for="color in colorOptions"
                :key="color"
                class="color-picker__swatch"
                :class="{ 'color-picker__swatch--active': form.color === color }"
                :style="{ backgroundColor: color }"
                type="button"
                @click="form.color = color"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="cat-icon">Icon (emoji)</label>
            <input
              id="cat-icon"
              v-model="form.icon"
              class="form-input"
              type="text"
              placeholder="e.g. 🎨, 💻, 📊"
              maxlength="4"
            />
          </div>

          <div class="modal__actions">
            <button class="btn btn--secondary" type="button" @click="closeForm">Cancel</button>
            <button
              class="btn btn--primary"
              type="submit"
              :disabled="submitting || !form.name.trim()"
            >
              {{ submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.categories__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.categories__title {
  font-size: var(--font-size-3xl);
  font-weight: 500;
  color: var(--color-text-primary);
}

.categories__add-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.categories__add-btn:hover {
  background-color: var(--color-primary-dark);
}

.categories__loading {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--spacing-2xl);
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border-top: 4px solid;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  position: relative;
  transition: background-color 0.2s;
}

.category-card:hover {
  background-color: var(--color-surface);
}

.category-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-card__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  font-weight: 500;
}

.category-card__actions {
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.2s;
}

.category-card:hover .category-card__actions {
  opacity: 1;
}

.category-card__btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.category-card__btn:hover {
  background: var(--color-surface);
}

.category-card__name {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.category-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.category-card__count {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}

.category-card__confirm {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.category-card__confirm-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.categories__empty {
  text-align: center;
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.categories__empty-icon {
  font-size: 48px;
  margin: 0;
}

.categories__empty-title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.categories__empty-text {
  color: var(--color-text-muted);
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
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
  max-width: 440px;
  box-shadow: var(--shadow-lg);
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
}

.modal__close:hover {
  color: var(--color-text-primary);
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
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.color-picker {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.color-picker__swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s;
}

.color-picker__swatch:hover {
  transform: scale(1.15);
}

.color-picker__swatch--active {
  border-color: var(--color-text-primary);
  transform: scale(1.15);
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

.btn--sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
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
</style>
