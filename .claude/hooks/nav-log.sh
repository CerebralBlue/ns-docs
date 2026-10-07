#!/usr/bin/env bash
# PostToolUse audit trail for the browser: every navigation, click, hover and keystroke on the
# playground console is appended to the current run's run.log (or a global one when no run is active).
# The pipeline's report reads it; a human can answer "what did the browser do?" from it.
set -euo pipefail

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
RUN_ID=$(cat "$ROOT/_private/agentic-v2/current-run" 2>/dev/null || true)
LOG="$ROOT/_private/agentic-v2/${RUN_ID:+runs/$RUN_ID/}run.log"

# Where the browser REALLY is: the tool result's "Page URL" (a stale session redirects to the partners
# portal, a link can leave the instance). pw-policy.sh judges "on the playground" from this file, so
# a landing anywhere but the playground's console marks the browser off-site until the next navigate.
LANDED=$(printf '%s' "$INPUT" | jq -r '.tool_response | tostring' 2>/dev/null | grep -oE 'Page URL: https?://[^ \\"]+' | tail -1 | sed 's/^Page URL: //' || true)
INST="$ROOT/_private/agentic-v2/instances.json"
if [ -n "$LANDED" ] && [ -f "$INST" ]; then
	HOST=$(printf '%s' "$LANDED" | sed -E 's#^[a-z]+://##; s#[/?].*$##' | tr 'A-Z' 'a-z')
	ID=$(printf '%s' "$LANDED" | sed -nE 's#^[a-z]+://[^/]+/([0-9a-f]{24})(/.*)?$#\1#p')
	if [ "$HOST" = "$(jq -r .host "$INST")" ] && [ "$ID" = "$(jq -r .playground "$INST")" ]; then
		printf '%s\t%s\n' "$ID" "$LANDED" >"$ROOT/_private/agentic-v2/browser-state"
	elif [ "$HOST" = "documentation.neuralseek.com" ]; then
		printf 'docs\t%s\n' "$LANDED" >"$ROOT/_private/agentic-v2/browser-state"
	else
		printf 'offsite\t%s\n' "$LANDED" >"$ROOT/_private/agentic-v2/browser-state"
	fi
fi
case "$TOOL" in
	mcp__neuralseek-ui__browser_navigate)
		WHAT=$(printf '%s' "$INPUT" | jq -r '.tool_input.url // ""') ;;
	mcp__neuralseek-ui__browser_click | mcp__neuralseek-ui__browser_hover)
		WHAT=$(printf '%s' "$INPUT" | jq -r '(.tool_input.element // "") + " [ref=" + (.tool_input.target // .tool_input.ref // "?") + "]"') ;;
	mcp__neuralseek-ui__browser_type | mcp__neuralseek-ui__browser_fill_form | mcp__neuralseek-ui__browser_select_option | mcp__neuralseek-ui__browser_press_key)
		WHAT=$(printf '%s' "$INPUT" | jq -r '.tool_input | tostring' | cut -c1-120) ;;
	mcp__neuralseek-ui__browser_wait_for | mcp__neuralseek-ui__browser_snapshot) exit 0 ;; # state only
	*) exit 0 ;;
esac
mkdir -p "$(dirname "$LOG")" 2>/dev/null
printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "${TOOL#mcp__neuralseek-ui__}" "$WHAT" >>"$LOG"
exit 0
