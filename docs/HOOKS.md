# ⚙️ Hooks

> Execute custom shell commands at strategic points during Copilot agent sessions — enforce policies, automate formatting, and audit agent behavior.

**Audience:** Developers using Copilot cloud agent or CLI | **Prerequisites:** [Custom Agents][custom-agents], [Security Guide][security]

## 📋 Quick Reference

### This Project's Hooks

| Hook               | Type          | Script                            | Purpose                                                |
| ------------------ | ------------- | --------------------------------- | ------------------------------------------------------ |
| **Safety Guard**   | `preToolUse`  | [`safety-guard.sh`][safety-guard] | Blocks edits to protected files and dangerous commands |
| **Auto Formatter** | `postToolUse` | [`auto-format.sh`][auto-format]   | Runs Prettier on edited frontend files                 |

Configuration: [`.github/hooks/project-hooks.json`][hooks-config]

## 🌐 Overview

### What Are Hooks?

Hooks are custom shell commands that run at key points during a Copilot agent session. They receive JSON input via stdin describing the agent's action and can optionally return JSON to influence behavior.

```
Agent Session Lifecycle
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 sessionStart ──→ userPromptSubmitted ──→ preToolUse ──→ [tool runs] ──→ postToolUse
                        │                     │                              │
                        │                     ├─ can DENY tool execution     │
                        │                     │                              │
                        ▼                     ▼                              ▼
                   (repeats per prompt)  (repeats per tool)            agentStop / subagentStop
                                                                             │
                                                                             ▼
                                                                        sessionEnd

 errorOccurred ──→ can fire at any point during the session
```

**Key points:**

- Hooks live in `.github/hooks/*.json` on the default branch
- They run synchronously and block agent execution
- Only `preToolUse` can influence behavior (approve/deny tool calls)
- All other hooks are fire-and-forget (output ignored)
- Available for **Copilot cloud agent** and **GitHub Copilot CLI**

> 📖 **Official Docs:** [About Hooks][gh-about-hooks] · [Using Hooks][gh-use-hooks] · [Hooks Configuration Reference][gh-hooks-ref]

### Hooks vs. Other Customizations

| Mechanism                   | When It Runs               | Can Block Actions           | Scope              |
| --------------------------- | -------------------------- | --------------------------- | ------------------ |
| **Instructions**            | Before agent responds      | No (guidance only)          | Prompt context     |
| **Agent tool restrictions** | Agent selection            | No (limits available tools) | Agent definition   |
| **Hooks**                   | During execution lifecycle | Yes (`preToolUse` can deny) | All agent sessions |
| **Agentic Workflows**       | On schedule/events         | N/A (separate system)       | Repository CI      |

Hooks complement agent tool restrictions: agents define _which_ tools are available, hooks enforce _how_ those tools may be used.

## 🔧 Hook Types

| Type                  | Trigger                      | Can Return Output      | Use Cases                          |
| --------------------- | ---------------------------- | ---------------------- | ---------------------------------- |
| `sessionStart`        | New or resumed session       | No                     | Environment init, logging          |
| `sessionEnd`          | Session completes/terminates | No                     | Cleanup, reports                   |
| `userPromptSubmitted` | User sends a prompt          | No                     | Audit logging                      |
| `preToolUse`          | Before any tool executes     | **Yes** (approve/deny) | Security policies, file protection |
| `postToolUse`         | After tool completes         | No                     | Formatting, metrics, alerts        |
| `agentStop`           | Main agent finishes          | No                     | Summary generation                 |
| `subagentStop`        | Subagent completes           | No                     | Subagent result logging            |
| `errorOccurred`       | Error during execution       | No                     | Error tracking, notifications      |

### Pre-Tool Use (the powerful one)

`preToolUse` is the only hook that can influence agent behavior. It receives the tool name and arguments, and can return:

```json
{
  "permissionDecision": "deny",
  "permissionDecisionReason": "Reason shown to agent"
}
```

| Decision  | Effect                                     |
| --------- | ------------------------------------------ |
| `"allow"` | Permit the tool call (same as no output)   |
| `"deny"`  | Block the tool call; agent sees the reason |
| No output | Allow by default                           |

## 📁 Configuration Format

Hook files use JSON with a `version: 1` schema:

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/safety-guard.sh",
        "cwd": ".github/hooks",
        "timeoutSec": 15,
        "comment": "Block edits to protected files and dangerous commands"
      }
    ],
    "postToolUse": [
      {
        "type": "command",
        "bash": "./scripts/auto-format.sh",
        "cwd": ".github/hooks",
        "timeoutSec": 30,
        "comment": "Auto-format edited frontend files with Prettier"
      }
    ]
  }
}
```

### Hook Object Properties

| Property     | Required      | Description                                             |
| ------------ | ------------- | ------------------------------------------------------- |
| `type`       | Yes           | Must be `"command"`                                     |
| `bash`       | Yes (Unix)    | Path to bash script or inline command                   |
| `powershell` | Yes (Windows) | Path to PowerShell script                               |
| `cwd`        | No            | Working directory relative to repo root                 |
| `env`        | No            | Additional environment variables (`{ "KEY": "value" }`) |
| `timeoutSec` | No            | Max execution time in seconds (default: 30)             |
| `comment`    | No            | Human-readable description                              |

Multiple hooks of the same type execute **in order** — useful for layering security check → audit log → metrics.

## 🛡️ This Project's Hooks

### 1. Safety Guard (`preToolUse`)

**Script:** [`.github/hooks/scripts/safety-guard.sh`][safety-guard]

Prevents agents from modifying protected files or running dangerous commands.

**Protected paths** (edit/create denied):

| Pattern                      | Reason                                             |
| ---------------------------- | -------------------------------------------------- |
| `src/generated/**`           | Auto-generated Prisma client — never edit manually |
| `prisma/migrations/**/*.sql` | Migration files are immutable after creation       |
| `migration_lock.toml`        | Prisma migration lock file                         |

**Blocked commands** (bash tool denied):

| Pattern                                | Reason                            |
| -------------------------------------- | --------------------------------- |
| `rm -rf /`, `rm -rf ~`                 | Destructive filesystem operations |
| `DROP TABLE`, `DROP DATABASE`          | Destructive database operations   |
| `git push --force`, `git reset --hard` | Destructive git operations        |
| `docker rm`, `docker system prune`     | Destructive container operations  |

### 2. Auto Formatter (`postToolUse`)

**Script:** [`.github/hooks/scripts/auto-format.sh`][auto-format]

Automatically runs Prettier on frontend files after successful agent edits, ensuring consistent code style without manual intervention.

- Triggers on successful `edit` or `create` tool calls
- Formats files matching `frontend/**/*.{ts,vue,js,css}`
- Logs formatting actions to `.github/hooks/logs/format.log`
- Gracefully skips if Prettier is not available

## 🧪 Testing Hooks Locally

Test hooks by piping JSON input to the script:

```bash
# Test safety guard: should DENY editing generated files
echo '{"timestamp":1704614600000,"cwd":".","toolName":"edit","toolArgs":"{\"path\":\"backend/src/generated/prisma/client.ts\"}"}' \
  | .github/hooks/scripts/safety-guard.sh
# Expected: {"permissionDecision":"deny","permissionDecisionReason":"..."}

# Test safety guard: should ALLOW editing route files
echo '{"timestamp":1704614600000,"cwd":".","toolName":"edit","toolArgs":"{\"path\":\"backend/src/routes/tasks.ts\"}"}' \
  | .github/hooks/scripts/safety-guard.sh
# Expected: no output (allowed)

# Test safety guard: should DENY dangerous commands
echo '{"timestamp":1704614600000,"cwd":".","toolName":"bash","toolArgs":"{\"command\":\"rm -rf /\"}"}' \
  | .github/hooks/scripts/safety-guard.sh
# Expected: {"permissionDecision":"deny","permissionDecisionReason":"..."}

# Validate JSON syntax
jq . .github/hooks/project-hooks.json

# Check script syntax
bash -n .github/hooks/scripts/safety-guard.sh
bash -n .github/hooks/scripts/auto-format.sh
```

### Debugging

Enable verbose mode in scripts:

```bash
#!/bin/bash
set -x  # Enable bash debug mode
INPUT=$(cat)
echo "DEBUG: Received input" >&2
echo "$INPUT" >&2
```

> **Tip:** Use `>&2` for debug output — only stdout is parsed as hook response.

## ⚡ Performance Considerations

Hooks run synchronously and block agent execution. Keep them fast:

| Guideline            | Recommendation                                                         |
| -------------------- | ---------------------------------------------------------------------- |
| **Execution time**   | Keep under 5 seconds; set `timeoutSec` for safety                      |
| **I/O operations**   | Use append (`>>`) over write (`>`) for logging                         |
| **External calls**   | Avoid network requests in `preToolUse` (blocks every tool call)        |
| **Heavy operations** | Move to `postToolUse` or `sessionEnd` where blocking is less impactful |
| **Caching**          | Cache expensive computations when possible                             |

## 🔒 Security Considerations

| Risk                                        | Mitigation                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------- | -------------- |
| **Command injection** via unsanitized input | Always parse JSON with `jq`, never use `eval` or unquoted expansion         |
| **Secret exposure** in logs                 | Never log tokens, passwords, or API keys; mask sensitive data               |
| **Malicious hook scripts**                  | Review hook scripts in PRs like any other code; they execute shell commands |
| **File permission escalation**              | Set appropriate permissions on hook scripts (`chmod 755`)                   |
| **Timeout DoS**                             | Set reasonable `timeoutSec` values to prevent resource exhaustion           |
| **Supply chain**                            | Pin script dependencies; avoid `curl                                        | bash` patterns |

See the [Security Guide][security] for the full AI attack surface analysis, including [Hook Script Risks][hook-security-risks].

## 📖 Creating New Hooks

1. Add a new entry to `.github/hooks/project-hooks.json` under the appropriate hook type
2. Create your script in `.github/hooks/scripts/`
3. Make it executable: `chmod +x .github/hooks/scripts/your-hook.sh`
4. Read JSON from stdin, process with `jq`
5. For `preToolUse`: output deny JSON or nothing (allow)
6. Test locally by piping sample JSON
7. Commit to default branch (hooks are loaded from default branch for cloud agent)

### Script Template

```bash
#!/bin/bash
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Your logic here...

# To deny (preToolUse only):
# echo '{"permissionDecision":"deny","permissionDecisionReason":"Reason"}' | jq -c

# To allow: exit without output
exit 0
```

## 📚 Further Reading

- [About Hooks][gh-about-hooks] — Concepts, types, and format
- [Using Hooks][gh-use-hooks] — Step-by-step creation guide
- [Hooks Configuration Reference][gh-hooks-ref] — Full input/output schemas and examples
- [Custom Agents](./CUSTOM_AGENTS.md) — Agent tool restrictions (complementary to hooks)
- [Security Guide](./SECURITY.md) — AI attack surface and hook script risks

<!-- Project Files -->

[hooks-config]: ../.github/hooks/project-hooks.json
[safety-guard]: ../.github/hooks/scripts/safety-guard.sh
[auto-format]: ../.github/hooks/scripts/auto-format.sh

<!-- Project Documentation -->

[custom-agents]: ./CUSTOM_AGENTS.md
[security]: ./SECURITY.md
[hook-security-risks]: ./SECURITY.md#6--hook-script-risks

<!-- GitHub Documentation -->

[gh-about-hooks]: https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-hooks
[gh-use-hooks]: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/use-hooks
[gh-hooks-ref]: https://docs.github.com/en/copilot/reference/hooks-configuration
