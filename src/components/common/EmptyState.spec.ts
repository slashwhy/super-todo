import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders with required props', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No items found'
      }
    })

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('No items found')
  })

  it('renders default icon when not provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty'
      }
    })

    expect(wrapper.find('.empty-state__icon').text()).toBe('📋')
  })

  it('renders custom icon when provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No tasks',
        icon: '🚀'
      }
    })

    expect(wrapper.find('.empty-state__icon').text()).toBe('🚀')
  })

  it('renders description when provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No tasks',
        description: 'Create your first task to get started.'
      }
    })

    expect(wrapper.text()).toContain('Create your first task to get started.')
  })

  it('does not render description when not provided', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No tasks'
      }
    })

    expect(wrapper.find('.empty-state__description').exists()).toBe(false)
  })

  it('renders action slot content', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No tasks'
      },
      slots: {
        action: '<button>Create Task</button>'
      }
    })

    expect(wrapper.text()).toContain('Create Task')
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No tasks',
        icon: '⭐'
      }
    })

    const icon = wrapper.find('.empty-state__icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })
})
