---
name: code-documentation
description: 'TSDoc and inline comment patterns. Use when documenting exported functions, Vue components, or complex logic that needs explanation.'
---

# Code Documentation Skill

> **"Write code that speaks for itself. Document only WHY, not WHAT."**

## When to Document

✅ **DO document:**
- Exported functions, composables, utils
- Vue component props/emits contracts
- Complex business logic or algorithms
- Non-obvious workarounds or hacks

❌ **DON'T document:**
- Self-explanatory code
- What the code does (use better names instead)
- Obvious operations

## Quick Reference

### TSDoc for Functions

```typescript
/**
 * Brief description of what the function does
 * 
 * @param paramName - What this parameter is for
 * @returns What the function returns
 * @throws {ErrorType} When this error occurs (if applicable)
 */
export function myFunction(paramName: string): ReturnType {
  // Implementation
}
```

### Vue Component Documentation

```vue
<script setup lang="ts">
interface Props {
  /** Brief description of what this prop does */
  task: Task
  editable?: boolean
}

const emit = defineEmits<{
  'update': [task: Task]
  'delete': []
}>()
</script>
```

### Inline Comments

**Only for WHY, not WHAT:**

```typescript
// ✅ Good: Explains reasoning
// Using debounce to prevent API spam during typing
await debounce(handleSearch, 300)

// ❌ Bad: States the obvious  
const total = price + tax // Add price and tax
```

### Annotation Keywords

```typescript
// TODO: Add authentication
// FIXME: Memory leak in loop
// HACK: Workaround for bug in v2.1.0
// NOTE: Assumes UTC timezone
```

## Summary

1. **Self-documenting code first** - Good names > comments
2. **Explain WHY, not WHAT** - Add insight, don't repeat code  
3. **TSDoc for exports** - All public APIs need docs
4. **Keep it updated** - Wrong docs are worse than no docs
