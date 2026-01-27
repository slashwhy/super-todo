---
description: Generate a Vue 3 component following project conventions
agent: Implement
---

# Generate Vue Component

Create a new Vue 3 component with the following specifications.

## Requirements

- Use `<script setup lang="ts">`
- Define props with `defineProps<T>()` interface syntax
- Define emits with `defineEmits<T>()` interface syntax
- Use CSS variables from `src/assets/styles/variables.css`
- Include `data-testid` attributes for testing
- Follow BEM naming for CSS classes

## Context

Reference these files for conventions:
- `.github/instructions/vue-components.instructions.md` for component patterns
- `.github/instructions/styling.instructions.md` for CSS patterns

## Output

Provide the complete component file content with:
1. Script section with proper TypeScript types
2. Template section with semantic HTML
3. Scoped styles using CSS variables

## Constraints

- Never use `v-if` with `v-for` on the same element
- Never hardcode colors or spacing values
- Always include proper TypeScript types
- Always add `data-testid` for interactive elements
