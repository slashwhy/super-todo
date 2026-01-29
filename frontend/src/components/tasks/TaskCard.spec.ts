import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from './TaskCard.vue'
import type { Task } from '@/types/task'

describe('TaskCard', () => {
  const baseTask: Task = {
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

  it('renders task title', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__title').text()).toBe('Test Task')
  })

  it('renders task description when provided', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__description').text()).toBe('A test task description')
  })

  it('does not render description when null', () => {
    const taskWithoutDescription = { ...baseTask, description: null }
    const wrapper = mount(TaskCard, {
      props: { task: taskWithoutDescription }
    })

    expect(wrapper.find('.task-card__description').exists()).toBe(false)
  })

  it('renders priority badge with correct text', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__priority').text()).toBe('Moderate')
  })

  it('renders status with correct text', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__status').text()).toBe('Not Started')
  })

  it('shows vital badge when task is vital', () => {
    const vitalTask = { ...baseTask, isVital: true }
    const wrapper = mount(TaskCard, {
      props: { task: vitalTask }
    })

    expect(wrapper.find('.task-card__vital-badge').exists()).toBe(true)
    expect(wrapper.classes()).toContain('task-card--vital')
  })

  it('does not show vital badge when task is not vital', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__vital-badge').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('task-card--vital')
  })

  it('renders category when provided', () => {
    const taskWithCategory = {
      ...baseTask,
      categoryId: 'cat-1',
      category: { id: 'cat-1', name: 'Work', description: null, color: '#3B82F6', icon: null }
    }
    const wrapper = mount(TaskCard, {
      props: { task: taskWithCategory }
    })

    expect(wrapper.find('.task-card__category').text()).toBe('Work')
  })

  it('does not render category when null', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__category').exists()).toBe(false)
  })

  it('renders due date when provided', () => {
    const taskWithDueDate = { ...baseTask, dueDate: '2026-02-15T00:00:00.000Z' }
    const wrapper = mount(TaskCard, {
      props: { task: taskWithDueDate }
    })

    expect(wrapper.find('.task-card__due-date').exists()).toBe(true)
    expect(wrapper.find('.task-card__due-date').text()).toContain('Feb')
  })

  it('does not render due date when null', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__due-date').exists()).toBe(false)
  })

  it('renders assignee avatar when provided', () => {
    const taskWithAssignee = {
      ...baseTask,
      assigneeId: 'user-2',
      assignee: { id: 'user-2', email: 'jane@example.com', name: 'Jane Doe', avatar: null }
    }
    const wrapper = mount(TaskCard, {
      props: { task: taskWithAssignee }
    })

    expect(wrapper.find('.task-card__assignee').exists()).toBe(true)
    expect(wrapper.find('.task-card__avatar').text()).toBe('J')
  })

  it('does not render assignee when null', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('.task-card__assignee').exists()).toBe(false)
  })

  it('has correct data-testid attribute', () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask }
    })

    expect(wrapper.find('[data-testid="task-card-1"]').exists()).toBe(true)
  })

  it('applies correct priority class for Extreme priority', () => {
    const extremeTask = {
      ...baseTask,
      priority: { id: 'priority-1', name: 'Extreme', color: '#F21E1E', order: 0 }
    }
    const wrapper = mount(TaskCard, {
      props: { task: extremeTask }
    })

    expect(wrapper.find('.task-card__priority--extreme').exists()).toBe(true)
  })

  it('applies correct status class for Completed status', () => {
    const completedTask = {
      ...baseTask,
      status: { id: 'status-3', name: 'Completed', color: '#04C400', order: 2 }
    }
    const wrapper = mount(TaskCard, {
      props: { task: completedTask }
    })

    expect(wrapper.find('.task-card__status--completed').exists()).toBe(true)
  })
})
