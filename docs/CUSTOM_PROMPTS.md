# 📋 Custom Prompts

> Reusable prompt templates for standardized, repeatable AI interactions.

**Audience:** Developers creating team-shared prompts | **Prerequisites:** [AI Development Guide][ai-guide]


## 📌 Quick Reference

| Aspect | Details |
|--------|---------|
| **File extension** | `.prompt.md` |
| **Location** | `.github/prompts/` (shared) or user profile (personal) |
| **Invocation** | Type `/` in chat to see available prompts |
| **Scope** | Single chat interaction (not persistent like instructions) |


## 💡 What & Why

Custom prompts are **reusable templates** for common AI interactions. Unlike custom instructions (which apply automatically), prompts are invoked on-demand for specific tasks.

**Think of it this way:**

| Concept | Analogy | Behavior |
|---------|---------|----------|
| **Instructions** | Agent's long-term memory | Always applied |
| **Prompts** | Reusable scripts | Invoked when needed |

**Use cases:**

| Category | Examples |
|----------|----------|
| Code generation | Components, tests, API mocks |
| Domain expertise | Security checks, compliance reviews |
| Team collaboration | Shared patterns, onboarding guides |
| Repetitive tasks | Release notes, changelog entries |


## ⚙️ How It Works

```
Developer types /generate-component
      ↓
Copilot loads .github/prompts/generate-component.prompt.md
      ↓
Prompt template + developer input → AI response
      ↓
Standardized, consistent output
```


## ✍️ Creating Prompts

### Minimal Agent Delegation (Preferred)

When a prompt invokes a custom agent via the `agent:` property, keep the prompt **minimal**. The agent already knows conventions, patterns, and workflows—your prompt just triggers it.

```markdown
description: Brief description shown in prompt picker
agent: AgentName

# Task Title

One-sentence description of what to generate.

**Specify:** What the user needs to provide.
```

| ✅ Include | ❌ Exclude (agent handles) |
|-----------|---------------------------|
| 1-2 sentence task description | Workflow steps |
| `**Specify:**` section for parameters | Coding conventions |
| | Tool usage patterns |
| | Output format details |

### Example: Component Generator (Minimal)

**File:** `.github/prompts/generate-component.prompt.md`

```markdown
description: Generate a Vue 3 component following project conventions
agent: Implement

# Generate Vue Component

Generate a Vue 3 component with TypeScript, props/emits, and scoped styles.

**Specify:** Component name, purpose, props, and events.
```

> 💡 **Why this works:** The [Implement agent][implement-agent] already references [vue-components.instructions.md][vue-comp-instructions], knows CSS variable conventions, and includes `data-testid` attributes. No need to repeat.

### When to Include More Detail

Add domain-specific content when it's **NOT** in the agent or skills:

```markdown
description: Generate GraphQL resolver with caching
agent: Implement

# Generate GraphQL Resolver

Generate a GraphQL resolver with Redis caching.

**Specify:** Query/mutation name, return type, cache TTL.

**Caching Strategy:**
- Cache reads for 5 minutes by default
- Invalidate on related mutations
- Use user-scoped cache keys for personalized data
```

> 💡 **Why:** Caching strategy is task-specific, not in the agent's general knowledge.


## 🔄 Prompt vs Instruction vs Agent vs Skill

| Feature | Custom Prompt | Custom Instruction | Custom Agent | Skill |
|---------|---------------|-------------------|--------------|-------|
| **Purpose** | Trigger agent for task | Coding standards | Specialized persona | Reusable knowledge |
| **Persistence** | On-demand | Always applied | On-demand | On-demand |
| **Scope** | One interaction | All matching files | Entire workflow | Referenced by agents |
| **File type** | `.prompt.md` | `.instructions.md` | `.agent.md` | `SKILL.md` |
| **Best for** | Quick task triggers | Conventions | Multi-step processes | Domain checklists |


## 📐 Patterns

### ✅ Do: Minimal Agent Proxy

```markdown
description: Generate changelog entry for a release
agent: Implement

# Generate Changelog Entry

Generate a changelog entry from commits since the last release tag.

**Specify:** Release version and date range.
```

> 💡 Agent handles format, conventions, and workflow. Prompt is just a trigger.

### ⚠️ Avoid: Repeating Agent Knowledge

```markdown
description: Generate a Vue 3 component
agent: Implement

# Generate Vue Component

## Requirements
- Use `<script setup lang="ts">`
- Use CSS variables from variables.css
- Include data-testid attributes
...30 more lines...
```

> ⚠️ The [Implement agent][implement-agent] already knows all this from its instructions and skills.

### ✅ Do: Extract Domain Knowledge to Skills

When you have domain-specific checklists or patterns that multiple prompts/agents need:

1. Create a skill: `.github/skills/security-review/SKILL.md`
2. Reference it in the agent or prompt

```markdown
description: Security review checklist
agent: Specify & Validate

# Security Review

Perform a read-only security review using the security-review skill.

**Specify:** File paths or feature to review.
```

> 💡 Skills are reusable across agents. Update the checklist in one place.

### ⚠️ Avoid: External URLs

```markdown
Follow the style guide at https://example.com/style-guide
```

> ⚠️ External URLs may not be accessible or may change.


## 📁 This Project's Prompts

| Prompt | Purpose | Agent |
|--------|---------|-------|
| `/generate-component` | Vue 3 component scaffold | [Implement][implement-agent] |
| `/generate-api-endpoint` | Express route with Prisma queries | [Implement][implement-agent] |
| `/generate-pinia-store` | Pinia Setup Store scaffold | [Implement][implement-agent] |
| `/generate-e2e-test` | Playwright test with Page Object | [Test E2E][test-e2e-agent] |
| `/generate-unit-test` | Vitest test for component or route | [Test Unit][test-unit-agent] |
| `/review-security` | Security review (uses `security-review` skill) | [Specify & Validate][specify-agent] |
| `/specify` | Create implementation plan | [Specify & Validate][specify-agent] |

> 💡 **Tip:** Prompts are thin wrappers around agents. Keep them minimal—agents have the knowledge.
> 
> 💡 **Tip:** Extract reusable domain knowledge (checklists, patterns) into skills.


## 🤖 Available Agents

| Agent | File | Purpose |
|-------|------|---------|
| **Implement** | [implement.agent.md][implement-agent] | Code generation following project conventions |
| **Specify & Validate** | [specify.agent.md][specify-agent] | Create implementation plans, reviews |
| **Test Unit** | [test-unit.agent.md][test-unit-agent] | Unit test generation with Vitest |
| **Test E2E** | [test-e2e.agent.md][test-e2e-agent] | E2E test generation with Playwright |


## 🔗 Related

| Document | Description |
|----------|-------------|
| [AI Development Guide][ai-guide] | Overview and feature index |
| [Custom Instructions][custom-instructions] | Persistent coding standards |
| [Custom Agents][custom-agents] | Specialized AI personas |


<!-- Project Documentation -->
[ai-guide]: AI_DEVELOPMENT_GUIDE.md
[custom-agents]: CUSTOM_AGENTS.md
[custom-instructions]: CUSTOM_INSTRUCTIONS.md

<!-- Custom Agent Files -->
[implement-agent]: ../.github/agents/implement.agent.md
[specify-agent]: ../.github/agents/specify.agent.md
[test-e2e-agent]: ../.github/agents/test-e2e.agent.md
[test-unit-agent]: ../.github/agents/test-unit.agent.md

<!-- Instructions Files Referenced -->
[vue-comp-instructions]: ../.github/instructions/vue-components.instructions.md
