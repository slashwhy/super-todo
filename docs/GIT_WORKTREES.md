# 🎓 Git Worktrees for Parallel AI Development

> Run multiple AI agents simultaneously without context pollution.

**Audience:** Advanced users scaling AI development | **Prerequisites:** [Custom Agents][custom-agents], Git fundamentals


## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `git worktree add .trees/feature-auth -b feature/auth` | Create isolated worktree |
| `git worktree list` | Show all worktrees |
| `git worktree remove .trees/feature-auth` | Clean up worktree |

> 💡 **Setup:** Add `.trees/` to your `.gitignore` to keep worktrees local and out of version control.

**⚡ Quick Start:** Create a worktree, install dependencies, and open VS Code in one command:

```bash
echo '.trees/' >> .gitignore && git worktree add .trees/feature-new -b feature/new && cd .trees/feature-new && npm install && code .
```


## 🎯 What & Why

When multiple AI agents work in the same repository, their changes interfere:

```
Agent A: Installs dependency X
Agent B: Runs tests → Fails (unexpected dependency)
Agent C: Modifies shared file → Conflicts with Agent A
```

**Git worktrees** solve this by creating **isolated directories** for each agent, all linked to the same repository.


## 🔧 How It Works

```
todo_app/                        ← Main worktree (your primary work)
      │
      ├── .git/                  ← Shared repository
      ├── .gitignore             ← Contains ".trees/"
      ├── (all project files)
      │
      └── .trees/                ← Local worktree folder (gitignored)
            ├── feature-auth/    ← Agent A worktree
            └── feature-dashboard/ ← Agent B worktree
```

**Key insight:** All worktrees share the same `.git` history, but each has its own:
- Working directory
- Dependencies (`node_modules`)
- Test state
- File modifications


## 🛠️ Setting Up Worktrees

### First-Time Setup

```bash
# Add .trees to gitignore (one-time)
echo '.trees/' >> .gitignore
git add .gitignore && git commit -m "chore: add .trees to gitignore"
```

### Create a Worktree

```bash
# From your main repository
cd todo_app

# Create worktree for a new feature branch
git worktree add .trees/feature-auth -b feature/auth

# Or for an existing branch
git worktree add .trees/bug-fix fix/bug-123
```

### List Active Worktrees

```bash
git worktree list
# /Users/dev/todo_app                     abc1234 [main]
# /Users/dev/todo_app/.trees/feature-auth def5678 [feature/auth]
# /Users/dev/todo_app/.trees/dashboard    ghi9012 [feature/dashboard]
```

### Clean Up

```bash
# Remove a worktree (keeps the branch)
git worktree remove .trees/feature-auth

# Force remove if there are uncommitted changes
git worktree remove --force .trees/feature-auth

# Prune stale worktree references
git worktree prune
```


## 🔄 Parallel Agent Workflow

### Scenario: Three Features in Parallel

```bash
# Terminal 1: Main development
cd todo_app
# Work normally here

# Terminal 2: Agent working on auth
cd .trees/feature-auth
npm install
# Open in VS Code, use @Implement agent

# Terminal 3: Agent working on dashboard
cd .trees/dashboard
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

> 💡 **Tip:** Use [@Implement][agent-implement] for feature work and [@Test Unit][agent-test-unit] for testing in separate worktrees. See [Custom Prompts][custom-prompts] for ready-to-use task templates.


## ✅ Benefits & When to Use

| Benefit | How Worktrees Help | Use Case |
|---------|-------------------|----------|
| **Isolation** | Each agent's file changes stay separate | Multiple independent features |
| **Parallel execution** | Run multiple agents simultaneously | Long-running agent tasks |
| **Risk management** | Failed experiments deleted without affecting main | Experimental/risky changes |
| **Clean context** | Each agent sees only its branch's state | Complex refactoring |
| **Efficient** | Single `.git` folder, shared history | Large codebase work |

> ⚠️ **Skip worktrees for:** Quick bug fixes (overkill) or single-feature focus (not needed).


## 📝 Best Practices

| ✅ Do This | ⚠️ Avoid This |
|------------|---------------|
| Create dedicated worktree per major feature | Multiple agents in the same directory |
| Run `npm install` in each worktree | Assuming dependencies are shared |
| Clean up worktrees after PR merge | Letting worktrees accumulate |
| Keep worktrees in `.trees/` folder | Cluttering parent directory with worktrees |
| Open each worktree in separate VS Code window | Mixing uncommitted changes across agents |

**Isolated Agent Work Example:**

```bash
# Create dedicated worktree per major feature
git worktree add .trees/big-feature -b feature/big-feature
cd .trees/big-feature
npm install

# Open in separate VS Code window
code .

# Agent works here, completely isolated
```

**Clean Up After Merge:**

```bash
# After PR is merged
git worktree remove .trees/big-feature
git branch -d feature/big-feature
```


## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Branch already checked out"** | Each branch can only be in one worktree. Create a new branch: `git worktree add .trees/auth-v2 -b feature/auth-v2` |
| **Dependencies not working** | Each worktree needs its own `node_modules`. Run `npm install` in the worktree directory. |
| **VS Code not recognizing worktree** | Open as separate workspace: `code .trees/feature-name` or use multi-root: `code --add .trees/feature-name` |
| **Worktrees showing in git status** | Add `.trees/` to your `.gitignore` file. |


## 🔗 Related

- [Custom Agents][custom-agents] – Agent definitions ([@Implement][agent-implement], [@Test Unit][agent-test-unit], [@Test E2E][agent-test-e2e])
- [Custom Prompts][custom-prompts] – Ready-to-use task templates
- [Developer Responsibilities][responsibilities] – Review process for agent work

<!-- Project Documentation -->
[custom-agents]: ./CUSTOM_AGENTS.md
[custom-prompts]: ./CUSTOM_PROMPTS.md
[responsibilities]: ./RESPONSIBILITIES.md

<!-- Agent Files -->
[agent-implement]: ../.github/agents/implement.agent.md
[agent-test-unit]: ../.github/agents/test-unit.agent.md
[agent-test-e2e]: ../.github/agents/test-e2e.agent.md

<!-- External Resources -->
[git-worktree-docs]: https://git-scm.com/docs/git-worktree
