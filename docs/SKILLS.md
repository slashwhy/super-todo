# 🎓 Agent Skills

> On-demand knowledge modules that teach Copilot specialized capabilities — loaded progressively, portable across agents.

**Audience:** Developers using or creating skills | **Prerequisites:** [Custom Instructions][custom-instructions], [Custom Agents][custom-agents]

## 📋 Quick Reference

### This Project's Skills

| Skill                                                              | Description                                                             |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [`vue-components`][skill-vue-components]                           | Vue 3 Composition API patterns, props, emits, slots                     |
| [`vue-composables`][skill-vue-composables]                         | Reusable composition functions with `use*` naming                       |
| [`pinia-stores`][skill-pinia-stores]                               | State management with Setup Store syntax                                |
| [`prisma-database`][skill-prisma-database]                         | ORM queries, migrations, relations                                      |
| [`backend-routes`][skill-backend-routes]                           | Express handlers, async/await, field whitelisting                       |
| [`styling`][skill-styling]                                         | CSS variables, BEM naming, responsive patterns                          |
| [`unit-testing`][skill-unit-testing]                               | Vitest patterns, AAA, mocking                                           |
| [`e2e-testing`][skill-e2e-testing]                                 | Playwright Page Objects, `data-testid` selectors                        |
| [`code-documentation`][skill-code-documentation]                   | TSDoc patterns, when to document                                        |
| [`architectural-documentation`][skill-architectural-documentation] | Implementation plans, ADRs, README updates                              |
| [`security-review`][skill-security-review]                         | OWASP security checklist for API endpoints and frontend vulnerabilities |

**Location:** `.github/skills/<skill-name>/SKILL.md`

## 🌐 Overview

### What Are Agent Skills?

Agent Skills are folders of instructions, scripts, and resources that Copilot can load when relevant to perform specialized tasks. They follow an [open standard][agentskills] supported by multiple AI agents including GitHub Copilot, Claude, Cursor, and others.

Unlike [custom instructions][custom-instructions] (which define coding standards that always apply), skills enable **specialized capabilities** loaded **on demand** — including scripts, examples, and other resources alongside instructions.

**Key benefits:**

- **Specialize Copilot** — Tailor capabilities for domain-specific tasks without repeating context
- **Reduce repetition** — Create once, use automatically across all conversations
- **Compose capabilities** — Combine multiple skills to build complex workflows
- **Efficient loading** — Only relevant content loads into context when needed
- **Portable** — Works across VS Code, Copilot CLI, and Copilot cloud agent

> 📖 **Official Docs:** [VS Code Agent Skills][vscode-agent-skills] · [GitHub About Agent Skills][github-about-agent-skills] · [Creating Skills][github-create-skills] · [Skills Standard][agentskills]

### Skills vs Custom Instructions

| Aspect          | Agent Skills                                     | Custom Instructions                        |
| --------------- | ------------------------------------------------ | ------------------------------------------ |
| **Purpose**     | Specialized capabilities and workflows           | Define coding standards and guidelines     |
| **Portability** | VS Code, Copilot CLI, and coding agent           | VS Code and GitHub.com only                |
| **Content**     | Instructions, scripts, examples, resources       | Instructions only                          |
| **Scope**       | Task-specific, loaded on-demand                  | Always applied (or via glob patterns)      |
| **Standard**    | Open standard ([agentskills.io][agentskills])    | VS Code-specific                           |
| **When to use** | More detailed instructions for specialized tasks | Simple rules relevant to almost every task |

### How Skills Work (Progressive Disclosure)

| Level               | What Happens                                                                     |
| ------------------- | -------------------------------------------------------------------------------- |
| **1. Discovery**    | Copilot reads `name` and `description` from frontmatter to decide relevance      |
| **2. Instructions** | If relevant, loads the `SKILL.md` body into context                              |
| **3. Resources**    | Accesses scripts, examples, and docs in the skill directory only when referenced |

This means you can install many skills without consuming context — only relevant content loads.

## 📁 Skill Locations

| Type                | Location                                                       | Scope                  |
| ------------------- | -------------------------------------------------------------- | ---------------------- |
| **Project skills**  | `.github/skills/`, `.claude/skills/`, `.agents/skills/`        | Repository-specific    |
| **Personal skills** | `~/.copilot/skills/`, `~/.claude/skills/`, `~/.agents/skills/` | Shared across projects |

> **Monorepo tip:** Enable `chat.useCustomizationsInParentRepositories` to discover skills from the parent repository root.

Additional locations can be configured with the `chat.skillsLocations` VS Code setting.

## 🔧 SKILL.md File Format

### Frontmatter (Required)

```yaml
---
name: my-skill-name
description: What this skill does and when to use it. Be specific about capabilities and use cases.
---
```

| Property                   | Required | Description                                                                                                               |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | Yes      | Unique identifier. Lowercase, hyphens for spaces. Must match parent directory name. Max 64 chars.                         |
| `description`              | Yes      | What the skill does and when to use it. Max 1024 chars.                                                                   |
| `argument-hint`            | No       | Hint text shown when skill is invoked as slash command (e.g., `[test file] [options]`)                                    |
| `user-invocable`           | No       | Show as `/` slash command in chat menu. Default: `true`                                                                   |
| `disable-model-invocation` | No       | Prevent auto-loading by agent. Default: `false`. Set `true` for manual-only skills                                        |
| `allowed-tools`            | No       | Tools the skill may use without confirmation (e.g., `shell`). **Review carefully before pre-approving `shell` or `bash`** |
| `license`                  | No       | License that applies to this skill                                                                                        |

### Invocation Control

| Configuration                    | Slash Command | Auto-Load | Best For                                           |
| -------------------------------- | ------------- | --------- | -------------------------------------------------- |
| Default (both omitted)           | Yes           | Yes       | General-purpose skills                             |
| `user-invocable: false`          | No            | Yes       | Background knowledge the model loads when relevant |
| `disable-model-invocation: true` | Yes           | No        | On-demand only skills                              |
| Both set                         | No            | No        | Effectively disabled                               |

### Body

The body contains instructions, guidelines, and examples. Write clear, specific instructions covering:

- What the skill helps accomplish
- When to use the skill
- Step-by-step procedures
- Examples of expected input/output
- References to included scripts or resources (use relative paths: `[script](./my-script.sh)`)

### Complete Example

````markdown
---
name: webapp-testing
description: Guide for testing web applications with Vitest and Vue Test Utils. Use when writing component or integration tests.
---

# Web Application Testing

## When to Use

Use this skill when:

- Writing new component tests
- Adding integration tests for stores or composables
- Debugging failing test suites

## Test Structure (AAA Pattern)

```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    const wrapper = mount(Component, { props: { ... } })

    // Act
    await wrapper.find('[data-testid="button"]').trigger('click')

    // Assert
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })
})
```
````

## Resources

- [Test template](./test-template.ts)
- [Mock helpers](./mock-helpers.ts)

```

## 📝 Creating New Skills

1. Create a directory: `.github/skills/<skill-name>/`
2. Add a `SKILL.md` with frontmatter and instructions
3. Optionally add scripts, examples, or other resources
4. Reference any additional files in `SKILL.md` using relative paths

**Directory structure example:**

```

.github/skills/my-skill/
├── SKILL.md # Required — instructions and metadata
├── template.ts # Optional — template files
├── examples/ # Optional — example scenarios
│ └── basic-usage.md
└── scripts/ # Optional — automation scripts
└── validate.sh

```

### Generate with AI

Type `/create-skill` in chat and describe the capability. Copilot will ask clarifying questions and generate the `SKILL.md`. You can also extract a skill from an ongoing conversation — after debugging a complex issue, ask "create a skill from how we just debugged that."

### Scripts in Skills

Skills can include scripts that Copilot runs as part of the workflow:

1. Add the script to the skill directory
2. Optionally pre-approve tools in frontmatter: `allowed-tools: shell`
3. Reference the script in `SKILL.md` instructions

> ⚠️ **Security:** Only pre-approve `shell` or `bash` if you've reviewed the skill and trust its source. Pre-approving removes the confirmation step for terminal commands.

## 🔍 Using Skills

### As Slash Commands

Type `/` in chat to see available skills and prompts. Add context after the command:

- `/webapp-testing for the login page`
- `/security-review the auth middleware`

### Auto-Loading

When skills have `user-invocable: true` (default) and `disable-model-invocation: false` (default), Copilot automatically discovers and loads relevant skills based on your prompt.

### Shared Skills

Install community skills from:

- [github/awesome-copilot][awesome-copilot] — Community collection of skills, agents, and prompts
- [anthropics/skills][reference-skills] — Reference skills from Anthropic

To use: copy the skill directory to `.github/skills/`, review and customize the `SKILL.md`.

> ⚠️ **Always review shared skills** before using them. Check scripts for security implications.

## 🔗 Related

- [Custom Agents](./CUSTOM_AGENTS.md) — Agent definitions that leverage skills
- [Custom Instructions](./CUSTOM_INSTRUCTIONS.md) — Coding standards (complementary to skills)
- [Custom Prompts](./CUSTOM_PROMPTS.md) — Reusable task templates
- [Context Optimization](./CONTEXT_OPTIMIZATION.md) — Progressive disclosure and token efficiency
- [Security Guide](./SECURITY.md) — Security considerations for scripts and tools

<!-- Skill Files -->

[skill-vue-components]: ../.github/skills/vue-components/SKILL.md
[skill-vue-composables]: ../.github/skills/vue-composables/SKILL.md
[skill-pinia-stores]: ../.github/skills/pinia-stores/SKILL.md
[skill-prisma-database]: ../.github/skills/prisma-database/SKILL.md
[skill-backend-routes]: ../.github/skills/backend-routes/SKILL.md
[skill-styling]: ../.github/skills/styling/SKILL.md
[skill-unit-testing]: ../.github/skills/unit-testing/SKILL.md
[skill-e2e-testing]: ../.github/skills/e2e-testing/SKILL.md
[skill-code-documentation]: ../.github/skills/code-documentation/SKILL.md
[skill-architectural-documentation]: ../.github/skills/architectural-documentation/SKILL.md
[skill-security-review]: ../.github/skills/security-review/SKILL.md

<!-- Project Documentation -->

[custom-agents]: ./CUSTOM_AGENTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[custom-prompts]: ./CUSTOM_PROMPTS.md

<!-- GitHub Copilot Documentation -->

[vscode-agent-skills]: https://code.visualstudio.com/docs/copilot/customization/agent-skills
[github-about-agent-skills]: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
[github-create-skills]: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills
[agentskills]: https://agentskills.io/
[reference-skills]: https://github.com/anthropics/skills
[awesome-copilot]: https://github.com/github/awesome-copilot
[copilot-cheat-sheet]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
```
