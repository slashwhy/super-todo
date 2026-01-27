# 📋 Custom Prompts

> Reusable prompt templates for standardized, repeatable AI interactions.

**Audience:** Developers creating team-shared prompts | **Prerequisites:** [AI Development Guide](./AI_DEVELOPMENT_GUIDE.md)

---

## Quick Reference

| Aspect | Details |
|--------|---------|
| **File extension** | `.prompt.md` |
| **Location** | `.github/prompts/` (shared) or user profile (personal) |
| **Invocation** | Type `/` in chat to see available prompts |
| **Scope** | Single chat interaction (not persistent like instructions) |

---

## What & Why

Custom prompts are **reusable templates** for common AI interactions. Unlike custom instructions (which apply automatically), prompts are invoked on-demand for specific tasks.

**Think of it this way:**
- **Instructions** = Agent's long-term memory (always applied)
- **Prompts** = Reusable scripts for specific tasks (invoked when needed)

**Use cases:**
- Code generation templates (components, tests, API mocks)
- Domain expertise (security checks, compliance reviews)
- Team collaboration (shared patterns, onboarding guides)
- Repetitive tasks (release notes, changelog entries)

---

## How It Works

```
Developer types #generate-component
      ↓
Copilot loads .github/prompts/generate-component.prompt.md
      ↓
Prompt template + developer input → AI response
      ↓
Standardized, consistent output
```

---

## Creating Prompts

### File Structure

```markdown
---
description: Brief description shown in prompt picker
---

# Prompt Title

Your prompt instructions here...

## Context
Describe what context the AI should consider.

## Output Format
Describe the expected output structure.

## Constraints
- List any rules or limitations
- The AI should follow
```

### Example: Component Generator

**File:** `.github/prompts/generate-component.prompt.md`

```markdown
---
description: Generate a Vue 3 component following project conventions
---

# Generate Vue Component

Create a new Vue 3 component with the following specifications:

## Requirements
- Use `<script setup lang="ts">`
- Define props with `defineProps<T>()` interface syntax
- Define emits with `defineEmits<T>()` interface syntax
- Use CSS variables from `src/assets/styles/variables.css`
- Include `data-testid` attributes for testing

## Output
Provide the complete component file content.

## Constraints
- Never use `v-if` with `v-for` on the same element
- Never hardcode colors or spacing values
- Always include proper TypeScript types
```

### Example: API Mock Generator

**File:** `.github/prompts/generate-api-mock.prompt.md`

```markdown
---
description: Generate Vitest mock for backend API endpoint
---

# Generate API Mock

Create a mock for the specified API endpoint.

## Requirements
- Use Vitest's `vi.mock()` syntax
- Mock the Prisma client appropriately
- Include success and error scenarios
- Follow the AAA pattern (Arrange, Act, Assert)

## Output Format
```typescript
// Mock setup
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    // mocked methods
  }
}))

// Test cases
describe('endpoint', () => {
  // tests
})
```
```

---

## Prompt vs Instruction vs Agent

| Feature | Custom Prompt | Custom Instruction | Custom Agent |
|---------|---------------|-------------------|--------------|
| **Purpose** | Single-task template | Coding standards | Specialized persona |
| **Persistence** | On-demand | Always applied | On-demand |
| **Scope** | One interaction | All matching files | Entire workflow |
| **File type** | `.prompt.md` | `.instructions.md` | `.agent.md` |
| **Best for** | Repetitive tasks | Conventions | Multi-step processes |

---

## Patterns

### ✅ Do This

```markdown
---
description: Generate changelog entry for a release
---

# Generate Changelog Entry

Based on the commits since the last release tag, generate a changelog entry.

## Format
- Group by: Features, Fixes, Breaking Changes
- Use conventional commit prefixes
- Link to relevant PRs

## Output
Return markdown formatted for CHANGELOG.md
```

**Why:** Clear purpose, structured output, specific constraints.

### ⚠️ Avoid This

```markdown
Write a changelog.
```

**Why:** Too vague—no structure, no constraints, inconsistent results.

---

### ✅ Do This: Include Context References

```markdown
## Context
Reference these files for conventions:
- `src/assets/styles/variables.css` for CSS variables
- `.github/instructions/vue-components.instructions.md` for component patterns
```

**Why:** Prompts can reference project files for consistent output.

### ⚠️ Avoid This: External URLs

```markdown
Follow the style guide at https://example.com/style-guide
```

**Why:** External URLs may not be accessible or may change.

---

## This Project's Prompts

| Prompt | Purpose | Agent |
|--------|---------|-------|
| `#generate-component` | Vue 3 component scaffold | `Implement` |
| `#generate-api-endpoint` | Express route with Prisma queries | `Implement` |
| `#generate-pinia-store` | Pinia Setup Store scaffold | `Implement` |
| `#generate-e2e-test` | Playwright test with Page Object | `Test E2E` |
| `#generate-unit-test` | Vitest test for component or route | `Test Unit` |
| `#review-security` | Security review checklist | `Specify & Validate` |

> 💡 **Tip:** Prompts reference agents for tool inheritance — update tools in one place.
> 
> 💡 **Tip:** Create prompts for any task you do more than twice.

---

## Related

- [AI Development Guide](./AI_DEVELOPMENT_GUIDE.md) – Overview and feature index
- [Custom Instructions](./CUSTOM_INSTRUCTIONS.md) – Persistent coding standards
- [Custom Agents](./CUSTOM_AGENTS.md) – Specialized AI personas
