#!/bin/bash
# Pre-tool use hook: Safety Guard
# Blocks edits to protected files and dangerous bash commands.
# See docs/HOOKS.md for details.
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# --- Protect files from edit/create ---
if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "create" ]; then
  FILE_PATH=$(echo "$TOOL_ARGS" | jq -r '.path // .filePath // empty')

  if [ -n "$FILE_PATH" ]; then
    # Block edits to auto-generated Prisma client
    if echo "$FILE_PATH" | grep -qE '(^|/)src/generated/'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "Cannot edit auto-generated files in src/generated/. Run `prisma generate` instead."}'
      exit 0
    fi

    # Block edits to committed migration SQL files
    if echo "$FILE_PATH" | grep -qE '(^|/)prisma/migrations/.+\.sql$'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "Migration SQL files are immutable after creation. Create a new migration with `prisma migrate dev`."}'
      exit 0
    fi

    # Block edits to migration lock file
    if echo "$FILE_PATH" | grep -qE '(^|/)migration_lock\.toml$'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "migration_lock.toml is managed by Prisma. Do not edit manually."}'
      exit 0
    fi
  fi
fi

# --- Block dangerous bash commands ---
if [ "$TOOL_NAME" = "bash" ]; then
  COMMAND=$(echo "$TOOL_ARGS" | jq -r '.command // empty')

  if [ -n "$COMMAND" ]; then
    # Destructive filesystem operations
    if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+(/|~)'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "Destructive filesystem operation blocked: rm -rf on root or home directory."}'
      exit 0
    fi

    # Destructive database operations
    if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE)'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "Destructive database operation blocked: DROP TABLE/DATABASE."}'
      exit 0
    fi

    # Destructive git operations
    if echo "$COMMAND" | grep -qE 'git\s+push\s+--force|git\s+reset\s+--hard'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "Destructive git operation blocked: force push or hard reset require manual execution."}'
      exit 0
    fi

    # Destructive Docker operations
    if echo "$COMMAND" | grep -qE 'docker\s+(rm|system\s+prune)'; then
      jq -n '{permissionDecision: "deny", permissionDecisionReason: "Destructive Docker operation blocked: container removal or system prune require manual execution."}'
      exit 0
    fi
  fi
fi

# Allow all other operations (no output = allow)
exit 0
