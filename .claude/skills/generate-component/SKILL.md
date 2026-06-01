---
name: generate-component
description: Generate a Vue 3 component with script setup, TypeScript props/emits, scoped styles using CSS variables, and data-testid attributes.
argument-hint: "<ComponentName> [description]"
disable-model-invocation: true
allowed-tools: Read Write
---

# Generate Component

Scaffold a Vue 3 component following all project conventions.

## How to Invoke

```
/generate-component <ComponentName>
/generate-component <ComponentName> — <brief description of purpose>
```

## What to Specify

Provide as much context as helpful:
- Component name (PascalCase)
- Purpose and where it will be used
- Props it should accept (names, types, required/optional)
- Events it should emit
- Whether it needs Pinia store access
- Any API calls or async data
- Rough layout or Figma reference

## Output

The generated component will include:
- `<script setup lang="ts">` block with typed props and emits interfaces
- `<template>` with `data-testid` attributes on interactive elements
- `<style scoped>` using only CSS variables from `variables.css`
- No hardcoded colors or spacing values
