#!/usr/bin/env bash
# PostToolUse audit trail for the browser: every navigation, click and hover on the production
# console is appended to the current run's run.log (or a global one when no run is active).
# The pipeline's report reads it; a human can answer "what did the browser do?" from it.
set -euo pipefail

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
RUN_ID=$(cat "$ROOT/_private/agentic-v2/current-run" 2>/dev/null || true)
LOG="$ROOT/_private/agentic-v2/${RUN_ID:+runs/$RUN_ID/}run.log"

case "$TOOL" in
	mcp__neuralseek-ui__browser_navigate)
		WHAT=$(printf '%s' "$INPUT" | jq -r '.tool_input.url // ""') ;;
	mcp__neuralseek-ui__browser_click | mcp__neuralseek-ui__browser_hover)
		WHAT=$(printf '%s' "$INPUT" | jq -r '(.tool_input.element // "") + " [ref=" + (.tool_input.ref // "?") + "]"') ;;
	*) exit 0 ;;
esac
mkdir -p "$(dirname "$LOG")" 2>/dev/null
printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "${TOOL#mcp__neuralseek-ui__}" "$WHAT" >>"$LOG"
exit 0
