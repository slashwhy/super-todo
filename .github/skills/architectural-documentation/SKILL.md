---
name: architectural-documentation
description: 'Implementation plans, README updates, and architectural decisions. Use when planning features or documenting high-level changes.'
---

# Architectural Documentation Skill

## Quick Reference

### Implementation Plan Template

```markdown
# [Feature Name]

**Ticket:** JIRA-123

## User Story
As a [user], I want [capability] so that [outcome]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Implementation Steps

**Step 1: [Backend/Frontend/Database]**
- Files: `path/to/file.ts`
- What to build: [Description]
- Tests: [What to test]

**Step 2: ...**

## Open Questions
- [ ] Question that needs answer before proceeding
```

### ADR Template (Optional)

```markdown
# ADR-[#]: [Decision]

**Date:** YYYY-MM-DD  
**Status:** Accepted | Superseded

## Context
[What problem are we solving?]

## Decision
We will use [technology/pattern] because [main reason].

## Consequences
**Pros:** [Benefits]  
**Cons:** [Tradeoffs]
```

### README Updates

**Update when:**
- New features added
- Setup steps change
- New scripts/commands
- API changes

**Key sections:**
```markdown
## Getting Started
[Installation steps]

## Scripts
| Command | Description |

## API Endpoints  
- `GET /api/resource` - Description
```

## Summary

**Keep it simple:**
- Implementation plans guide development
- README stays current with changes
- ADRs document major decisions (optional)
- Update docs in same PR as code
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID

## Testing

```bash
npm run test              # Frontend unit tests
cd backend && npm run test # Backend tests
npm run test:e2e          # E2E tests
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
```

---

### 4. API Documentation

**Format for documenting REST endpoints:**

```markdown
# API Documentation

Base URL: `http://localhost:3000/api`

## Tasks

### List Tasks

**Endpoint:** `GET /api/tasks`

**Description:** Retrieves all tasks with optional filters

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statusId` | string | No | Filter by status ID |
| `priorityId` | string | No | Filter by priority ID |
| `isVital` | boolean | No | Show only vital tasks |
| `ownerId` | string | No | Filter by task owner |

**Example Request:**
```bash
curl http://localhost:3000/api/tasks?isVital=true&statusId=in-progress
```

**Example Response (200 OK):**
```json
[
  {
    "id": "task-1",
    "title": "Complete documentation",
    "isVital": true,
    "status": {
      "id": "in-progress",
      "name": "In Progress",
      "color": "#FFB800"
    }
  }
]
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Invalid query parameters |
| 500 | Server error |

---

### Create Task

**Endpoint:** `POST /api/tasks`

**Description:** Creates a new task

**Request Body:**
```typescript
{
  title: string          // Required, max 255 chars
  description?: string   // Optional
  isVital?: boolean      // Optional, defaults to false
  statusId: string       // Required
  priorityId: string     // Required
  categoryId?: string    // Optional
  ownerId: string        // Required
  assigneeId?: string    // Optional
  dueDate?: string       // Optional, ISO date string
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New task",
    "statusId": "not-started",
    "priorityId": "medium",
    "ownerId": "user-1"
  }'
```

**Success Response (201 Created):**
```json
{
  "id": "new-task-id",
  "title": "New task",
  "status": { ... },
  "priority": { ... },
  "owner": { ... }
}
```

**Error Responses:**

| Status | Description | Example |
|--------|-------------|---------|
| 400 | Validation error | Missing required field |
| 404 | Related entity not found | Invalid statusId |
| 500 | Server error | Database connection failed |
```

---

### 5. Migration Guides

**Use when introducing breaking changes:**

```markdown
# Migration Guide: v1.0 to v2.0

## Overview

Version 2.0 introduces breaking changes to the task management API and state management structure. This guide will help you upgrade your codebase.

## Breaking Changes

### 1. Task Status Field Renamed

**What Changed:**
- `status` field renamed to `statusId`
- Status is now a relation instead of string literal

**Before (v1.0):**
```typescript
const task = {
  status: 'in-progress'
}
```

**After (v2.0):**
```typescript
const task = {
  statusId: 'status-uuid',
  status: {
    id: 'status-uuid',
    name: 'In Progress',
    color: '#FFB800'
  }
}
```

**Migration Steps:**
1. Update all API calls to use `statusId`
2. Update database queries to include status relation
3. Update TypeScript types

### 2. Pinia Store API Changed

**What Changed:**
- Options API stores converted to Setup Stores
- Action names standardized to use `fetch` prefix

**Before (v1.0):**
```typescript
tasksStore.getTasks()
```

**After (v2.0):**
```typescript
await tasksStore.fetchTasks()
```

**Migration Steps:**
1. Replace `getTasks()` with `fetchTasks()`
2. Replace `updateTask()` with `updateTask()`
3. Add `await` for async actions

## Non-Breaking Changes

### New Features
- ✨ Vital task prioritization
- ✨ Task categories
- ✨ User assignments

## Upgrade Checklist

- [ ] Update API client to use new status field
- [ ] Update Pinia store calls
- [ ] Run TypeScript compiler to find type errors
- [ ] Update tests
- [ ] Run full test suite
- [ ] Update environment variables if needed

## Rollback Plan

If issues occur, you can rollback to v1.0:

```bash
git checkout v1.0.0
npm install
npm run db:migrate
```

## Support

For questions, see [GitHub Issues](https://github.com/org/repo/issues)

---

## Best Practices

### Documentation Maintenance

**DO:**
- ✅ Update docs in the same PR as code changes
- ✅ Keep examples up-to-date and tested
- ✅ Use consistent formatting and terminology
- ✅ Include "last updated" dates for time-sensitive docs
- ✅ Link between related documentation
- ✅ Provide migration paths for breaking changes

**DON'T:**
- ❌ Document features that don't exist yet
- ❌ Leave outdated examples in documentation
- ❌ Forget to update README when adding features
- ❌ Use vague or ambiguous language
- ❌ Duplicate content across multiple files (link instead)

### Writing Style

- Use present tense ("Returns user data" not "Will return user data")
- Be concise but complete
- Use code examples liberally
- Structure with headings for scanability
- Include both basic and advanced examples

## Quality Checklist

Before finalizing architectural documentation:

- [ ] Purpose and scope clearly stated
- [ ] All code examples are accurate and tested
- [ ] Links to related docs are valid
- [ ] Screenshots/diagrams are up-to-date
- [ ] Acceptance criteria are measurable
- [ ] Technical approach addresses all requirements
- [ ] Risks and mitigations identified
- [ ] Definition of done is clear

## Related Skills

For comprehensive documentation coverage, also consult:

- **code-documentation** - For TSDoc, inline comments, and component docs
- **vue-components** - For component structure patterns
- **backend-routes** - For Express route handler patterns
- **prisma-database** - For schema design patterns

## Summary

Architectural documentation serves multiple audiences:

- **Developers** need implementation plans and technical details
- **Stakeholders** need high-level summaries and outcomes
- **Future maintainers** need context for decisions made

Keep documentation:
1. **Accurate** - Update with code changes
2. **Accessible** - Easy to find and navigate
3. **Actionable** - Provide clear next steps
4. **Current** - Remove or archive outdated docs
