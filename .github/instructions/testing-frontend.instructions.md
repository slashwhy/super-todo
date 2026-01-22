---
applyTo: 'src/**/*.{spec,test}.ts'
---

# Frontend Testing with Vue Test Utils

## Test File Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import TaskCard from '@/components/TaskCard.vue'

describe('TaskCard', () => {
  let wrapper: VueWrapper

  const mockTask = {
    id: '1',
    title: 'Test Task',
    status: { name: 'Todo', color: '#6B7280' },
    priority: { name: 'High', color: '#EF4444' },
  }

  beforeEach(() => {
    wrapper = mount(TaskCard, {
      props: { task: mockTask },
      global: {
        plugins: [createTestingPinia()],
      },
    })
  })

  it('renders task title', () => {
    expect(wrapper.text()).toContain('Test Task')
  })

  it('emits update event on save', async () => {
    await wrapper.find('[data-testid="save-btn"]').trigger('click')
    expect(wrapper.emitted('update')).toBeTruthy()
  })
})
```

## Mounting Components

### With Pinia

```typescript
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(Component, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          tasks: { tasks: [mockTask], loading: false },
        },
      }),
    ],
  },
})
```

### With Vue Router

```typescript
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

const wrapper = mount(Component, {
  global: {
    plugins: [router],
  },
})

await router.isReady()
```

### With Stubs

```typescript
const wrapper = mount(ParentComponent, {
  global: {
    stubs: {
      ChildComponent: true,  // Stub completely
      RouterLink: true,
    },
  },
})
```

## Testing Patterns

### Testing Props

```typescript
it('applies correct class based on priority', () => {
  const wrapper = mount(TaskCard, {
    props: { task: { ...mockTask, priority: { name: 'High' } } },
  })
  expect(wrapper.classes()).toContain('task--high-priority')
})
```

### Testing Events

```typescript
it('emits delete event with task id', async () => {
  await wrapper.find('[data-testid="delete-btn"]').trigger('click')
  expect(wrapper.emitted('delete')).toEqual([['1']])
})
```

### Testing v-model

```typescript
it('updates input value', async () => {
  const input = wrapper.find('input')
  await input.setValue('New Title')
  expect(wrapper.emitted('update:modelValue')).toEqual([['New Title']])
})
```

### Testing Async Behavior

```typescript
import { flushPromises } from '@vue/test-utils'

it('loads data on mount', async () => {
  const wrapper = mount(TaskList)
  await flushPromises()
  expect(wrapper.findAll('[data-testid="task-item"]')).toHaveLength(3)
})
```

## Mocking

### Mock API Calls

```typescript
vi.mock('@/api/tasks', () => ({
  fetchTasks: vi.fn().mockResolvedValue([mockTask]),
  createTask: vi.fn().mockResolvedValue(mockTask),
}))
```

### Mock Composables

```typescript
vi.mock('@/composables/useTasks', () => ({
  useTasks: () => ({
    tasks: ref([mockTask]),
    loading: ref(false),
    fetchTasks: vi.fn(),
  }),
}))
```

## Best Practices

- Use `data-testid` attributes for test selectors
- Test behavior, not implementation details
- Prefer `mount` for integration tests, `shallowMount` for isolation
- Always await async operations with `flushPromises`
- Clean up mocks in `beforeEach` or `afterEach`
- Group related tests with `describe` blocks
- Use meaningful test descriptions: "should X when Y"
