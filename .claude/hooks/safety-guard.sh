#!/bin/bash
# Pre-tool use hook: Safety Guard (Claude Code)
# Blocks edits to protected files and dangerous bash commands.
# Equivalent to .github/hooks/scripts/safety-guard.sh for GitHub Copilot.
# Claude Code hook format: reads tool_name + tool_input from stdin (snake_case keys).
# Exit code 2 blocks the operation; exit code 0 allows it.
# See docs/HOOKS.md and docs/CLAUDE_CODE.md for details.
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

# --- Protect files from edit/write ---
if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ] || [ "$TOOL_NAME" = "MultiEdit" ]; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

  if [ -n "$FILE_PATH" ]; then
    # Block edits to auto-generated Prisma client
    if echo "$FILE_PATH" | grep -qE '(^|/)src/generated/'; then
      echo "Cannot edit auto-generated files in src/generated/. Run \`npx prisma generate\` instead." >&2
      exit 2
    fi

    # Block edits to committed migration SQL files
    if echo "$FILE_PATH" | grep -qE '(^|/)prisma/migrations/.+\.sql$'; then
      echo "Migration SQL files are immutable after creation. Create a new migration with \`npx prisma migrate dev\`." >&2
      exit 2
    fi

    # Block edits to migration lock file
    if echo "$FILE_PATH" | grep -qE '(^|/)migration_lock\.toml$'; then
      echo "migration_lock.toml is managed by Prisma. Do not edit manually." >&2
      exit 2
    fi

    # Protect .github/ (Copilot setup) from accidental modification
    if echo "$FILE_PATH" | grep -qE '(^|/)\.github/'; then
      echo "The .github/ directory contains GitHub Copilot configuration. Edit Copilot agents/instructions/skills there directly." >&2
      exit 2
    fi
  fi
fi

# --- Block dangerous bash commands ---
if [ "$TOOL_NAME" = "Bash" ]; then
  COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

  if [ -n "$COMMAND" ]; then
    # Destructive filesystem operations
    if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+(/|~)'; then
      echo "Destructive filesystem operation blocked: rm -rf on root or home directory." >&2
      exit 2
    fi

    # Destructive database operations
    if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE)'; then
      echo "Destructive database operation blocked: DROP TABLE/DATABASE." >&2
      exit 2
    fi

    # Destructive git operations
    if echo "$COMMAND" | grep -qE 'git\s+push\s+--force|git\s+reset\s+--hard'; then
      echo "Destructive git operation blocked: force push or hard reset require manual execution." >&2
      exit 2
    fi

    # Destructive Docker operations
    if echo "$COMMAND" | grep -qE 'docker\s+(rm|system\s+prune)'; then
      echo "Destructive Docker operation blocked: container removal or system prune require manual execution." >&2
      exit 2
    fi
  fi
fi

# Allow all other operations (no output = allow)
exit 0
