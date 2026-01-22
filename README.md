# 🚀 GitHub Copilot Onboarding Showcase

> **Vue 3 Todo Dashboard** – A sample project designed to demonstrate GitHub Copilot features during developer onboarding sessions.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-yellow?logo=vue.js&logoColor=white)

---

## 📋 Table of Contents

- [About This Project](#-about-this-project)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Backend](./backend/README.md)
- [Showcase: A Day in the Life of a Developer](#-showcase-a-day-in-the-life-of-a-developer)
  - [🌅 Morning: Understand & Explore Code](#-morning-understand--explore-code-10-min)
  - [☀️ Late Morning: Write & Refactor Code](#%EF%B8%8F-late-morning-write--refactor-code-10-min)
  - [🍽️ Midday: Test & Fix](#%EF%B8%8F-midday-test--fix-5-min)
  - [🌆 Afternoon: Workflow Automation](#-afternoon-workflow-automation-5-min)
  - [⚙️ Custom Instructions](#%EF%B8%8F-custom-instructions-10-min)
- [Model Usage Strategy](#-model-usage-strategy)
- [Understanding Context in Copilot](#-understanding-context-in-copilot)
- [Best Practices](#-best-practices)
- [Important Links](#-important-links)

---

## 📖 About This Project

This **Vue 3 Todo Dashboard** is a purpose-built sample application for demonstrating GitHub Copilot capabilities during developer onboarding sessions. The project provides realistic scenarios for showcasing:

- **Code exploration** with `@workspace` and `#codebase`
- **Inline completions** and Tab-to-accept workflows
- **Inline Chat** for quick refactoring
- **Test generation** and bug fixing
- **Commit message generation** and CLI assistance

### Project Structure

```
src/
├── App.vue                    # Root component
├── main.ts                    # Application entry
├── assets/styles/             # CSS variables & base styles
├── components/
│   ├── layout/
│   │   ├── MainLayout.vue     # Page layout wrapper
│   │   ├── TheHeader.vue      # Top navigation
│   │   └── TheSidebar.vue     # Side navigation
│   └── icons/                 # Icon components
├── router/index.ts            # Vue Router configuration
├── stores/counter.ts          # Pinia store example
└── views/
    ├── DashboardView.vue      # Main dashboard
    ├── VitalTasksView.vue     # Priority tasks
    ├── MyTasksView.vue        # Personal tasks
    ├── CategoriesView.vue     # Task categories
    ├── SettingsView.vue       # User settings
    └── HelpView.vue           # Help section
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Composition API with `<script setup>` |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast dev server & bundler |
| **Pinia** | State management |
| **Vue Router** | Client-side routing |
| **ESLint + Prettier** | Code quality & formatting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- VS Code with [GitHub Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd todo_app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint & auto-fix with ESLint |
| `npm run format` | Format with Prettier |

---

## 🎬 Showcase: A Day in the Life of a Developer

This showcase is designed for a **60-minute onboarding session** and follows a developer's typical daily workflow. It can be adapted for both **VS Code** and **JetBrains IDEs**.

> **⚠️ Important Reminder:** You are the **Pilot, not the Autopilot**. Always review generated code and ensure compliance with your project's guidelines.

---

### 🌅 Morning: Understand & Explore Code (10 min)

**Goal:** Quickly onboard to an unfamiliar codebase.

#### Feature: Chat View with `@workspace` / `#codebase`

| IDE | How to Use |
|-----|------------|
| **VS Code** | Open Chat (`Cmd+Shift+I`) → Type `@workspace` queries |
| **JetBrains** | Select code → Right-click → "Copilot: Explain this" |

#### Try These Prompts

```
@workspace What is the purpose of the MainLayout component?

@workspace Where is the Vue Router configured and what routes exist?

@workspace How does the Pinia store work in this project?

#codebase Explain the relationship between App.vue and the layout components
```

#### What to Showcase

1. Open the project and ask: *"@workspace Give me an overview of this project structure"*
2. Navigate to `MainLayout.vue` and ask: *"What components does this import and why?"*
3. Highlight the router configuration and use **Explain this** feature

> 💡 **Tip:** Use the Chat to understand code *before* you change a single line.

---

### ☀️ Late Morning: Write & Refactor Code (10 min)

**Goal:** Reduce boilerplate, improve code quality.

#### Feature: Inline Completions (Tab) & Inline Chat (`Cmd+I` / `Ctrl+I`)

| Action | Shortcut |
|--------|----------|
| Accept suggestion | `Tab` |
| Reject suggestion | `Esc` |
| Inline Chat | `Cmd+I` (Mac) / `Ctrl+I` (Windows) |

#### Live Coding Examples

**1. Start typing a function:**
```typescript
// Function that validates an email address using regex
function validateEmail(
```
→ Press `Tab` to accept Copilot's completion

**2. Add a new method to the store:**
```typescript
// In stores/counter.ts, start typing:
function reset() {
```
→ Let Copilot complete it

**3. Refactor with Inline Chat:**
- Select a function → `Cmd+I` → *"Add JSDoc documentation"*
- Select code → `Cmd+I` → *"Refactor to use async/await"*
- Select component → `Cmd+I` → *"Add TypeScript types for props"*

#### What to Showcase

1. Create a new `validateEmail` utility function with just a comment
2. Add a `reset()` method to the counter store
3. Select `DashboardView.vue` script and ask to add proper TypeScript interfaces

> 💡 **Tip:** This is your "Pair Programmer" – you set the direction, Copilot writes the code.

---

### 🍽️ Midday: Test & Fix (5 min)

**Goal:** Increase test coverage, find and fix bugs.

#### Feature: `/tests` and `/fix` Commands

#### Try These Commands

```
/tests Create unit tests for the counter store using Vitest

/tests Generate component tests for TheHeader.vue

/fix This function has a bug where it doesn't handle empty arrays
```

#### What to Showcase

1. Open `stores/counter.ts`
2. Ask: *"/tests Create comprehensive unit tests with Vitest"*
3. Introduce a deliberate bug and use `/fix` to correct it

> 💡 **Tip:** Let Copilot write the tedious unit tests and use it as a "second pair of eyes" for bugs.

---

### 🌆 Afternoon: Workflow Automation (5 min)

**Goal:** Use Copilot beyond code generation.

#### Feature: Commit Messages & CLI Assistance

**Git Integration (All IDEs):**
- Click the ✨ sparkle icon in the Git commit input
- Or use *"Generate Commit Message"* button

**Terminal / CLI (VS Code or Global):**
```bash
# Explain complex commands
gh copilot explain "git rebase -i HEAD~3"

# Get command suggestions
gh copilot suggest "find all .ts files containing TODO"
```

#### What to Showcase

1. Make a small change in the project
2. Stage the changes and click "Generate Commit Message"
3. Open terminal and demonstrate `gh copilot explain` with a complex git command

> 💡 **Tip:** Copilot optimizes your entire workflow – from terminal to commit.

---

### ⚙️ Custom Instructions (10 min)

**Goal:** Teach Copilot project-specific conventions.

#### Feature: Repository Custom Instructions

Create a `.github/copilot-instructions.md` file:

```markdown
# Project Coding Guidelines

## Vue Components
- Always use `<script setup lang="ts">` syntax
- Use Composition API, not Options API
- Component names must be PascalCase

## TypeScript
- Prefer `interface` over `type` for object shapes
- Always define explicit return types for functions
- Use strict null checks

## Styling
- Use CSS custom properties from variables.css
- Follow BEM naming: `.block__element--modifier`
- Scoped styles only in components

## State Management
- Use Pinia stores for shared state
- Use Composition API setup stores
```

#### What to Showcase

1. Create the `.github/copilot-instructions.md` file
2. Ask Copilot to generate a new component
3. Show how it follows the defined conventions

> 💡 **Tip:** Custom instructions make `@workspace` responses follow your project's rules.

---

## 🤖 Model Usage Strategy

GitHub Copilot offers different model tiers:

| Tier | Models | Usage |
|------|--------|-------|
| **Standard** | GPT-4.1, GPT-4o | ✅ Included in license – use for daily tasks |
| **Premium** | Claude Sonnet/Opus, Gemini 2.5 Pro | ⚠️ Limited quota – use for complex challenges |

**Recommendation:**
- Use **Standard models** for everyday coding
- Reserve **Premium models** for complex debugging, architecture decisions, or Agent Mode

---

## 🔍 Understanding Context in Copilot

### Local Index

VS Code builds a local index of your workspace for better context:

| Project Size | Behavior |
|--------------|----------|
| < 750 files | ✅ Automatic advanced index |
| 750-2500 files | Run `Build local workspace index` command once |
| > 2500 files | Uses basic index |

### `@workspace` vs. `#codebase`

| Feature | `@workspace` | `#codebase` |
|---------|--------------|-------------|
| Type | Chat Participant | Chat Tool |
| Behavior | Hands off entire prompt | Can be invoked multiple times |
| Flexibility | Single participant per prompt | Multiple tools per prompt |
| **Recommendation** | Good for focused questions | **Preferred** – more flexible |

### Agent Mode vs. Ask/Edit Mode

| Mode | Context Behavior |
|------|------------------|
| **Agent Mode** | Automatic agentic search with follow-up queries |
| **Ask/Edit Mode** | Single codebase search, no follow-ups |

> 💡 **Tip:** Use `#codebase` in your prompts for maximum flexibility.

---

## ✅ Best Practices

1. **Good Context = Good Suggestions**
   - Write a comment first, then let Copilot complete
   - Open related files for better context

2. **Review Everything**
   - You're responsible for the code
   - Check for security issues, edge cases, and logic errors

3. **Workspace-Only Activation (VS Code)**
   - Enable Copilot per workspace for sensitive projects

4. **Use the Right Tool**
   - Inline completions for flow
   - Chat for exploration
   - Agent mode for complex tasks

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| **Feature Overview** | [GitHub Copilot Features](https://docs.github.com/en/copilot/get-started/github-copilot-features) |
| **Quickstart Guide** | [Get Started with Copilot](https://docs.github.com/en/copilot/get-started/quickstart?tool=jetbrains) |
| **VS Code Cheat Sheet** | [Copilot Cheat Sheet](https://docs.github.com/en/copilot/reference/cheat-sheet?tool=vscode) |
| **Workspace Context** | [VS Code Workspace Context](https://code.visualstudio.com/docs/copilot/reference/workspace-context) |
| **Local Index Docs** | [Local Index Reference](https://code.visualstudio.com/docs/copilot/reference/workspace-context#_local-index) |
| **Prompting Guide** | [Prompting Best Practices](https://confluence.slashwhy.de/spaces/GENAI/pages/203537355/Prompting) |

---

## 📄 License

This is an internal sample project for GitHub Copilot onboarding demonstrations.

---

<p align="center">
  <strong>Remember: You're the Pilot 🧑‍✈️ – Copilot is your co-pilot!</strong>
</p>
