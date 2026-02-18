# AI-Native Junior Developer Training

> A guide to building sovereign AI-orchestrators, not passive AI operators.

**Audience:** Tech leads, senior engineers, engineering managers | **Prerequisites:** [Custom Agents][custom-agents] · [Custom Instructions][custom-instructions]

## The Problem: Illusion of Competence

Large Language Models have created a dangerous decoupling in software engineering: **code production is now independent of code understanding**. A junior developer can ship five features a week while building no mental models of how they interact. This is the *Illusion of Competence*.

The evidence arrives at the worst moment: a production incident at 3am. The developer who delivered the feature cannot debug it, because they never truly understood it. They selected from AI suggestions — they did not design.

The long-term consequence is a **Senior Engineer Supply Shock**: as automation removes the lower rungs of the career ladder, no new architects are climbing it. In 5–10 years, firms that did not actively manage this transition will find themselves without the senior talent needed to steer increasingly powerful AI systems.

This playbook responds with a structured approach using the tools already in this project: Copilot custom agents, instructions, and skills configured to enforce **productive friction** — the deliberate cognitive effort that actually builds capability.

---

## Core Concept: Artificial Friction

The smooth path of AI-assisted development is pedagogically dangerous. When a junior accepts a suggestion without forming a mental model, no learning occurs. The solution is not to remove AI — it is to interrupt the smooth path with deliberate **Cognitive Forcing Functions (CFFs)**: moments that push thinking from fast, intuitive System-1 mode into slow, analytical System-2 mode.

This project implements CFFs through the agent workflow. Every agent handoff is a checkpoint that requires real cognitive work from the junior.

---

## The Junior Developer Agent Workflow

```
[Concept Gap]                    [Feature Request]
      │                                 │
      ▼                                 ▼
@Socratic-Mentor            @Spec-First
(Build mental model)        (Write spec → save to .ai/plans/)
      │                                 │
      │                                 ▼
      │                          @Implement
      │                    (Read spec → build → mark steps)
      │                                 │
      │                                 ▼
      └──────────────────►  @Code-Review-Trainer
                            (AutoMCQ: 3 comprehension questions)
                                         │
                          ┌──────────────┴──────────────┐
                          ▼                             ▼
                      [PASS]                        [FAIL]
                   @Test-Unit                  @Socratic-Mentor
                  @Test-E2E                  (close the gap)
```

Each arrow is a **human checkpoint**. The junior reviews before the next agent begins.

---

## The Four Training Agents

### @Socratic-Mentor — Concept Builder

**Role:** Pedagogical tutor that refuses to provide direct code answers.

**Key Behaviors:**
- **No-Code Default:** Every question "How do I do X?" is answered with a concept question, not code
- **Warum-Pflicht:** Every explanation must contrast against ≥1 alternative
- **Error Analysis Protocol:** "Which line in the stack trace points to the root cause?" before any hint
- **Prediction-First Gate:** Junior must articulate a hypothesis before any debugging discussion

**When to invoke:** Whenever a junior does not understand a concept before writing code — or cannot explain code they have already written.

**Example trigger:** `@socratic-mentor I don't understand why my Vue component re-renders on every keystroke`

---

### @Spec-First — Specification Gate

**Role:** Enforces architectural thinking before implementation. Blocks `@Implement` until a complete, quality spec exists.

**Required Spec Sections:**
1. User Story with clear business value
2. Acceptance Criteria in [EARS notation](#ears-notation-reference) (min. 3)
3. Pseudocode Plan in plain English (no syntax)
4. Edge Cases and failure hypotheses (min. 2)
5. Documentation Impact Assessment

**On approval:** Spec saved to `.ai/plans/{issue-name}/spec.md` (gitignored). Junior then opens a new chat and invokes `@Implement` with the spec file path.

**When to invoke:** When a junior has understood the concept and is ready to build.

**Example trigger:** `@spec-first I want to add priority filtering to the task list`

---

### @Code-Review-Trainer — AutoMCQ Gate

**Role:** Comprehension checkpoint after implementation. Generates 3 questions the junior must answer correctly before merging.

**Three Question Types (always in this order):**

| # | Type | Tests |
|---|------|-------|
| Q1 | Logic-Check | Understanding of intentional design decisions |
| Q2 | Side-Effects | Impact beyond the immediate function/component |
| Q3 | Error-Handling | Failure mode propagation to user-visible outcomes |

**Pass:** Hand off to `@Test-Unit`.  
**Fail:** Route to `@Socratic-Mentor` with the specific gap identified.

**When to invoke:** After implementation is complete, before writing tests.

**Example trigger:** `@code-review-trainer Check my understanding of the task update endpoint I just wrote`

---

### @Bebugging — Review Muscle Trainer

**Role:** Injects 2–3 subtle, realistic bugs into a sandboxed copy of a file. Junior finds them via careful review — no running the code.

**Safety Constraints:**
- Never modifies production files
- Creates copies in `src/__bebugging__/` only, with explicit user confirmation
- Deletes the sandbox after the debrief
- Always reveals all bugs at the end, including unfound ones

**Bug Types Injected:** Off-by-one errors, missing `await`, wrong comparison operators, over-permissive CORS, missing field whitelisting, hallucinated packages.

**What it builds:** The critical review habit needed to safely consume AI-generated code at scale.

**When to invoke:** Periodically (weekly sprint reviews, onboarding milestones) to maintain audit skills.

**Example trigger:** `@bebugging Use tasks.ts as the training file`

---

## The Plan-Act-Verify Protocol

Every implementation task must follow this 3-phase cycle. No phase may be skipped.

### PLAN — Architecture Before Syntax

Before AI generates any code:
- Junior writes pseudocode in plain English
- Edge cases documented as hypotheses
- `@Spec-First` approves and saves the formal spec

**CFF:** Junior must explicitly sign off on the plan. The spec file is the contract.

### ACT — Observe, Don't Auto-Pilot

While `@Implement` generates:
- Junior reads every line as it appears
- Generation stops if something looks wrong
- Junior must be able to explain any block before requesting more

**CFF:** "I'll review it at the end" is not acceptable. The review is continuous.

### VERIFY — Hypothesis Before Fix

When something fails:
- Junior forms a hypothesis: "I think the problem is X because Y"
- Hypothesis stated in chat before any AI assistance
- "Auto-Fix" button is off-limits — explain the intended change

**CFF:** If the junior cannot form a hypothesis, route to `@Socratic-Mentor`.

---

## Ghost Text Policy

**Inline autocomplete (Ghost Text) should be disabled for junior developers during active implementation.**

Concurrent suggestion presentation prevents mental model formation. When code appears before the thought completes, the junior learns to *select* rather than to *architect*.

**Disable in VS Code:** `Settings → Editor: Inline Suggest Enabled → false`

**Re-enable for:** Boilerplate completion, repetitive patterns the junior fully understands, after the logical skeleton is fully written.

---

## SDD Maturity Model

Junior developer progression is measured by their Spec-Driven Development maturity:

| Level | Description | Evidence | Agent Support |
|-------|-------------|----------|---------------|
| **Spec-Aware** | Consumes existing specs | Can implement against detailed AC | `@Socratic-Mentor` builds foundations |
| **Spec-Led** | Writes specs before coding | Drafts EARS AC independently | `@Spec-First` validates quality |
| **Spec-as-Source** | Spec is ground truth; code is derived | Regenerates code on spec change | `@Implement` is purely mechanical |

The goal for all juniors is to reach **Spec-Led** within 8 weeks, and to demonstrate **Spec-as-Source** thinking on larger features within 3 months.

---

## AI-Native Metrics

Traditional metrics are insufficient in the AI era. Supplement with:

| Traditional Metric | AI-Native Equivalent | What It Reveals |
|-------------------|---------------------|-----------------|
| Velocity / LOC | Spec Quality Score | Can the junior architect in natural language? |
| Bug count | AutoMCQ Pass Rate | Does the junior understand what they shipped? |
| Debugging time | Hypothesis Formation Speed | Does the junior think before they search? |
| Acceptance rate | Refactor Ratio (edit distance) | Is the junior reviewing or rubber-stamping? |

> **Warning signal:** 100% Copilot suggestion acceptance rate from a junior is not a productivity indicator — it is a comprehension risk indicator.

---

## 12-Week Implementation Roadmap

### Phase 1: Pedagogical IDE (Weeks 1–4)

- [ ] Add `@Socratic-Mentor` and `@Spec-First` to team workflows
- [ ] Disable Ghost Text for all junior roles
- [ ] Workshop: "Vibe Coding vs. Engineering" — show the difference with live demos
- [ ] Introduce the Plan-Act-Verify protocol; pair with a senior to practice

### Phase 2: Spec Discipline (Weeks 5–8)

- [ ] All junior features require an approved `.ai/plans/` spec before implementation
- [ ] Seniors conduct "Spec Quality Reviews" — review the spec, not the code
- [ ] Introduce `@Code-Review-Trainer` AutoMCQ as a weekly ritual
- [ ] Measure: track AutoMCQ pass rates and topic breakdown of failures

### Phase 3: Review Muscle (Weeks 9–12)

- [ ] Launch monthly `@Bebugging` sessions — scheduled, not ad-hoc
- [ ] Introduce "Code Reading Clubs": juniors present and explain complex AI-generated modules
- [ ] Add AI-ism checklist (from `junior-mentoring` skill) to PR template
- [ ] Measure: track bebugging find rates by bug type over time

### Phase 4: Mastery & Culture (Week 13+)

- [ ] Juniors run `@Spec-First` reviews for each other's specs
- [ ] Introduce Centaur-team pairings (Mode A: AI Navigator, Mode B: Reverse Pair)
- [ ] Senior engineers assess juniors for SDD maturity level and set progression targets
- [ ] Create internal "AI-ism Hall of Fame" — real bugs found during bebugging sessions

---

## Centaur-Team Pairings

Two pairing modes for advanced teams:

### Mode A: AI Navigator (Junior Steers)

The junior drives development. The AI (via `@Socratic-Mentor`) is silent unless the junior makes a consequential mistake — then it asks a single pointed question about thread safety, scale, or security.

**Goal:** Build independent architectural judgment.

### Mode B: Reverse Pair (AI Steers)

`@Implement` generates code. The junior acts as navigator: reading, questioning, and directing. At the end, the junior must defend every line to a team member. If they cannot explain a line, the pairing is considered incomplete.

**Goal:** Build the critical audit skill needed to safely direct AI agents.

---

## EARS Notation Reference

EARS (Easy Approach to Requirements Syntax) is the required format for all Acceptance Criteria in this project. It makes criteria unambiguous and independently testable.

| Pattern | Format | Use When |
|---------|--------|----------|
| Event-driven | `WHEN [event] THE SYSTEM SHALL [response]` | User actions, API calls |
| State-driven | `WHILE [state] THE SYSTEM SHALL [behavior]` | Background processes |
| Conditional | `IF [condition] THEN THE SYSTEM SHALL [action]` | Error paths, guards |
| Unwanted behavior | `IF [failure] THEN THE SYSTEM SHALL [recovery]` | Error handling |
| Ubiquitous | `THE SYSTEM SHALL [behavior]` | Non-conditional requirements |

**Example (Task Priority Filter):**
```
WHEN the user selects a priority from the filter dropdown,
THE SYSTEM SHALL update the task list to show only tasks matching that priority.

WHEN no priority filter is active,
THE SYSTEM SHALL show all tasks regardless of priority.

IF the API returns an error during filter application,
THEN THE SYSTEM SHALL display an error toast and retain the previous task list.
```

---

## 🔗 Related

- [Custom Agents][custom-agents] – Full agent reference including new junior training agents
- [Custom Instructions][custom-instructions] – Instruction hierarchy and `junior-ai-workflow` instructions
- [Context Optimization][context-optimization] – Plan-based handoff and structured autonomy
- [Security Guide][security] – Security patterns enforced during bebugging and code review

<!-- Project Documentation -->
[custom-agents]: ./CUSTOM_AGENTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md
[security]: ./SECURITY.md
