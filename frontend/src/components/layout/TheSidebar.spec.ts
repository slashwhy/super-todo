import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import TheSidebar from '@/components/layout/TheSidebar.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

describe('TheSidebar', () => {
  let wrapper: VueWrapper
  let router: ReturnType<typeof createRouter>

  const routes = [
    { path: '/', component: { template: '<div>Dashboard</div>' } },
    { path: '/vital-tasks', component: { template: '<div>Vital Tasks</div>' } },
    { path: '/my-tasks', component: { template: '<div>My Tasks</div>' } },
    { path: '/categories', component: { template: '<div>Categories</div>' } },
    { path: '/settings', component: { template: '<div>Settings</div>' } },
    { path: '/help', component: { template: '<div>Help</div>' } },
  ]

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    router.push('/')
    await router.isReady()

    wrapper = mount(TheSidebar, {
      global: {
        plugins: [router],
        components: { AppIcon },
      },
    })
  })

  it('renders the sidebar', () => {
    expect(wrapper.find('.sidebar').exists()).toBe(true)
  })

  it('displays user profile information', () => {
    expect(wrapper.find('.sidebar__user-name').text()).toBe('Sundar Gurung')
    expect(wrapper.find('.sidebar__user-email').text()).toBe('sundargurung360@gmail.com')
  })

  it('renders all navigation items', () => {
    const navItems = wrapper.findAll('.sidebar__nav-item')
    expect(navItems).toHaveLength(6)
  })

  it('displays correct navigation labels', () => {
    const labels = wrapper.findAll('.sidebar__nav-label')
    const expectedLabels = ['Dashboard', 'Vital Task', 'My Task', 'Task Categories', 'Settings', 'Help']
    
    labels.forEach((label, index) => {
      if (index < expectedLabels.length) {
        expect(label.text()).toBe(expectedLabels[index])
      }
    })
  })

  it('highlights the active route', async () => {
    // Dashboard should be active by default
    const dashboardLink = wrapper.find('[href="/"]')
    expect(dashboardLink.classes()).toContain('sidebar__nav-item--active')
  })

  it('updates active state when route changes', async () => {
    await router.push('/my-tasks')
    await wrapper.vm.$nextTick()

    const myTasksLink = wrapper.find('[href="/my-tasks"]')
    expect(myTasksLink.classes()).toContain('sidebar__nav-item--active')

    const dashboardLink = wrapper.find('[href="/"]')
    expect(dashboardLink.classes()).not.toContain('sidebar__nav-item--active')
  })

  it('renders logout button', () => {
    const logoutBtn = wrapper.find('.sidebar__logout')
    expect(logoutBtn.exists()).toBe(true)
    expect(logoutBtn.text()).toContain('Logout')
  })

  it('renders user avatar with correct attributes', () => {
    const avatar = wrapper.find('.sidebar__avatar')
    expect(avatar.exists()).toBe(true)
    expect(avatar.attributes('alt')).toBe('Sundar Gurung')
  })
})
