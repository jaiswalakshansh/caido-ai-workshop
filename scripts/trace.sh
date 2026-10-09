#!/usr/bin/env bash
# trace.sh — show what Claude Code did in its most recent session for THIS project:
# the tools it called (with arguments), the results, and per-turn token usage.
#
# Usage:
#   ./scripts/trace.sh                 # most recent session in the current project
#   ./scripts/trace.sh /path/to/proj   # most recent session for another project dir
#   ./scripts/trace.sh --file X.jsonl  # a specific transcript file
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required: brew install jq" >&2; exit 1
fi

if [[ "${1:-}" == "--file" ]]; then
  FILE="${2:?path to .jsonl}"
else
  PROJDIR="${1:-$PWD}"
  # Claude stores transcripts under ~/.claude/projects/<cwd-with-slashes-as-dashes>/
  KEY="$(echo "$PROJDIR" | sed 's#/#-#g')"
  BASE="$HOME/.claude/projects/$KEY"
  if [[ ! -d "$BASE" ]]; then
    echo "No transcripts found for $PROJDIR (looked in $BASE)" >&2; exit 1
  fi
  FILE="$(ls -t "$BASE"/*.jsonl 2>/dev/null | head -1 || true)"
  [[ -n "$FILE" ]] || { echo "No .jsonl sessions in $BASE" >&2; exit 1; }
fi

echo "== transcript: $FILE =="
echo
echo "== TOOL CALLS (name + input) =="
jq -rc 'select(.message.content) | .message.content[]?
        | select(.type=="tool_use") | {tool:.name, input:.input}' "$FILE" || true
echo
echo "== TOKEN USAGE per assistant turn =="
jq -rc 'select(.message.usage) | .message.usage' "$FILE" || true
echo
echo "(for full tool results: jq -rc 'select(.message.content)|.message.content[]?|select(.type==\"tool_result\")|.content' \"$FILE\")"
