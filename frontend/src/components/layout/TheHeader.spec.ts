import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import TheHeader from '@/components/layout/TheHeader.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

describe('TheHeader', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Mock Date for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-22'))

    wrapper = mount(TheHeader, {
      global: {
        components: { AppIcon },
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the header', () => {
    expect(wrapper.find('.header').exists()).toBe(true)
  })

  it('displays the brand logo', () => {
    const logo = wrapper.find('.header__logo')
    expect(logo.exists()).toBe(true)
    expect(logo.text()).toContain('Dashboard')
  })

  it('highlights "Dash" in the logo', () => {
    const accent = wrapper.find('.header__logo-accent')
    expect(accent.text()).toBe('Dash')
  })

  it('renders search input', () => {
    const searchInput = wrapper.find('.header__search-input')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toBe('Search your task here...')
  })

  it('updates search query on input', async () => {
    const searchInput = wrapper.find('.header__search-input')
    await searchInput.setValue('test query')
    expect((searchInput.element as HTMLInputElement).value).toBe('test query')
  })

  it('displays the current day name', () => {
    const dayName = wrapper.find('.header__date-day')
    expect(dayName.text()).toBe('Thursday')
  })

  it('displays the formatted date', () => {
    const dateDisplay = wrapper.find('.header__date-full')
    expect(dateDisplay.text()).toBe('22/01/2026')
  })

  it('renders notification button with aria-label', () => {
    const notificationBtn = wrapper.find('.header__action-btn--notification')
    expect(notificationBtn.exists()).toBe(true)
    expect(notificationBtn.attributes('aria-label')).toBe('Notifications')
  })

  it('renders calendar button with aria-label', () => {
    const calendarBtn = wrapper.find('.header__action-btn--calendar')
    expect(calendarBtn.exists()).toBe(true)
    expect(calendarBtn.attributes('aria-label')).toBe('Calendar')
  })

  it('renders search button with aria-label', () => {
    const searchBtn = wrapper.find('.header__search-btn')
    expect(searchBtn.exists()).toBe(true)
    expect(searchBtn.attributes('aria-label')).toBe('Search')
  })
})
