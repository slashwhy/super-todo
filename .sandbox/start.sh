#!/usr/bin/env bash
set -euo pipefail

SELF=$(basename $BASH_SOURCE)
WORKSPACE=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")
SANDBOX_DIR="$WORKSPACE/.sandbox"
PROFILE_JSON="$SANDBOX_DIR/profile.json"
PROFILE_TEMPLATE="$SANDBOX_DIR/profile.template.json"

if ! command -v nono >/dev/null 2>&1; then
    echo "$SELF: 'nono' sandbox is not installed or not in PATH." >&2
    echo "Install nono from https://nono.sh/" >&2
    exit 127
fi

# There's no local profile.json yet, copy from template
if [[ ! -f "$PROFILE_JSON" ]]; then
    if [[ -f "$PROFILE_TEMPLATE" ]]; then
        local_ver=$(jq -r '.meta.version // 1' "$PROFILE_TEMPLATE" 2>/dev/null || echo "1")
        echo "$SELF: Copying profile.json from template (v$local_ver). Check contents and adjust to your local environment." >&2
        cp "$PROFILE_TEMPLATE" "$PROFILE_JSON"
    else
        echo "$SELF: Couldn't find neither profile.json nor profile.template.json" >&2
        exit 1
    fi
else
    # Check for version mismatch via meta.version
    if command -v jq >/dev/null 2>&1; then
        tpl_ver=$(jq -r '.meta.version // 0' "$PROFILE_TEMPLATE" 2>/dev/null || echo "0")
        local_ver=$(jq -r '.meta.version // 0' "$PROFILE_JSON" 2>/dev/null || echo "0")

        if (( local_ver < tpl_ver )); then
            echo -e "\n\033[33mYour '$PROFILE_JSON' (v$local_ver) is older than the template (v$tpl_ver)!\033[0m" >&2
            echo -e "\033[36m (diff between local config (-) and template (+))\033[0m" >&2
            echo -e "\033[36m--------------------------------------------------------\033[0m" >&2
            diff -u --color=always "$PROFILE_JSON" "$PROFILE_TEMPLATE" || true
            echo -e "\033[36m--------------------------------------------------------\033[0m" >&2
            echo "Please adjust your '$PROFILE_JSON' (at least the .meta.version field to $tpl_ver) or delete it to reset.\n" >&2
        fi
    else
        if ! diff -q "$PROFILE_JSON" "$PROFILE_TEMPLATE" >/dev/null 2>&1; then
          echo -e "\n\033[33mYour '$PROFILE_JSON' differs from the template (v$tpl_ver) but there's no 'jq' installed to check versions.[0m" >&2
        fi
    fi
fi

run_hook() {
    local hook_script="$SANDBOX_DIR/hooks/$1"
    if [[ -x "$hook_script" ]]; then
        ( "$hook_script" ) || echo "\033[33mWarning: Hook $1 exited with non-zero status.\033[0m" >&2
    fi
}

cd "$WORKSPACE"
run_hook before
trap 'run_hook after' EXIT

nono wrap \
  --profile "$PROFILE_JSON" \
  --workdir "$WORKSPACE" \
  --allow-cwd \
  -- "$@"
