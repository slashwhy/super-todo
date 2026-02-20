# 🎓 AI Skill Levels & Training

> **Adapting AI-assisted development to different skill levels — from learning accelerator for juniors to fleet manager for seniors.**

**Audience:** Team leads, developers at all levels | **Prerequisites:** [AI Development Guide][ai-guide]

## The Challenge

AI code generation creates a **cognitive crisis**: developers can produce working code without understanding it. This leads to the **Illusion of Competence** — the gap between _producing_ code and _comprehending_ it widens as AI handles more of the implementation work.

### The Neuroscience: Retrieval Practice vs Passive Review

From a cognitive science perspective, deep retention is forged through **Retrieval Practice** — the active effort of pulling information from memory and reconstructing solutions. By contrast, AI-assisted coding often results in **Passive Review**, a low-cognitive-load activity where developers read and approve solutions they didn't produce. Passive review creates "fragile memories" — the developer recognizes a solution when they see it, but cannot reproduce or adapt it independently.

This is why our training agents enforce **desirable difficulty**: `@socratic-mentor` deliberately withholds direct answers, forcing developers to retrieve knowledge actively rather than passively consuming AI output.

### The Risks

| Risk                          | Description                                                    | Impact                                              |
| ----------------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| **Vibe Coding**               | Accepting AI output without review or understanding            | Bugs compound, technical debt grows silently        |
| **Rubber-Stamping**           | Approving AI suggestions without critical evaluation           | Security vulnerabilities, convention violations     |
| **Skill Atrophy**             | Over-reliance on AI erodes fundamental engineering skills      | Inability to debug, architect, or reason about code |
| **God Service Trap**          | Letting AI create monolithic solutions instead of modular ones | Unmaintainable architecture, tight coupling         |
| **Hallucinated Dependencies** | AI invents APIs, packages, or patterns that don't exist        | Runtime failures, wasted debugging time             |

The solution is not _less_ AI — it's **structured AI usage** that matches the developer's skill level.

## The Seniority Competency Matrix

Different skill levels need different relationships with AI tools. This matrix maps each level to their ideal agent workflow.

### Traditional vs AI-Augmented Engineering

| Dimension | Traditional View | AI-Augmented View | Accountability Horizon |
|-----------|-----------------|-------------------|------------------------|
| **Technical Execution** | Writing clean code manually | Verifying AI output; defining specs and plans | Hours to Days |
| **Knowledge Base** | Syntax & API memorization | System architecture; AI failure modes | Weeks to Months |
| **Debugging** | Manual step-by-step tracing | Analyzing agent logs; hypothesis-first testing | Months to Years |
| **Mentorship** | Pair programming with humans | Curating AI knowledge; teaching "AI Skepticism" | Infinite (Legacy) |

### Junior: Learning Accelerator

| Aspect             | Approach                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| **Goal**           | Build foundational understanding through productive friction            |
| **AI Role**        | Tutor and explainer, not code generator                                 |
| **Primary Agents** | `@Onboarding` → `@socratic-mentor` → `@Specify`                         |
| **Key Practice**   | Prediction-first: always hypothesize before asking AI                   |
| **Risk**           | Accepting code without understanding → address with comprehension gates |

**Recommended workflow:**

1. Start with `@Onboarding` to understand project structure and conventions
2. Use `@socratic-mentor` to build mental models of patterns and concepts
3. Use `@Specify` to learn structured planning (input: what you learned)
4. Review `@Implement` output carefully — explain each change to yourself
5. Write tests with `@Test Unit` — understand what each assertion validates

### Mid-Level: Operator

| Aspect             | Approach                                                      |
| ------------------ | ------------------------------------------------------------- |
| **Goal**           | Increase velocity while maintaining quality                   |
| **AI Role**        | Productivity multiplier with human oversight                  |
| **Primary Agents** | `@Specify` → `@Implement` → `@Test Unit` / `@Test E2E`        |
| **Key Practice**   | Spec-before-code: always plan before implementing             |
| **Risk**           | Skipping review under time pressure → address with checklists |

**Recommended workflow:**

1. Use `@Specify` for planning — review the generated plan critically
2. Use `@Implement` for execution — verify each step against the plan
3. Use `@Test Unit` / `@Test E2E` for coverage — understand the test strategy
4. Return to `@socratic-mentor` when encountering unfamiliar patterns

### Senior: Orchestrator / Fleet Manager

| Aspect             | Approach                                                                    |
| ------------------ | --------------------------------------------------------------------------- |
| **Goal**           | Maximize team output through strategic AI orchestration                     |
| **AI Role**        | Autonomous executor within well-defined boundaries                          |
| **Primary Agents** | All agents, including background and cloud agents                           |
| **Key Practice**   | Architecture-first: ensure AI works within sound design                     |
| **Risk**           | Over-delegation without architectural oversight → address with review gates |

**Recommended workflow:**

1. Design architecture and conventions first (these constrain AI output)
2. Use `@Specify` for complex features — delegate simpler plans to mid-levels
3. Review `@Implement` output for architectural concerns (not syntax)
4. Use `@socratic-mentor` to mentor juniors through code review discussions
5. Focus on instruction and skill file quality — these are your leverage points

## Dos and Don'ts

### For All Levels

| ✅ Do                                                    | ❌ Don't                              |
| -------------------------------------------------------- | ------------------------------------- |
| Review all AI-generated code before committing           | Accept AI output without reading it   |
| Understand _why_ code works, not just _that_ it works    | Rubber-stamp suggestions to save time |
| Use `@Specify` before `@Implement` (spec-before-code)    | Jump straight to implementation       |
| Run the full test suite before merging                   | Assume AI-generated code is bug-free  |
| Reference project conventions in `.github/instructions/` | Ignore project conventions            |

### For Juniors

| ✅ Do                                                  | ❌ Don't                                                  |
| ------------------------------------------------------ | --------------------------------------------------------- |
| Start with `@Onboarding` and `@socratic-mentor`        | Start with `@Implement` before understanding the codebase |
| State your hypothesis before asking for debugging help | Ask "fix this" without thinking about the cause           |
| Explain AI-generated code to yourself or a peer        | Copy-paste AI output without understanding it             |
| Ask `@socratic-mentor` about unfamiliar patterns       | Pretend to understand something you don't                 |
| Track what you learn in notes                          | Treat AI as a shortcut to avoid learning                  |

### For Seniors

| ✅ Do                                                | ❌ Don't                                                |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Invest in instruction and skill file quality         | Ignore the AI customization system                      |
| Use `@socratic-mentor` when mentoring juniors        | Do all code reviews manually when AI can surface issues |
| Design architecture before delegating to AI          | Let AI make architectural decisions                     |
| Review AI output for security and design concerns    | Only review for syntax correctness                      |
| Calibrate agent constraints based on team experience | Grant maximum autonomy without safeguards               |

## The Training Agent Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Training Agents (Read-Only)                   │
│                                                                  │
│  @Onboarding ──── Project tour, conventions, first task guide    │
│       │                                                          │
│       ▼                                                          │
│  @socratic-mentor ── Concept exploration, Socratic questioning   │
│       │                                                          │
│       ▼ (comprehension validated)                                │
├─────────────────────────────────────────────────────────────────┤
│                   Production Agents                              │
│                                                                  │
│  @Specify ──── Plan features, validate implementations           │
│       │                                                          │
│       ▼                                                          │
│  @Implement ── Build from plan, follow conventions               │
│       │                                                          │
│       ▼                                                          │
│  @Test Unit / @Test E2E ── Verify correctness                    │
│       │                                                          │
│       ▼                                                          │
│  @Specify (Validate) ── Ready for merge                          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Differences: Training vs Production Agents

| Aspect              | Training Agents                           | Production Agents                                           |
| ------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| **Purpose**         | Build understanding                       | Build software                                              |
| **Tools**           | Read-only (no `edit`, no `execute`)       | Role-dependent: read-only or edit/execute based on agent    |
| **Output**          | Explanations, questions, guidance         | Code, tests, plans, validations, reviews                    |
| **Code generation** | Never                                     | Role-dependent: core for builder agents; unused by validators |
| **When to use**     | Learning, onboarding, concept exploration | Planning, implementing, testing, validating, reviewing      |

## Agent Reference

### @Onboarding

**Role:** Project orientation guide for newcomers.

**When to use:**

- First day on the project
- Exploring an unfamiliar part of the codebase
- Understanding project conventions and tooling

**Example:**

```
@onboarding I'm new to this project. Show me around.
@onboarding How does the CSS variable system work here?
@onboarding I want to start contributing — what should I work on?
```

### @socratic-mentor

**Role:** Pedagogical tutor using Socratic questioning.

**When to use:**

- Learning a new concept or pattern
- Debugging with the goal of understanding (not just fixing)
- Preparing to work with unfamiliar technology
- Code review discussions with juniors

**Example:**

```
@socratic-mentor How do Pinia stores work in this project?
@socratic-mentor My API route returns 500 — help me understand why.
@socratic-mentor Why do we use field whitelisting in route handlers?
```

## Human-AI Pair Programming Modes

When working with `@Implement`, developers operate in one of two modes:

| Mode | Human Role | AI Role | Best For |
|------|-----------|---------|----------|
| **Mode A: AI Navigator** | Types the code | Critiques logic, suggests architecture, reviews without providing syntax | Learning, building deep understanding |
| **Mode B: AI Driver** | Steers via prompts and reviews | Generates code from specs and plans | Velocity on well-specified tasks |

**Guidance by seniority:**
- **Juniors** should primarily use **Mode A** — type code themselves while AI suggests improvements. This builds muscle memory and retrieval practice.
- **Mid-levels** alternate between modes based on task familiarity.
- **Seniors** primarily use **Mode B** for implementation, reserving their energy for architectural review and specification quality.

All modes follow the **Plan-Act-Verify** loop: the AI provides a plan, the human approves, the AI acts, and the human verifies.

## Atomic PRs and AI-Generated Code Reviews

When working with AI-generated code, enforce these review practices:

- **Atomic PRs:** Keep pull requests small and focused on a single concern. AI can generate large amounts of code quickly — resist the temptation to bundle everything into one PR.
- **Natural Language Summary:** Every PR with AI-generated code should include a summary the author can explain and defend orally. If you can't explain what changed and why, the PR isn't ready.
- **Hallucination Check:** Before merging, verify that all imported packages exist, have sufficient downloads, and are actively maintained. See the [security-review skill](../.github/skills/security-review/SKILL.md) for the AI-ism detection checklist.

## Core Concepts

### Cognitive Forcing Functions (CFFs)

CFFs are deliberate friction points that prevent autopilot behavior:

| CFF                       | Description                                      | Implementation                                         |
| ------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **Prediction-First Gate** | Must hypothesize before debugging                | `@socratic-mentor` requires hypothesis before analysis |
| **Comprehension Gate**    | Must demonstrate understanding before proceeding | `@socratic-mentor` validates before handoff            |
| **Spec-Before-Code**      | Must plan before implementing                    | `@Specify` creates plan before `@Implement` starts     |
| **Review Gate**           | Must review before merging                       | Handoffs require human approval                        |
| **Why Obligation**        | Must explain _why_, not just _what_              | `@socratic-mentor` contrasts alternatives              |

### Plan-Act-Verify Cycle

Every feature follows this cycle:

1. **Plan** (`@Specify`) — Define what to build, resolve questions
2. **Act** (`@Implement`) — Build according to plan
3. **Verify** (`@Test Unit` / `@Test E2E` / `@Specify` validate) — Confirm correctness

This cycle enforces discipline at every level — juniors learn the rhythm, seniors enforce it.

### Ghost Text Policy

AI-generated inline suggestions (ghost text) should be treated with the same scrutiny as any other code:

- **Read** the suggestion completely before accepting
- **Understand** what it does and why
- **Verify** it follows project conventions
- **Reject** if you can't explain it

**For juniors:** Teams may choose to **disable ghost text entirely** during onboarding to enforce original thought and prevent the "Tab-Complete Zombie" pattern. This is a team-level decision — the key principle is that juniors must produce their own reasoning before seeing AI suggestions.

### SDD Maturity Model (Specification-Driven Development)

| Level                   | Description                                         | Agent Usage                           |
| ----------------------- | --------------------------------------------------- | ------------------------------------- |
| **Level 1: Ad-hoc**     | No specs, direct implementation                     | Only `@Implement`                     |
| **Level 2: Reactive**   | Specs written after implementation                  | `@Implement` then `@Specify` validate |
| **Level 3: Proactive**  | Specs written before implementation                 | `@Specify` → `@Implement`             |
| **Level 4: Integrated** | Specs drive all development, continuously validated | Full agent workflow with gates        |

## AI-Native Metrics

Track these metrics to measure the health of AI-assisted development:

| Metric                        | What It Measures                              | Target               | Warning Sign                                  |
| ----------------------------- | --------------------------------------------- | -------------------- | --------------------------------------------- |
| **Acceptance Rate**           | % of AI suggestions accepted                  | 30-60%               | >80% (rubber-stamping) or <10% (not using AI) |
| **MTTV** (Mean Time to Value) | Time from spec to working feature             | Decreasing over time | Increasing despite AI usage                   |
| **Defect Capture Rate**       | % of bugs caught before merge                 | >90%                 | Dropping after AI adoption                    |
| **Interaction Churn**         | Revisions needed per AI interaction           | <3 per task          | Increasing (poor prompting or conventions)    |
| **Comprehension Score**       | Developer's ability to explain AI output      | Self-assessed 4-5/5  | <3 (illusion of competence)                   |
| **Seniority Paradox Delta**   | Gap between junior velocity and understanding | Small                | Large gap = vibe coding risk                  |

### How to Use These Metrics

- **Team retrospectives:** Review acceptance rate and defect capture rate monthly
- **1-on-1s:** Discuss comprehension scores and learning progress
- **Process improvement:** Track MTTV and interaction churn to identify bottleneck conventions or skills
- **Risk assessment:** Monitor seniority paradox delta for juniors

## Implementation Roadmap

> **Note:** This is a sample roadmap for teams adopting skill-level-aware AI development. Adapt to your team's needs.

### Phase 1: Foundation (Weeks 1-4)

- [ ] All developers complete `@Onboarding` tour
- [ ] Juniors paired with `@socratic-mentor` for first tasks
- [ ] Establish baseline metrics (acceptance rate, defect capture rate)
- [ ] Team agreement on spec-before-code workflow

### Phase 2: Practice (Weeks 5-8)

- [ ] Full agent workflow in use: `@Specify` → `@Implement` → `@Test`
- [ ] Juniors using prediction-first gate consistently
- [ ] Mid-levels writing specs independently
- [ ] Seniors refining instruction and skill files based on team patterns

### Phase 3: Optimization (Weeks 9-12)

- [ ] Measure and review AI-native metrics
- [ ] Identify and address skill gaps with targeted `@socratic-mentor` sessions
- [ ] Optimize agent workflows based on team feedback
- [ ] Document team-specific conventions in instruction files

## Related

- [AI Development Guide][ai-guide] — Overview of the multi-agent system
- [Custom Agents][custom-agents] — Agent definitions and configurations
- [Developer Responsibilities][responsibilities] — Accountability and review practices
- [Security Guide][security] — Security constraints and AI risks
- [Context Optimization][context-optimization] — Plan-based handoff and context management

<!-- Links -->

[ai-guide]: ./AI_DEVELOPMENT_GUIDE.md
[custom-agents]: ./CUSTOM_AGENTS.md
[responsibilities]: ./RESPONSIBILITIES.md
[security]: ./SECURITY.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md
