import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FloatingActionButton from './FloatingActionButton.vue'

describe('FloatingActionButton', () => {
  it('renders with correct data-testid', () => {
    const wrapper = mount(FloatingActionButton)

    expect(wrapper.find('[data-testid="fab-button"]').exists()).toBe(true)
  })

  it('displays plus icon', () => {
    const wrapper = mount(FloatingActionButton)

    expect(wrapper.find('.fab__icon').text()).toBe('+')
  })

  it('has default aria-label', () => {
    const wrapper = mount(FloatingActionButton)

    expect(wrapper.attributes('aria-label')).toBe('Create new task')
  })

  it('uses custom aria-label when provided', () => {
    const wrapper = mount(FloatingActionButton, {
      props: {
        ariaLabel: 'Add new item'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Add new item')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(FloatingActionButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('has type="button" attribute', () => {
    const wrapper = mount(FloatingActionButton)

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('has correct CSS classes for Material Design', () => {
    const wrapper = mount(FloatingActionButton)

    expect(wrapper.classes()).toContain('fab')
  })

  it('icon has aria-hidden attribute', () => {
    const wrapper = mount(FloatingActionButton)

    expect(wrapper.find('.fab__icon').attributes('aria-hidden')).toBe('true')
  })
})
