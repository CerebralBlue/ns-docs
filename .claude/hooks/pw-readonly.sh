#!/usr/bin/env bash
# PreToolUse guard for the Playwright MCP (mcp__neuralseek-ui__browser_*).
#
# The browser it drives is logged into a PRODUCTION NeuralSeek console. This hook is the
# only thing between an agent and a write on that instance, so it runs for every caller —
# subagents and the main session alike. It allows navigation, reading and screenshots and
# denies anything that can change state. Stdin is the hook JSON; a deny is printed as JSON
# with exit 0 (per code.claude.com/docs/en/hooks); silence + exit 0 means "no opinion".
set -euo pipefail
# Fail closed: an unexpected error in this script must deny, never fall through to "allowed".
trap 'jq -n --arg r "pw-readonly.sh hit an internal error on $TOOL — denied by default" '"'"'{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'"'"'; exit 0' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}

# Every denial is also appended to the current run's denials.log (or a global one when no
# run is active) — the pipeline's circuit breaker counts them per agent.
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
RUN_ID=$(cat "$ROOT/_private/agentic-v2/current-run" 2>/dev/null || true)
LOG="$ROOT/_private/agentic-v2/${RUN_ID:+runs/$RUN_ID/}denials.log"
deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG"
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
	exit 0
}
COMMIT_VERBS='\b(save|run|submit|delete|remove|apply|update|test|send|generate|regenerate|upload|merge|train|enhance|import|export|reset|clear|confirm|ok|yes|create|add|edit|publish|deploy|start|stop|execute|sign out|log ?out)\b'

case "$TOOL" in
	# Anything that types, submits, runs script or answers a dialog: never.
	mcp__neuralseek-ui__browser_evaluate | \
	mcp__neuralseek-ui__browser_run_code_unsafe | \
	mcp__neuralseek-ui__browser_fill_form | \
	mcp__neuralseek-ui__browser_type | \
	mcp__neuralseek-ui__browser_select_option | \
	mcp__neuralseek-ui__browser_press_key | \
	mcp__neuralseek-ui__browser_file_upload | \
	mcp__neuralseek-ui__browser_drag | \
	mcp__neuralseek-ui__browser_drop | \
	mcp__neuralseek-ui__browser_handle_dialog | \
	mcp__neuralseek-ui__browser_network_request)
		deny "read-only console: $TOOL can change state on a production instance"
		;;

	# Clicks are allowed only on things that open or reveal, never on things that commit.
	# Two checks: the agent's own description of the element, AND the element's accessible
	# name as recorded in the most recent SAVED snapshot for that ref — so "the blue control"
	# with a Save button's ref is still refused. No saved snapshot containing the ref = no
	# click: every click on production is preceded by evidence of what was on screen.
	mcp__neuralseek-ui__browser_click | mcp__neuralseek-ui__browser_hover)
		EL=$(printf '%s' "$INPUT" | jq -r '(.tool_input.element // "") + " " + (.tool_input.target // "")')
		REF=$(printf '%s' "$INPUT" | jq -r '.tool_input.ref // ""')
		[ -n "$REF" ] || deny "read-only console: a click needs a ref from a saved snapshot"
		SNAP=$(find "$ROOT/_private/tools/playwright/output" "$ROOT/_private/agentic-v2/runs" -name '*.yml' -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2- || true)
		NODE=$(grep -m1 -F "[ref=$REF]" "${SNAP:-/dev/null}" 2>/dev/null || true)
		[ -n "$NODE" ] || deny "read-only console: ref $REF is not in the latest saved snapshot ($(basename "${SNAP:-none}")) — snapshot to a file first, then click"
		ROLE=$(printf '%s' "$NODE" | sed -nE 's/^\s*-\s*([a-z]+).*$/\1/p')
		NAME=$(printf '%s' "$NODE" | sed -nE 's/^[^"]*"([^"]*)".*$/\1/p')
		# A link navigates; navigation is fenced by host, not by verb ("Run Agents" is a nav item).
		if [ "$ROLE" != "link" ]; then
			if printf '%s' "$NAME" | grep -Eiq "$COMMIT_VERBS"; then
				deny "read-only console: ref $REF resolves to $ROLE \"$NAME\" in the saved snapshot — a control that commits an action"
			fi
			if printf '%s' "$EL" | grep -Eiq "$COMMIT_VERBS"; then
				deny "read-only console: refusing to click a control described as committing an action ($EL)"
			fi
		fi
		;;


	# Only the product console and the public docs. Nothing else, ever.
	mcp__neuralseek-ui__browser_navigate)
		URL=$(printf '%s' "$INPUT" | jq -r '.tool_input.url // ""')
		HOST=$(printf '%s' "$URL" | sed -E 's#^[a-z]+://##; s#[/?].*$##' | tr 'A-Z' 'a-z')
		case "$HOST" in
			console-partners.neuralseek.com | partners.neuralseek.com | documentation.neuralseek.com) ;;
			*) deny "navigation limited to the partners console and documentation.neuralseek.com (got '$HOST')" ;;
		esac
		;;

	# Files must land in the two places the pipeline reads from, by absolute path
	# (a relative filename resolves against the repo root and creates no folders).
	mcp__neuralseek-ui__browser_take_screenshot | mcp__neuralseek-ui__browser_snapshot)
		F=$(printf '%s' "$INPUT" | jq -r '.tool_input.filename // ""')
		if [ -n "$F" ]; then
			case "$F" in
				"$ROOT"/public/img/* | "$ROOT"/_private/tools/playwright/output/* | "$ROOT"/_private/agentic-v2/runs/*) ;;
				*) deny "filename must be an absolute path under $ROOT/public/img/, $ROOT/_private/tools/playwright/output/ or $ROOT/_private/agentic-v2/runs/ (got '$F')" ;;
			esac
		fi
		;;
esac

exit 0
