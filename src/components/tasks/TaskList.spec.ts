import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from './TaskList.vue'
import TaskCard from './TaskCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Task } from '@/types/task'

describe('TaskList', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'A test task description',
    image: null,
    isVital: false,
    dueDate: null,
    completedAt: null,
    createdAt: '2026-01-26T10:00:00.000Z',
    updatedAt: '2026-01-26T10:00:00.000Z',
    statusId: 'status-1',
    priorityId: 'priority-1',
    categoryId: null,
    ownerId: 'user-1',
    assigneeId: null,
    status: { id: 'status-1', name: 'Not Started', color: '#6B7280', order: 0 },
    priority: { id: 'priority-1', name: 'Moderate', color: '#3ABEFF', order: 1 },
    category: null,
    owner: { id: 'user-1', email: 'test@example.com', name: 'Test User', avatar: null },
    assignee: null,
  }

  it('renders loading state when loading is true', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        loading: true
      }
    })

    expect(wrapper.find('[data-testid="task-list-loading"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading tasks...')
    expect(wrapper.find('[data-testid="task-list-grid"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
  })

  it('renders empty state when no tasks and not loading', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        loading: false,
        emptyTitle: 'No tasks found',
        emptyDescription: 'Create your first task'
      }
    })

    const emptyState = wrapper.findComponent(EmptyState)
    expect(emptyState.exists()).toBe(true)
    expect(wrapper.text()).toContain('No tasks found')
    expect(wrapper.text()).toContain('Create your first task')
    expect(wrapper.find('[data-testid="task-list-loading"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="task-list-grid"]').exists()).toBe(false)
  })

  it('renders empty state with default props', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: []
      }
    })

    const emptyState = wrapper.findComponent(EmptyState)
    expect(emptyState.exists()).toBe(true)
    expect(wrapper.text()).toContain('No tasks found')
  })

  it('renders empty state with custom icon', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        emptyIcon: '⭐',
        emptyTitle: 'No vital tasks'
      }
    })

    const emptyState = wrapper.findComponent(EmptyState)
    expect(emptyState.props('icon')).toBe('⭐')
  })

  it('renders task grid when tasks are provided', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [mockTask]
      }
    })

    expect(wrapper.find('[data-testid="task-list-grid"]').exists()).toBe(true)
    expect(wrapper.findComponent(TaskCard).exists()).toBe(true)
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="task-list-loading"]').exists()).toBe(false)
  })

  it('renders multiple task cards', () => {
    const tasks = [
      mockTask,
      { ...mockTask, id: '2', title: 'Second Task' },
      { ...mockTask, id: '3', title: 'Third Task' }
    ]

    const wrapper = mount(TaskList, {
      props: {
        tasks
      }
    })

    const taskCards = wrapper.findAllComponents(TaskCard)
    expect(taskCards).toHaveLength(3)
  })

  it('passes empty-action slot to EmptyState', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        emptyTitle: 'No tasks'
      },
      slots: {
        'empty-action': '<button data-testid="create-btn">Create Task</button>'
      }
    })

    expect(wrapper.find('[data-testid="create-btn"]').exists()).toBe(true)
  })

  it('prioritizes loading state over empty state', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
        loading: true
      }
    })

    // When loading is true and tasks is empty, should show loading, not empty
    expect(wrapper.find('[data-testid="task-list-loading"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
  })
})
