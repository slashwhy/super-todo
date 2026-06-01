#!/bin/bash
# Post-tool use hook: Auto Formatter (Claude Code)
# Runs Prettier on frontend files after successful agent edits.
# Equivalent to .github/hooks/scripts/auto-format.sh for GitHub Copilot.
# Claude Code hook format: reads tool_name + tool_response from stdin (snake_case keys).
# See docs/HOOKS.md and docs/CLAUDE_CODE.md for details.
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

# Only run after Write, Edit, or MultiEdit
if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ] && [ "$TOOL_NAME" != "MultiEdit" ]; then
  exit 0
fi

# Extract file path from tool input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format frontend files with supported extensions
if ! echo "$FILE_PATH" | grep -qE '^(\./)?(frontend/).*\.(ts|vue|js|css)$'; then
  exit 0
fi

# Resolve to the repository root (cwd is the repo root when running from .claude/hooks/)
REPO_ROOT="$(pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
ABSOLUTE_PATH="$REPO_ROOT/$FILE_PATH"

# Remove any double slashes
ABSOLUTE_PATH=$(echo "$ABSOLUTE_PATH" | sed 's|//|/|g')

# Ensure the file exists
if [ ! -f "$ABSOLUTE_PATH" ]; then
  exit 0
fi

# Ensure log directory exists (shared with Copilot hooks)
LOG_DIR="$REPO_ROOT/.github/hooks/logs"
mkdir -p "$LOG_DIR"

# Check if prettier is available in the frontend directory
if [ -f "$FRONTEND_DIR/node_modules/.bin/prettier" ]; then
  if "$FRONTEND_DIR/node_modules/.bin/prettier" --write "$ABSOLUTE_PATH" > /dev/null 2>&1; then
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') [claude] FORMATTED $FILE_PATH" >> "$LOG_DIR/format.log"
  else
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') [claude] SKIPPED  $FILE_PATH (prettier error)" >> "$LOG_DIR/format.log"
  fi
else
  echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') [claude] SKIPPED  $FILE_PATH (prettier not installed)" >> "$LOG_DIR/format.log"
fi

# Post-tool output is informational only
exit 0
