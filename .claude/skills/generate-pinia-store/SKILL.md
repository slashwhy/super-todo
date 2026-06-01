---
name: generate-pinia-store
description: Generate a Pinia store using Setup Store syntax with TypeScript, async actions, error/loading state, and a $reset() method.
argument-hint: "<storeName>"
disable-model-invocation: true
allowed-tools: Read Write
---

# Generate Pinia Store

Scaffold a Pinia store following all project conventions.

## How to Invoke

```
/generate-pinia-store <storeName>
/generate-pinia-store tasks — fetches from /api/tasks, supports filters
```

## What to Specify

Provide as much context as helpful:
- Store name (camelCase, will be `use<Name>Store`)
- State shape (what data it holds)
- API endpoints it calls
- Actions needed (fetch, create, update, delete)
- Computed getters needed
- Whether it needs relations or filtering

## Output

The generated store will use Setup Store syntax:
```typescript
export const useTasksStore = defineStore('tasks', () => {
  const items = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchItems = async () => { ... };

  function $reset() {
    items.value = [];
    loading.value = false;
    error.value = null;
  }

  return { items, loading, error, fetchItems, $reset };
});
```

Uses `storeToRefs()` for reactive destructuring in components.
