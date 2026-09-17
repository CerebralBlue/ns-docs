#!/usr/bin/env bash
# PreToolUse policy for the Playwright MCP (mcp__neuralseek-ui__browser_*).
#
# The pipeline drives ONE NeuralSeek instance — the playground named in
# _private/agentic-v2/instances.json — and nothing else. On the playground it may type, submit
# and click (documentation needs to see what things do); off it, nothing. So this is an
# INSTANCE LOCK plus a short destructive-verb list, not a read-only fence:
#   navigate  → only the playground's console (its id in the path) or documentation.neuralseek.com;
#               a locked id (production) or any other instance is refused. Each allowed navigate
#               records where the browser is in _private/agentic-v2/browser-state.
#   click/hover → the ref must resolve in the latest SAVED snapshot (evidence discipline), the
#               browser must be on the playground, and the control's name must not be destructive
#               (delete / remove / purge / erase / reset / clear all / sign out / log out).
#   type/fill/select/press/upload/drag/drop/dialog → allowed only while on the playground.
#   evaluate / run_code_unsafe / network_request → never (they bypass the audit trail).
#   snapshot/screenshot filename → absolute, under public/img/, tools/playwright/output/ or runs/.
# Runs for every caller — subagents and the main session alike. Fails closed. Every denial is
# appended to the current run's denials.log.
set -euo pipefail
trap 'jq -n --arg r "pw-policy.sh hit an internal error on ${TOOL:-?} — denied by default" '"'"'{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'"'"'; exit 0' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
V2="$ROOT/_private/agentic-v2"
RUN_ID=$(cat "$V2/current-run" 2>/dev/null || true)
LOG="$V2/${RUN_ID:+runs/$RUN_ID/}denials.log"
STATE="$V2/browser-state"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG"
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
	exit 0
}

case "$TOOL" in mcp__neuralseek-ui__*) ;; *) exit 0 ;; esac

INST="$V2/instances.json"
[ -f "$INST" ] || deny "no $INST — the pipeline needs {host, playground, locked[]} before the browser may be used"
HOST_OK=$(jq -r '.host' "$INST")
PLAY=$(jq -r '.playground' "$INST")
LOCKED=$(jq -r '.locked[]' "$INST" | tr '\n' ' ')
DESTRUCTIVE='\b(delete|remove|purge|erase|reset|clear all|sign out|log ?out)\b'

on_playground() {
	[ -f "$STATE" ] && [ "$(cut -f1 "$STATE")" = "$PLAY" ]
}

case "$TOOL" in
	mcp__neuralseek-ui__browser_evaluate | \
	mcp__neuralseek-ui__browser_run_code_unsafe | \
	mcp__neuralseek-ui__browser_network_request)
		deny "$TOOL bypasses the audit trail — not allowed on any instance"
		;;

	mcp__neuralseek-ui__browser_navigate)
		URL=$(printf '%s' "$INPUT" | jq -r '.tool_input.url // ""')
		HOST=$(printf '%s' "$URL" | sed -E 's#^[a-z]+://##; s#[/?].*$##' | tr 'A-Z' 'a-z')
		ID=$(printf '%s' "$URL" | sed -nE 's#^[a-z]+://[^/]+/([0-9a-f]{24})(/.*)?$#\1#p')
		if [ "$HOST" = "documentation.neuralseek.com" ]; then
			printf 'docs\t%s\n' "$URL" >"$STATE"
			exit 0
		fi
		[ "$HOST" = "$HOST_OK" ] || deny "navigation limited to the playground on $HOST_OK and documentation.neuralseek.com (got '$HOST')"
		for L in $LOCKED; do [ "$ID" = "$L" ] && deny "instance $ID is LOCKED (production) — the pipeline never touches it"; done
		[ "$ID" = "$PLAY" ] || deny "only the playground instance $PLAY may be opened (got '${ID:-no instance id in the path}')"
		printf '%s\t%s\n' "$ID" "$URL" >"$STATE"
		;;

	mcp__neuralseek-ui__browser_click | mcp__neuralseek-ui__browser_hover)
		on_playground || deny "the browser is not on the playground (state: $(cat "$STATE" 2>/dev/null | cut -f1 || echo unknown)) — navigate there first"
		# Playwright MCP 0.0.80 calls the ref `target` ("Exact target element reference from the
		# page snapshot"); older builds called it `ref`. Accept both.
		REF=$(printf '%s' "$INPUT" | jq -r '.tool_input.target // .tool_input.ref // ""')
		[ -n "$REF" ] || deny "a click needs a target ref from a saved snapshot"
		SNAP=$(find "$ROOT/_private/tools/playwright/output" "$V2/runs" -name '*.yml' -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2- || true)
		NODE=$(grep -m1 -F "[ref=$REF]" "${SNAP:-/dev/null}" 2>/dev/null || true)
		[ -n "$NODE" ] || deny "ref $REF is not in the latest saved snapshot ($(basename "${SNAP:-none}")) — snapshot to a file first, then click"
		NAME=$(printf '%s' "$NODE" | sed -nE 's/^[^"]*"([^"]*)".*$/\1/p')
		if printf '%s' "$NAME" | grep -Eiq "$DESTRUCTIVE"; then
			deny "ref $REF resolves to \"$NAME\" — destructive controls are never clicked; document them from the screen"
		fi
		;;

	mcp__neuralseek-ui__browser_type | \
	mcp__neuralseek-ui__browser_fill_form | \
	mcp__neuralseek-ui__browser_select_option | \
	mcp__neuralseek-ui__browser_press_key | \
	mcp__neuralseek-ui__browser_file_upload | \
	mcp__neuralseek-ui__browser_drag | \
	mcp__neuralseek-ui__browser_drop | \
	mcp__neuralseek-ui__browser_handle_dialog)
		on_playground || deny "$TOOL is allowed only while the browser is on the playground (state: $(cat "$STATE" 2>/dev/null | cut -f1 || echo unknown))"
		;;

	mcp__neuralseek-ui__browser_take_screenshot | mcp__neuralseek-ui__browser_snapshot)
		F=$(printf '%s' "$INPUT" | jq -r '.tool_input.filename // ""')
		if [ -n "$F" ]; then
			case "$F" in
				"$ROOT"/public/img/* | "$ROOT"/_private/tools/playwright/output/* | "$V2"/runs/*) ;;
				*) deny "filename must be an absolute path under $ROOT/public/img/, $ROOT/_private/tools/playwright/output/ or $V2/runs/ (got '$F')" ;;
			esac
		fi
		;;
esac

exit 0
