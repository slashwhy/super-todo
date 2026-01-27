# 🎓 Git Worktrees for Parallel AI Development

> Run multiple AI agents simultaneously without context pollution.

**Audience:** Advanced users scaling AI development | **Prerequisites:** [Custom Agents](./CUSTOM_AGENTS.md), Git fundamentals

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `git worktree add ../feature-auth -b feature/auth` | Create isolated worktree |
| `git worktree list` | Show all worktrees |
| `git worktree remove ../feature-auth` | Clean up worktree |

---

## What & Why

When multiple AI agents work in the same repository, their changes interfere:

```
Agent A: Installs dependency X
Agent B: Runs tests → Fails (unexpected dependency)
Agent C: Modifies shared file → Conflicts with Agent A
```

**Git worktrees** solve this by creating **isolated directories** for each agent, all linked to the same repository.

---

## How It Works

```
Main Repository (.git)
      │
      ├── todo_app/              ← Main worktree (your primary work)
      │     └── (all files)
      │
      ├── todo_app-auth/         ← Agent A worktree (feature/auth)
      │     └── (isolated copy)
      │
      └── todo_app-dashboard/    ← Agent B worktree (feature/dashboard)
            └── (isolated copy)
```

**Key insight:** All worktrees share the same `.git` history, but each has its own:
- Working directory
- Dependencies (`node_modules`)
- Test state
- File modifications

---

## Setting Up Worktrees

### Create a Worktree

```bash
# From your main repository
cd todo_app

# Create worktree for a new feature branch
git worktree add ../todo_app-auth -b feature/auth

# Or for an existing branch
git worktree add ../todo_app-fix fix/bug-123
```

### List Active Worktrees

```bash
git worktree list
# /Users/dev/todo_app           abc1234 [main]
# /Users/dev/todo_app-auth      def5678 [feature/auth]
# /Users/dev/todo_app-dashboard ghi9012 [feature/dashboard]
```

### Clean Up

```bash
# Remove a worktree (keeps the branch)
git worktree remove ../todo_app-auth

# Force remove if there are uncommitted changes
git worktree remove --force ../todo_app-auth

# Prune stale worktree references
git worktree prune
```

---

## Parallel Agent Workflow

### Scenario: Three Features in Parallel

```bash
# Terminal 1: Main development
cd todo_app
# Work normally here

# Terminal 2: Agent working on auth
cd ../todo_app-auth
npm install
# Open in VS Code, use @Implement agent

# Terminal 3: Agent working on dashboard
cd ../todo_app-dashboard
npm install
# Open in VS Code, use @Implement agent
```

### Orchestration Pattern

```
Developer (Orchestrator)
      │
      ├── Worktree 1: @Implement → feature/auth
      │     "Implement user authentication"
      │
      ├── Worktree 2: @Implement → feature/dashboard
      │     "Build dashboard widgets"
      │
      └── Worktree 3: @Test Unit → tests/api
            "Add API endpoint tests"

Each agent works in isolation.
Developer reviews and merges results.
```

---

## Benefits

| Benefit | How Worktrees Help |
|---------|-------------------|
| **Isolation** | Each agent's file changes stay separate |
| **Parallel execution** | Run multiple agents simultaneously |
| **Risk management** | Failed experiments deleted without affecting main |
| **Clean context** | Each agent sees only its branch's state |
| **Efficient** | Single `.git` folder, shared history |

---

## Patterns

### ✅ Do This: Isolated Agent Work

```bash
# Create dedicated worktree per major feature
git worktree add ../todo_app-feature -b feature/big-feature
cd ../todo_app-feature
npm install

# Open in separate VS Code window
code .

# Agent works here, completely isolated
```

**Why:** Agent can modify files, install dependencies, run tests without affecting other work.

### ⚠️ Avoid This: Multiple Agents Same Directory

```bash
# Both agents in same directory
@Implement "Add auth"  # Modifies src/auth.ts
@Implement "Add dashboard"  # Conflicts with auth changes

# Result: Merge conflicts, confused context
```

**Why:** Agents see each other's uncommitted changes, leading to conflicts and incorrect context.

---

### ✅ Do This: Clean Up After Merge

```bash
# After PR is merged
git worktree remove ../todo_app-feature
git branch -d feature/big-feature
```

**Why:** Prevents worktree sprawl and stale branches.

### ⚠️ Avoid This: Forgotten Worktrees

```bash
# Worktrees accumulating over time
git worktree list
# Shows 15 abandoned worktrees from old features
```

**Why:** Disk space waste, confusion about which is current.

---

## When to Use Worktrees

| Scenario | Use Worktrees? |
|----------|---------------|
| Multiple independent features | ✅ Yes |
| Long-running agent task | ✅ Yes |
| Experimental/risky changes | ✅ Yes |
| Quick bug fix | ❌ No (overkill) |
| Single feature focus | ❌ No (not needed) |

---

## Troubleshooting

### "Branch already checked out"

```bash
# Error: 'feature/auth' is already checked out at '/path/to/worktree'

# Solution: Each branch can only be in one worktree
git worktree add ../new-worktree -b feature/auth-v2
```

### Dependencies Not Installed

```bash
# Each worktree needs its own node_modules
cd ../todo_app-feature
npm install  # Required for each worktree
```

### VS Code Not Recognizing Worktree

```bash
# Open worktree as separate workspace
code ../todo_app-feature

# Or use VS Code multi-root workspace
code --add ../todo_app-feature
```

---

## Related

- [Custom Agents](./CUSTOM_AGENTS.md) – Agent definitions
- [Responsibilities & Security](./RESPONSIBILITIES_AND_SECURITY.md) – Review process for agent work
- [Git Worktree Docs](https://git-scm.com/docs/git-worktree)
