#!/bin/bash
# Post-tool use hook: Auto Formatter
# Runs Prettier on frontend files after successful agent edits.
# See docs/HOOKS.md for details.
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
RESULT_TYPE=$(echo "$INPUT" | jq -r '.toolResult.resultType // empty')

# Only run after successful edit or create
if [ "$RESULT_TYPE" != "success" ]; then
  exit 0
fi

if [ "$TOOL_NAME" != "edit" ] && [ "$TOOL_NAME" != "create" ]; then
  exit 0
fi

# Extract file path from tool arguments
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')
FILE_PATH=$(echo "$TOOL_ARGS" | jq -r '.path // .filePath // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format frontend files with supported extensions
if ! echo "$FILE_PATH" | grep -qE '^(\./)?(frontend/).*\.(ts|vue|js|css)$'; then
  exit 0
fi

# Resolve to the repository root (cwd is .github/hooks, go up two levels)
REPO_ROOT="$(cd ../.. && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
ABSOLUTE_PATH="$REPO_ROOT/$FILE_PATH"

# Remove leading ./ if present
ABSOLUTE_PATH=$(echo "$ABSOLUTE_PATH" | sed 's|/\./|/|g')

# Ensure the file exists
if [ ! -f "$ABSOLUTE_PATH" ]; then
  exit 0
fi

# Ensure log directory exists
LOG_DIR="$REPO_ROOT/.github/hooks/logs"
mkdir -p "$LOG_DIR"

# Check if prettier is available in the frontend directory
if [ -f "$FRONTEND_DIR/node_modules/.bin/prettier" ]; then
  if "$FRONTEND_DIR/node_modules/.bin/prettier" --write "$ABSOLUTE_PATH" > /dev/null 2>&1; then
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') FORMATTED $FILE_PATH" >> "$LOG_DIR/format.log"
  else
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') SKIPPED  $FILE_PATH (prettier error)" >> "$LOG_DIR/format.log"
  fi
else
  echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') SKIPPED  $FILE_PATH (prettier not installed)" >> "$LOG_DIR/format.log"
fi

# Post-tool output is ignored, no need to return anything
exit 0
