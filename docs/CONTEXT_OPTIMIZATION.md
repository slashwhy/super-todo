# 🎓 Context Optimization

> Maximize LLM performance and minimize costs through intelligent context management.

**Audience:** Advanced users optimizing agent efficiency | **Prerequisites:** [CUSTOM_AGENTS.md][custom-agents]

## ⚡ Quick Navigation

| Section                                        | Purpose                           |
| ---------------------------------------------- | --------------------------------- |
| [❓ What & Why](#what--why)                    | Understand the problem            |
| [✨ Best Practices](#best-practices)           | Instructions and tools strategies |
| [� Plan-Based Handoff](#plan-based-handoff)    | Cross-session context transfer    |
| [🏗️ Structured Autonomy](#structured-autonomy) | Premium planning, cheap execution |
| [🔗 Key Resources](#key-resources)             | Where to implement optimization   |

## What & Why

LLM context windows (currently 128K tokens) fill faster than expected due to hidden overhead:

```
128K Token Context Window
├─ System prompts         2-5K   ━━
├─ Custom instructions    5-10K  ━━━━
├─ Agent definitions      3-8K   ━━━
├─ MCP tool definitions   20-50K ━━━━━━━━━━━━━  ← Biggest culprit
├─ Skills & procedures    5-15K  ━━━━━━
└─ Your actual code       ~50K   ━━━━━━━━━━━━
```

**Result:** 50-70K tokens consumed before addressing your problem, leaving only ~58-78K for actual work.

> 📖 **Related:** For MCP-specific optimization (Code Execution Pattern, Progressive Disclosure), see [MCP.md][mcp].

## Best Practices

### 🎯 The Golden Rule

**As much as needed, but as few and small and specific as you can go.**

Keep your instructions and tools:

- ✅ **Focused** – Each instruction should solve one problem
- ✅ **Minimal** – Include only what's necessary
- ✅ **Specific** – Be precise about scope and requirements
- ✅ **Reusable** – Build skills that work across tasks

### 📋 Instruction Strategy

Structure your instructions across three levels:

1. **Global Instructions** – Foundational rules (coding standards, naming conventions)
2. **Task-Specific Instructions** – Problem-domain rules (backend routes, Vue components, testing)
3. **Agent Skills** – Specialized knowledge used by agents to accomplish goals

👉 See [CUSTOM_INSTRUCTIONS.md][custom-instructions] for the instruction hierarchy and composition patterns.

### 🛠 Custom Agents Strategy

Design agents with focused toolsets:

1. **Define clear agent scope** – What problem does this agent solve?
2. **Attach minimal instructions** – Only rules this agent needs
3. **Use skill references** – Point to reusable skills, don't duplicate
4. **Load tools on-demand** – Include only tools the agent needs use

👉 See [CUSTOM_AGENTS.md][custom-agents] for agent definitions and skills reference.

### 🤖 Subagent Strategy

Use subagents to isolate research from decision-making:

| Scenario                          | Benefit                                          |
| --------------------------------- | ------------------------------------------------ |
| Codebase research (30-50K tokens) | Only summary (~1-2K) returns to main context     |
| Parallel analysis tasks           | Multiple subagents run concurrently              |
| Exploratory research              | Dead ends don't pollute main context             |
| Specialized reviews               | Security, performance, a11y reviews in isolation |

> 📖 **Official Docs:** [VS Code Subagents][vscode-subagents]

> 💡 **Context Anxiety mitigation:** Subagents keep the main session's context window available for decisions. Research that would exhaust 30–50K tokens happens in an isolated subagent; only the summary (~1–2K) flows back. See [Context Anxiety & Context Reset](#context-anxiety) below.

## Plan-Based Handoff

### The Problem

When @Specify plans a feature, the planning conversation can consume 50-100K tokens (Jira data, Figma analysis, codebase research, clarification rounds). With a 128K context window, if @Implement starts in the same session, almost no capacity remains for actual code.

### The Solution

Plans are persisted to `/memories/session/plan.md`:

```
@Specify (Session 1)              @Implement (Session 2)
┌────────────────────┐            ┌────────────────────┐
│ Jira fetch    15K  │            │ Plan file      5K  │
│ Figma analyze 20K  │    💾      │ Instructions  10K  │
│ Research      30K  │ ──────▶    │ Code context  50K  │
│ Q&A rounds    10K  │  plan.md   │ Available!    63K  │
│ Plan output    5K  │            │                    │
├────────────────────┤            └────────────────────┘
│ Used: ~80K         │            Used: ~15K initially
│ Remaining: ~48K ❌ │            Remaining: ~113K ✅
└────────────────────┘
```

### Workflow

1. **@Specify** creates `/memories/session/plan.md` with all decisions resolved
2. User opens a **new chat session** with @Implement
3. **@Implement** reads the plan file via `#file:` reference
4. Implementation starts with a clean context window (~113K available)
5. @Implement updates plan checkboxes as steps complete
6. After completion, the Completion Protocol ensures documentation stays in sync

### File Structure

```
/memories/                    ← Persistent memory
  session/                    ← Cleared after session
    plan.md                   ← Implementation plan
```

### Issue Name Convention

| Type        | Example                 |
| ----------- | ----------------------- |
| Jira ticket | `TASK-123-user-profile` |
| Feature     | `feat-task-filters`     |
| Bug fix     | `fix-login-redirect`    |
| Chore       | `chore-update-vue`      |
| Docs        | `docs-api-reference`    |

### Context Anxiety

**Context Anxiety** describes a specific model behavior degradation that occurs as the context window approaches its limit. Symptoms include:

- Skipping steps or rushing to complete tasks prematurely
- Reduced adherence to coding conventions and instructions
- Shorter, less thorough responses
- Premature task closure ("this should be sufficient")

**Root cause:** As tokens are consumed, the model's attention is increasingly divided between the accumulated context and generating the next output. Instructions loaded early in the session receive progressively less effective attention.

**Mitigation:** Use a [Context Reset](#context-reset-vs-compaction) before symptoms appear — typically when a session has consumed more than ~60% of the context budget or when you notice output quality declining.

### Context Reset vs. Compaction

Two strategies exist for managing a filling context window:

| Strategy          | Mechanism                                                     | Tradeoff                                              |
| ----------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| **Context Reset** | Close the session; start fresh referencing a state artifact   | Full coherence at the cost of raw conversation history |
| **Compaction**    | Summarize conversation history in-place and continue          | Continuity preserved but semantic drift is possible   |

**Context Reset (recommended for long tasks):**

1. Save progress to an artifact (e.g., `plan.md` with checkboxes marking completed steps)
2. Open a **new session**
3. Reference the artifact: `Read #file:/memories/session/plan.md and continue from step N`
4. The new session starts with a clean context window and only the artifact as payload

**Compaction (built-in in some tools):**
Some AI tools automatically summarize conversation history when the context window fills. This maintains session continuity but risks losing nuance or introducing subtle errors through summarization. Check your tool's behavior — Copilot Chat currently resets rather than compacts.

> This is why the [Plan-Based Handoff](#plan-based-handoff) pattern is central to this workflow: `@Specify` and `@Implement` always run in separate sessions, each starting with a clean context. The `plan.md` file is the state artifact that bridges them.

## Structured Autonomy

Our agent workflow is inspired by the [Structured Autonomy][structured-autonomy] pattern from [github/awesome-copilot][awesome-copilot]. The core principle:

> **Use premium models sparingly for thinking, use cheaper models liberally for doing.**

### Three-Phase Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   @Specify      │ ──▶ │   (Optional)    │ ──▶ │   @Implement    │
│  (1 session)    │     │   sa-generate   │     │  (new session)  │
│  Premium Model  │     │  Premium Model  │     │  Balanced Model │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       Plan                 Detailed code            Execute
 /memories/session/        instructions             step by step
```

| Phase                      | Model Cost               | Token Usage               | Output                               |
| -------------------------- | ------------------------ | ------------------------- | ------------------------------------ |
| **Plan** (@Specify)        | Premium (high reasoning) | High (research, analysis) | `plan.md` saved to disk              |
| **Generate** (optional)    | Premium                  | Medium                    | Detailed implementation instructions |
| **Implement** (@Implement) | Balanced/Fast            | Variable                  | Working code                         |

### Why This Works

- **Cost efficiency** — Premium models used only for thinking (1-2 sessions), cheaper models do the coding (many iterations)
- **Better code quality** — Planning phase researches codebase patterns first, so generated code follows conventions
- **Developer engagement** — Step-by-step implementation with confirmation keeps the developer in the loop
- **Context isolation** — Each phase starts fresh, no context window bloat from previous phases (critical with 128K limit)

### Differences from Upstream

| Aspect           | awesome-copilot SA                          | Our Workflow                               |
| ---------------- | ------------------------------------------- | ------------------------------------------ |
| Plan storage     | `plans/` in workspace root                  | `/memories/session/plan.md`                |
| Generate phase   | Required (separate prompt)                  | Optional (plan is detailed enough)         |
| Implementation   | Cheap model, follows instructions           | Balanced model, follows plan + conventions |
| Workflow trigger | `/sa-plan`, `/sa-generate`, `/sa-implement` | `@specify plan`, `@implement`              |
| Cleanup          | Manual                                      | Automated Completion Protocol              |
| Documentation    | Not included                                | Documentation Impact Assessment            |

> 📖 **Reference:** [Structured Autonomy Collection][structured-autonomy] in awesome-copilot

## Key Resources

| Resource                                              | Purpose                                            |
| ----------------------------------------------------- | -------------------------------------------------- |
| [CUSTOM_INSTRUCTIONS.md][custom-instructions]         | How to structure and compose instructions at scale |
| [CUSTOM_AGENTS.md][custom-agents]                     | How to define focused agents with targeted skills  |
| [MCP.md][mcp]                                         | How to integrate external tools efficiently        |
| [Structured Autonomy][structured-autonomy]            | Original three-phase workflow from awesome-copilot |
| [Context Engineering Collection][context-engineering] | Context optimization tools from awesome-copilot    |
| [VS Code Subagents][vscode-subagents]                 | Official subagent documentation                    |

---

<!-- Related Documentation -->

[custom-agents]: ./CUSTOM_AGENTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[mcp]: ./MCP.md
[prompt-optimization]: https://docs.anthropic.com/claude/reference/prompt-optimization
[vscode-subagents]: https://code.visualstudio.com/docs/copilot/agents/subagents
[structured-autonomy]: https://github.com/github/awesome-copilot/blob/main/collections/structured-autonomy.md
[context-engineering]: https://github.com/github/awesome-copilot/blob/main/collections/context-engineering.md
[awesome-copilot]: https://github.com/github/awesome-copilot
