import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MainLayout from '@/components/layout/MainLayout.vue'

describe('MainLayout', () => {
  it('renders the layout container', () => {
    const wrapper = mount(MainLayout, {
      global: {
        stubs: {
          TheHeader: true,
          TheSidebar: true,
        },
      },
    })
    expect(wrapper.find('.layout').exists()).toBe(true)
  })

  it('renders TheHeader component', () => {
    const wrapper = mount(MainLayout, {
      global: {
        stubs: {
          TheHeader: { template: '<header data-testid="header">Header</header>' },
          TheSidebar: true,
        },
      },
    })
    expect(wrapper.find('[data-testid="header"]').exists()).toBe(true)
  })

  it('renders TheSidebar component', () => {
    const wrapper = mount(MainLayout, {
      global: {
        stubs: {
          TheHeader: true,
          TheSidebar: { template: '<aside data-testid="sidebar">Sidebar</aside>' },
        },
      },
    })
    expect(wrapper.find('[data-testid="sidebar"]').exists()).toBe(true)
  })

  it('renders slot content in main area', () => {
    const wrapper = mount(MainLayout, {
      slots: {
        default: '<div data-testid="slot-content">Page Content</div>',
      },
      global: {
        stubs: {
          TheHeader: true,
          TheSidebar: true,
        },
      },
    })

    const mainArea = wrapper.find('.layout__main')
    expect(mainArea.exists()).toBe(true)
    expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="slot-content"]').text()).toBe('Page Content')
  })

  it('renders main element for accessibility', () => {
    const wrapper = mount(MainLayout, {
      global: {
        stubs: {
          TheHeader: true,
          TheSidebar: true,
        },
      },
    })

    const mainElement = wrapper.find('main')
    expect(mainElement.exists()).toBe(true)
    expect(mainElement.classes()).toContain('layout__main')
  })
})
