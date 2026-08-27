#!/usr/bin/env bash
set -euo pipefail

WORKSPACE=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")

SANDBOX_COMMAND="${SANDBOX_COMMAND:-claude}"
DEFAULTS_FILE="${CLOUD_DEFAULTS_FILE:-$WORKSPACE/.sandbox/defaults.sh}"

if [[ -f "$DEFAULTS_FILE" ]]; then
    source "$DEFAULTS_FILE"
fi

SANDBOX_COMMAND_DEFAULTS=("${SANDBOX_COMMAND_DEFAULTS[@]:-}")

if [[ $# -eq 0 || "$1" == -* ]]; then
    set -- "${SANDBOX_COMMAND_DEFAULTS[@]}" "$@"
fi

if [[ "$1" == "$SANDBOX_COMMAND" ]]; then
    shift
fi

.sandbox/start.sh "$SANDBOX_COMMAND" "$@"
