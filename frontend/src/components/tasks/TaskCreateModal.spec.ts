import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import TaskCreateModal from './TaskCreateModal.vue'

// Mock fetch
global.fetch = vi.fn()

describe('TaskCreateModal', () => {
  let wrapper: VueWrapper

  const mockPriorities = [
    { id: '1', name: 'Extreme', color: '#FF0000', order: 1 },
    { id: '2', name: 'Moderate', color: '#FFA500', order: 2 },
    { id: '3', name: 'Low', color: '#00FF00', order: 3 }
  ]

  const mockStatuses = [
    { id: '1', name: 'Not Started', color: '#6B7280', order: 1 },
    { id: '2', name: 'In Progress', color: '#3B82F6', order: 2 },
    { id: '3', name: 'Done', color: '#10B981', order: 3 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TaskCreateModal, {
      props: {
        modelValue: true
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              config: {
                priorities: mockPriorities,
                statuses: mockStatuses
              }
            }
          })
        ],
        stubs: {
          Teleport: true
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Rendering', () => {
    it('renders modal when modelValue is true', () => {
      expect(wrapper.find('[data-testid="task-create-modal"]').exists()).toBe(true)
    })

    it('does not render modal when modelValue is false', () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: false
        },
        global: {
          plugins: [createTestingPinia()],
          stubs: { Teleport: true }
        }
      })
      expect(wrapper.find('[data-testid="task-create-modal"]').exists()).toBe(false)
    })

    it('renders modal title', () => {
      expect(wrapper.find('.modal__title').text()).toBe('Add New Task')
    })

    it('renders close button with correct aria-label', () => {
      const closeButton = wrapper.find('[data-testid="modal-close-button"]')
      expect(closeButton.exists()).toBe(true)
      expect(closeButton.attributes('aria-label')).toBe('Close modal')
    })

    it('renders title input with autofocus', () => {
      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      expect(titleInput.exists()).toBe(true)
      expect(titleInput.attributes('autofocus')).toBeDefined()
    })

    it('renders description textarea', () => {
      expect(wrapper.find('[data-testid="task-description-input"]').exists()).toBe(true)
    })

    it('renders priority options', () => {
      const priorityOptions = wrapper.find('[data-testid="priority-options"]')
      expect(priorityOptions.exists()).toBe(true)
      expect(wrapper.findAll('.priority-option')).toHaveLength(3)
    })

    it('renders cancel and submit buttons', () => {
      expect(wrapper.find('[data-testid="modal-cancel-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="modal-submit-button"]').exists()).toBe(true)
    })

    it('has correct modal ARIA attributes', () => {
      const modal = wrapper.find('[data-testid="task-create-modal"]')
      expect(modal.attributes('role')).toBe('dialog')
      expect(modal.attributes('aria-modal')).toBe('true')
      expect(modal.attributes('aria-labelledby')).toBe('modal-title')
    })
  })

  describe('Form Validation', () => {
    it('submit button is disabled when title is empty', () => {
      const submitButton = wrapper.find('[data-testid="modal-submit-button"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('submit button is enabled when title has value', async () => {
      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')
      
      const submitButton = wrapper.find('[data-testid="modal-submit-button"]')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })

    it('required field indicator is shown for title', () => {
      expect(wrapper.find('.form-group__required').exists()).toBe(true)
    })
  })

  describe('Priority Selection', () => {
    it('Moderate priority is selected by default', () => {
      const moderateOption = wrapper.find('[data-testid="priority-moderate"]')
      expect((moderateOption.element as HTMLInputElement).checked).toBe(true)
    })

    it('can select different priority', async () => {
      const extremeOption = wrapper.find('[data-testid="priority-extreme"]')
      await extremeOption.setValue(true)
      
      expect((extremeOption.element as HTMLInputElement).checked).toBe(true)
    })

    it('displays priority colors correctly', () => {
      const priorityDots = wrapper.findAll('.priority-option__dot')
      expect(priorityDots[0].attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    })

    it('displays priority names without mapping', () => {
      const labels = wrapper.findAll('.priority-option__label')
      expect(labels[0].text()).toBe('Extreme')
      expect(labels[1].text()).toBe('Moderate')
      expect(labels[2].text()).toBe('Low')
    })
  })

  describe('Modal Interactions', () => {
    it('emits update:modelValue when close button is clicked', async () => {
      const closeButton = wrapper.find('[data-testid="modal-close-button"]')
      await closeButton.trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('emits update:modelValue when cancel button is clicked', async () => {
      const cancelButton = wrapper.find('[data-testid="modal-cancel-button"]')
      await cancelButton.trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('closes modal when backdrop is clicked', async () => {
      const overlay = wrapper.find('[data-testid="task-create-modal-overlay"]')
      await overlay.trigger('click')
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('does not close modal when clicking inside modal', async () => {
      const modal = wrapper.find('[data-testid="task-create-modal"]')
      await modal.trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('Form Submission', () => {
    beforeEach(() => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'task-1', title: 'New Task' })
      } as Response)
    })

    it('creates task with provided ownerId', async () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"ownerId":"user-123"')
        })
      )
    })

    it('fetches user when ownerId is not provided', async () => {
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 'user-1', name: 'Demo User' }]
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'task-1' })
        } as Response)

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(global.fetch).toHaveBeenCalledWith('/api/users')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"ownerId":"user-1"')
        })
      )
    })

    it('shows error when user fetch fails', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false
      } as Response)

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      // Modal should remain open (not emit close event)
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('includes all form fields in task creation', async () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('Test Task')

      const descriptionInput = wrapper.find('[data-testid="task-description-input"]')
      await descriptionInput.setValue('Task description')

      const extremeOption = wrapper.find('[data-testid="priority-extreme"]')
      await extremeOption.setValue(true)

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Task',
            description: 'Task description',
            priorityId: '1',
            statusId: '1',
            ownerId: 'user-123',
            isVital: false
          })
        })
      )
    })

    it('emits taskCreated and closes modal on successful submission', async () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(wrapper.emitted('taskCreated')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('shows loading state during submission', async () => {
      let resolvePromise: (value: Response) => void
      const promise = new Promise<Response>((resolve) => {
        resolvePromise = resolve
      })
      vi.mocked(global.fetch).mockReturnValue(promise)

      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      const submitButton = wrapper.find('[data-testid="modal-submit-button"]')
      expect(submitButton.text()).toContain('Creating...')
      expect(wrapper.find('.modal__spinner').exists()).toBe(true)

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ id: 'task-1' })
      } as Response)
      await flushPromises()
    })

    it('handles API errors gracefully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Database error' })
      } as Response)

      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      // Modal should remain open
      expect(wrapper.emitted('taskCreated')).toBeFalsy()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('Form Reset', () => {
    it('resets form when modal is closed and reopened', async () => {
      let titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('Test Task')

      await wrapper.setProps({ modelValue: false })
      await wrapper.vm.$nextTick()
      await wrapper.setProps({ modelValue: true })
      await wrapper.vm.$nextTick()

      // Re-query the input element after re-rendering
      titleInput = wrapper.find('[data-testid="task-title-input"]')
      expect((titleInput.element as HTMLInputElement).value).toBe('')
    })

    it('resets to default priority on open', async () => {
      const extremeOption = wrapper.find('[data-testid="priority-extreme"]')
      await extremeOption.setValue(true)

      await wrapper.setProps({ modelValue: false })
      await wrapper.setProps({ modelValue: true })

      const moderateOption = wrapper.find('[data-testid="priority-moderate"]')
      expect((moderateOption.element as HTMLInputElement).checked).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('title input has required attribute', () => {
      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      expect(titleInput.attributes('required')).toBeDefined()
    })

    it('inputs have associated labels', () => {
      const titleInput = wrapper.find('#task-title')
      const titleLabel = wrapper.find('label[for="task-title"]')
      expect(titleLabel.exists()).toBe(true)

      const descInput = wrapper.find('#task-description')
      const descLabel = wrapper.find('label[for="task-description"]')
      expect(descLabel.exists()).toBe(true)
    })

    it('cancel button has type="button" to prevent form submission', () => {
      const cancelButton = wrapper.find('[data-testid="modal-cancel-button"]')
      expect(cancelButton.attributes('type')).toBe('button')
    })

    it('submit button has type="submit"', () => {
      const submitButton = wrapper.find('[data-testid="modal-submit-button"]')
      expect(submitButton.attributes('type')).toBe('submit')
    })
  })

  describe('Edge Cases', () => {
    it('handles missing configuration gracefully', async () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: [],
                  statuses: []
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      // Should not attempt to create task
      expect(global.fetch).not.toHaveBeenCalledWith('/api/tasks', expect.any(Object))
    })

    it('handles empty users array when fetching', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('New Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      // Should not attempt to create task
      expect(global.fetch).toHaveBeenCalledWith('/api/users')
      expect(global.fetch).not.toHaveBeenCalledWith('/api/tasks', expect.any(Object))
    })

    it('trims whitespace from title and description', async () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('  Test Task  ')

      const descriptionInput = wrapper.find('[data-testid="task-description-input"]')
      await descriptionInput.setValue('  Description  ')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          body: expect.stringContaining('"title":"Test Task"')
        })
      )
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          body: expect.stringContaining('"description":"Description"')
        })
      )
    })

    it('converts empty description to null', async () => {
      wrapper = mount(TaskCreateModal, {
        props: {
          modelValue: true,
          ownerId: 'user-123'
        },
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                config: {
                  priorities: mockPriorities,
                  statuses: mockStatuses
                }
              }
            })
          ],
          stubs: { Teleport: true }
        }
      })

      const titleInput = wrapper.find('[data-testid="task-title-input"]')
      await titleInput.setValue('Test Task')

      const form = wrapper.find('.modal__form')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          body: expect.stringContaining('"description":null')
        })
      )
    })
  })
})
