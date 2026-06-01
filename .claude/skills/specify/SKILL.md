---
name: specify
description: Create a detailed implementation plan from a feature description, Jira ticket ID, or Figma design. Resolves all open questions before handing off to /implement. Saves the plan to PLAN.md.
argument-hint: "plan <description | JIRA-ID>"
disable-model-invocation: true
---

# Specify — Feature Planning Specialist

You create implementation plans from requirements. You define **WHAT to build** — `/implement` determines HOW. This skill is the Claude Code equivalent of the `@Specify & Validate` Copilot agent.

## How to Invoke

```
/specify plan <JIRA-ID or feature description>
/specify validate        # Gap analysis against acceptance criteria
```

## Critical Constraints

- Resolve ALL questions before handing off to `/implement`
- Focus on WHAT (requirements), not HOW (implementation)
- Use the Atlassian MCP server if connected — announce with a note before API calls
- Save the final plan to `PLAN.md` in the repo root (replaces `/memories/session/plan.md`)
- Use an Explore subagent for codebase research to preserve main context

## Workflow

### Step 1: Gather Context

If a Jira ID is given: Fetch ticket → present summary → confirm  
If Figma is mentioned: Get design → present → confirm  
Otherwise: ask clarifying questions to establish the user story and acceptance criteria

### Step 2: Codebase Research (Explore Subagent)

Use an Explore subagent to research the codebase without consuming main context:
- Find existing patterns similar to this feature
- Identify files that will be affected
- Spot relevant instructions and conventions
- Return a structured summary (~1-2K tokens)

### Step 3: Draft the Plan

Generate high-level implementation steps → present for confirmation → ask clarifying questions → resolve all open questions → write `PLAN.md`

### Step 4: Handoff Gate

**Gate Check:** Only write PLAN.md when ALL questions are resolved.

When ready:
```
Plan saved to: PLAN.md

To start implementation:
→ Run /implement (reads PLAN.md automatically)
  or open a new Claude Code session and run /implement
```

## Plan Template

Save to `PLAN.md` in the repo root:

```markdown
# Implementation Plan: [Title]

**Issue:** [JIRA-ID or description]
**Branch:** `{type}/{issue-name}`
**Created:** [date]
**Status:** Draft | Ready for Implementation | In Progress | Completed

## Overview
[1-2 sentences: what gets accomplished and why it matters]

## User Story
As a [user] I want [capability] So that [outcome]

## Acceptance Criteria
| # | Criterion | Testable? | Complexity |
|---|-----------|-----------|------------|

## Sprint Contract
**Done Definition:** [specific observable outcome — not "the code works"]

| Criterion | Test Type | Pass Condition |
|-----------|-----------|----------------|

**Quality Metrics:**
- [ ] No new TypeScript errors (`npm run type-check`)
- [ ] All existing tests still pass
- [ ] CSS variables used, no hardcoded values (if frontend)
- [ ] Fields whitelisted in route handlers (if backend)

## Implementation Steps

### Step 1: [Step Name]
- **What:** [description]
- **Why:** [value]
- **Layer:** Frontend | Backend | Database | Config
- **Files:** [affected files]
- **Testing:** [how to verify this step works]
- [ ] Sub-task 1
- [ ] Sub-task 2

## Data & State Requirements
- [data needed]

## Testing Requirements
- [ ] [test type] for [what]

## Documentation Impact Assessment
- [ ] **Instructions** (`.github/instructions/`): [which files, or "none"]
- [ ] **Skills** (`.github/skills/`): [which skills, or "none"]
- [ ] **Docs** (`docs/`): [which docs, or "none"]
- [ ] **API docs / README**: [what changes, or "none"]
- [ ] **Prisma schema / migrations**: [what changes, or "none"]

## Risks
- ⚠️ [edge cases, dependencies, breaking changes]

## Resolved Decisions
- [x] [Question] → **Decision:** [answer]
```
