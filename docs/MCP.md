# 🔗 MCP Integrations

> Model Context Protocol servers that extend agent capabilities with external tools.

**Audience:** Developers configuring or using MCP tools | **Prerequisites:** [Custom Agents][custom-agents]

## 📋 Quick Reference

| Server              | Purpose                                    | Used By                                                              |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------- |
| **Atlassian**       | Jira tickets, Confluence docs              | [@Specify][agent-specify]                                            |
| **Figma Desktop**   | Design specs, tokens                       | [@Specify][agent-specify], [@Implement][agent-implement]             |
| **Chrome DevTools** | Browser automation, debugging, performance | [@Feature Tester][agent-feature-tester], [@Test E2E][agent-test-e2e] |
| **Playwright**      | E2E test execution                         | [@Test E2E][agent-test-e2e]                                          |

> 💡 **Alternative:** For basic browser testing without MCP, VS Code's built-in browser tools (`workbench.browser.enableChatTools`) provide zero-setup navigation, screenshots, and interaction. See [Built-in Browser Tools](#-vs-code-built-in-browser-tools) below.

## 🎯 What & Why

MCP (Model Context Protocol) is an open standard connecting AI applications to external systems. Think of it as **USB-C for AI**—a standardized interface to connect to any compatible service.

MCP enables agents to:

- Access external data (Jira, Figma, databases)
- Execute workflows (browser automation, test runs)
- Integrate with services without custom code

> 📖 **See also:** [Customization Cheat Sheet][copilot-cheat-sheet] — how MCP compares to other Copilot customization features (instructions, agents, prompts, skills).

## 🔄 How It Works

```
Agent wants ticket details
      ↓
Calls MCP: getJiraIssue("PROJ-123")
      ↓
Atlassian MCP Server
      ↓
Jira API
      ↓
Returns ticket data to agent
```

## ⚡ Context Efficiency: The Code Execution Pattern

Traditional tool-calling consumes excessive tokens. Modern MCP uses **code execution** for efficiency:

### The Problem: Direct Tool-Calling

```
200K Context Window
├─ Tool definitions (all loaded)  50K   ← Hidden overhead
├─ Tool results (full response)   30K   ← Often unnecessary
└─ Your actual work              120K
```

**Issues:**

- Loading 100+ tool definitions wastes tokens
- Full API responses bloat context
- Each tool chain multiplies token usage

### The Solution: Code Execution

Agents write code to interact with MCP servers, not direct calls:

| Technique                  | How It Works                                         | Token Savings      |
| -------------------------- | ---------------------------------------------------- | ------------------ |
| **Progressive Disclosure** | Explore tools as filesystem, load only what's needed | 30-40%             |
| **Local Filtering**        | Filter data locally, pass summaries to model         | 60-70%             |
| **Privacy-Preserving**     | Sensitive data stays in execution environment        | N/A (security)     |
| **State Persistence**      | Write intermediate results to files                  | Enables multi-step |

### Example: Efficient Design Fetch

```typescript
// ✅ Efficient: Filter locally, return summary
const design = await figmaApi.getDesign(componentId);
return {
  name: design.name,
  bounds: design.absoluteBoundingBox,
  fills: design.fills,
  // Omit: children, effects, interactions (~48K tokens saved)
};

// ❌ Wasteful: Full response to context
return await figmaApi.getDesign(componentId); // 50K tokens
```

> 📖 **Deep Dive:** [Context Optimization][context-optimization] for general token management strategies.

## 🖥️ Configured Servers

### Atlassian (Jira & Confluence)

**Server:** `atlassian/atlassian-mcp-server`

| Tool                       | Purpose                       |
| -------------------------- | ----------------------------- |
| `getJiraIssue`             | Fetch ticket details          |
| `searchJiraIssuesUsingJql` | Search with JQL               |
| `getConfluencePage`        | Read docs                     |
| `search`                   | Search across Jira/Confluence |

**Example workflow:**

```
@specify plan PROJ-123
  → getJiraIssue("PROJ-123") → User story + acceptance criteria
  → search("PROJ-123 design") → Linked Figma design
  → Generate implementation plan
```

### Figma Desktop

**Server:** `figma-desktop` (local)

| Tool                   | Purpose                |
| ---------------------- | ---------------------- |
| `get_screenshot`       | Capture design visuals |
| `get_metadata`         | Component structure    |
| `get_variable_defs`    | Design tokens          |
| `get_code_connect_map` | Figma → code mapping   |

**Design token mapping:**

```
Figma                    CSS Variables
─────────────────────    ─────────────────────
Primary: #007AFF    →    --color-primary
Spacing: 8px        →    --spacing-base
Font: Inter 14px    →    --font-body
```

> 📌 **Note:** Requires Figma desktop app to be running.

### Chrome DevTools

**Server:** `chrome-devtools-mcp` ([GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)) — v0.24+, 38k+ stars

**Requirements:** Node.js v20.19+, Chrome stable

**Configuration:**

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--isolated=true"]
    }
  }
}
```

> **`--isolated=true`** — Creates a temporary user-data-dir that is automatically cleaned up after the browser is closed, ensuring a clean browser state for each session.

**Tool Categories (42 tools):**

| Category        | Tools                                                                                                                                                            | Purpose                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Input (10)      | `click`, `fill`, `fill_form`, `hover`, `press_key`, `type_text`, `drag`, `handle_dialog`, `upload_file`, `click_at`                                              | Interact with page elements |
| Navigation (6)  | `navigate_page`, `new_page`, `close_page`, `list_pages`, `select_page`, `wait_for`                                                                               | Page management             |
| Debugging (8)   | `take_screenshot`, `take_snapshot`, `evaluate_script`, `list_console_messages`, `get_console_message`, `lighthouse_audit`, `screencast_start`, `screencast_stop` | Inspect and debug           |
| Performance (3) | `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`                                                                               | Performance analysis        |
| Network (2)     | `list_network_requests`, `get_network_request`                                                                                                                   | Network inspection          |
| Emulation (2)   | `emulate`, `resize_page`                                                                                                                                         | Device/viewport emulation   |
| Memory (4)      | `take_memory_snapshot`, `get_memory_snapshot_details`, `get_nodes_by_class`, `load_memory_snapshot`                                                              | Memory profiling            |

**Example workflow with @Feature Tester:**

```
@Feature Tester Go to the app and check every page for issues
  → navigate_page("http://localhost:5173")
  → take_screenshot() → Verify Dashboard renders
  → list_network_requests() → Check API calls
  → list_console_messages() → Report errors
  → navigate_page("http://localhost:5173/my-tasks")
  → take_screenshot() → Verify task list
  → Structured test report
```

> ⚠️ **Security:** The MCP server has full access to browser content. Avoid sharing sensitive data in browser sessions controlled by the agent.

### Playwright

**Server:** `playwright`

| Tool               | Purpose         |
| ------------------ | --------------- |
| Test execution     | Run test suites |
| Trace analysis     | Debug failures  |
| Report generation  | Create reports  |
| Screenshot capture | Save evidence   |

## 🌐 VS Code Built-in Browser Tools

> **Not an MCP server** — these are native VS Code agent tools that require no external setup.

As of VS Code 1.101 (May 2026), agents can interact with web pages via built-in browser tools. These complement Chrome DevTools MCP for simpler use cases.

**Setup:**

1. Enable setting: `workbench.browser.enableChatTools`
2. In Chat tools picker, verify "Browser" tools are enabled

**Available Tools (~10):**

| Tool                | Purpose                           | Chrome DevTools Equivalent     |
| ------------------- | --------------------------------- | ------------------------------ |
| `openBrowserPage`   | Open URL in integrated browser    | `navigate_page` (first page)   |
| `navigatePage`      | Navigate existing page            | `navigate_page`                |
| `screenshotPage`    | Take screenshot                   | `take_screenshot`              |
| `readPage`          | Read page content/structure       | `take_snapshot`                |
| `clickElement`      | Click element by text/selector    | `click`                        |
| `typeInPage`        | Type into input fields            | `fill`                         |
| `hoverElement`      | Hover over element                | `hover`                        |
| `dragElement`       | Drag element                      | `drag`                         |
| `handleDialog`      | Accept/dismiss dialogs            | `handle_dialog`                |
| `runPlaywrightCode` | Execute arbitrary Playwright code | No equivalent (more flexible!) |

**Key Differences from Chrome DevTools MCP:**

| Aspect              | Chrome DevTools MCP      | Built-in Browser Tools              |
| ------------------- | ------------------------ | ----------------------------------- |
| Setup               | MCP config + npx         | One VS Code setting                 |
| Browser             | External Chrome window   | Integrated in VS Code               |
| Network inspection  | ✅ Dedicated tools       | ⚠️ Via `runPlaywrightCode` only     |
| Performance tracing | ✅ Full Chrome traces    | ❌ Not available                    |
| Lighthouse          | ✅ Full audit            | ❌ Not available                    |
| Console messages    | ✅ Source-mapped stacks  | ⚠️ Via `runPlaywrightCode` only     |
| Memory profiling    | ✅ Heap snapshots        | ❌ Not available                    |
| Custom automation   | `evaluate_script`        | `runPlaywrightCode` (more powerful) |
| Session isolation   | Dedicated Chrome profile | Private in-memory session           |

**When to use built-in tools instead of Chrome DevTools MCP:**

- Quick visual verification during development
- Form submission and interaction testing
- Teams that want zero-config browser testing
- When you only need "does it look right and work?"

**When to stick with Chrome DevTools MCP:**

- Performance profiling and Lighthouse audits
- Network request inspection (headers, timing, bodies)
- Console error debugging with source maps
- Memory leak investigation
- CI/headless testing scenarios

**Example: @Feature Tester with built-in tools:**

```yaml
# In agent frontmatter:
tools:
  [
    execute,
    read,
    search,
    openBrowserPage,
    navigatePage,
    readPage,
    screenshotPage,
    clickElement,
    typeInPage,
    hoverElement,
    handleDialog,
    runPlaywrightCode,
  ]
```

> 📖 **Official docs:** [VS Code Browser Agent Testing Guide](https://code.visualstudio.com/docs/copilot/guides/browser-agent-testing-guide)

## ⚙️ Configuration

**Location:** `mcp.json` (path varies by IDE — VS Code uses `.vscode/mcp.json` in the workspace for project-level config)

Alternatively, MCP servers can be scoped to a specific agent by adding a `mcp-servers` property directly in the agent's YAML frontmatter (`.agent.md` file).

```json
{
  "servers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/sse",
      "auth": { "type": "oauth2" }
    },
    "figma-desktop": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    },
    "chrome-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--isolated=true"]
    }
  }
}
```

**Disable unused servers:**

```json
{
  "servers": {
    "atlassian": { "disabled": true }
  }
}
```

### Claude Code: MCP Configuration

The same MCP servers are configured in `.claude/settings.json` under the `mcpServers` key. The server definitions are identical — only the config file location and top-level key differ (`servers` in `.vscode/mcp.json` → `mcpServers` in `.claude/settings.json`).

```json
// .claude/settings.json
{
  "mcpServers": {
    "figma-desktop": { "type": "http", "url": "http://127.0.0.1:3845/mcp" },
    "atlassian": { "type": "http", "url": "https://mcp.atlassian.com/v1/sse" }
  }
}
```

## 🔒 Security Considerations

MCP servers extend agent capabilities but introduce security risks. Key concerns:

| Risk                       | Overview                                   | Learn More                                  |
| -------------------------- | ------------------------------------------ | ------------------------------------------- |
| 🔓 **Confused Deputy**     | Agent combines permissions unintentionally | [SECURITY.md§Confused Deputy][security]     |
| 🔑 **Credential Exposure** | API keys leaked in logs/outputs            | [SECURITY.md§Credential Exposure][security] |
| 🔄 **Context Leakage**     | Sensitive data crosses project boundaries  | [SECURITY.md§Context Leakage][security]     |
| 🎫 **Token Passthrough**   | Servers accept unauthorized tokens         | [SECURITY.md§Token Passthrough][security]   |

**📖 Complete security guide:** [SECURITY.md][security] – Comprehensive MCP security practices, incident response, and checklists

### Security Best Practices

| Practice                | Implementation                           |
| ----------------------- | ---------------------------------------- |
| **Minimal permissions** | Grant only required MCP tools per agent  |
| **Document data flows** | Map what data goes where for each server |
| **Workspace isolation** | Separate MCP configs per project         |
| **Token validation**    | Validate all credentials before use      |

---

## ✅ Patterns

### Do This: Minimal Permissions

```yaml
# @Specify agent: read-only
tools:
  - atlassian/search
  - figma-desktop/get_screenshot
  - figma-desktop/get_metadata
```

### ⚠️ Avoid This: Overpowered Access

```yaml
# Too many permissions
tools:
  - atlassian/*
  - figma-desktop/*
  - execute/*
```

### Do This: Document Data Flow

| Agent                                   | MCP       | Data Flow               | Sensitivity |
| --------------------------------------- | --------- | ----------------------- | ----------- |
| [@Specify][agent-specify]               | Atlassian | Read requirements       | Public      |
| [@Specify][agent-specify]               | Figma     | Read designs            | Public      |
| [@Feature Tester][agent-feature-tester] | DevTools  | Browse & screenshot app | Test only   |
| [@Test E2E][agent-test-e2e]             | DevTools  | Debug tests             | Test only   |

### ⚠️ Avoid This: Unknown Data Paths

Connecting MCP servers without understanding what data flows through them.

## 🔗 Related

- [Custom Agents][custom-agents] – Which agents use which MCP tools
- [Feature Tester Agent][agent-feature-tester] – Browser-based exploratory testing
- [VS Code Browser Agent Testing Guide](https://code.visualstudio.com/docs/copilot/guides/browser-agent-testing-guide) – Official built-in browser tools docs
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) – Full-power browser automation via MCP
- [Security Guide][security] – MCP security details
- [MCP Official Site][mcp-site] – Introduction and core concepts
- [MCP Architecture][mcp-architecture] – How MCP works under the hood
- [Building MCP Servers][mcp-build-servers] – Create custom MCP integrations

<!-- Project Documentation -->

[custom-agents]: ./CUSTOM_AGENTS.md
[responsibilities]: ./RESPONSIBILITIES.md
[security]: ./SECURITY.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md

<!-- Agent Files -->

[agent-specify]: ../.github/agents/specify.agent.md
[agent-implement]: ../.github/agents/implement.agent.md
[agent-feature-tester]: ../.github/agents/feature-tester.agent.md
[agent-test-e2e]: ../.github/agents/test-e2e.agent.md

<!-- Model Context Protocol -->

[mcp-site]: https://modelcontextprotocol.io/
[mcp-architecture]: https://modelcontextprotocol.io/docs/learn/architecture
[mcp-build-servers]: https://modelcontextprotocol.io/docs/develop/build-server
[copilot-cheat-sheet]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
