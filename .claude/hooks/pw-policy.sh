#!/usr/bin/env bash
# PreToolUse policy for the Playwright MCP (mcp__neuralseek-ui__browser_*).
#
# The pipeline drives ONE NeuralSeek instance — the playground named in
# _private/agentic-v2/instances.json — and nothing else. Two callers, two rules:
#   * the MAIN SESSION (agent "main") is supervised by Fabio and by auto mode: on the playground it
#     may type, Save and Roll back named versions (_private/agentic-v2/playground-versions.md);
#     only destructive controls are refused.
#   * the EXPERIMENTER (agentic v3.4) may, only while experiments.ts has armed an experiment for
#     the current run: pick the one declared (control, value), type the declared version name into
#     "Save a new version", and click Save there only if the dialog lists exactly one field beyond
#     the load-normalised ones. The UNDO path — Rollback on the baseline's row, then Ok — is open to
#     the experimenter and cleanup whenever an experiment is pending, with no run or time limit.
#   * every other PIPELINE AGENT only LOOKS: it never commits (Save, Propose Changes, Rollback, Add,
#     Generate Key, OK…), never picks a dropdown option, never flips a checkbox / chip, never types
#     except the area's declared `entry` text, and presses no key but Escape.
# The click decision lives in scripts/agentic/ref-context.ts (it builds a control's real name from
# the snapshot — options and "Propose Changes" have no quoted name) using lib.ts COMMIT_VERBS /
# DESTRUCTIVE / isOpener: one list, one home.
#
#   navigate  → only the playground's console (its id in the path) or documentation.neuralseek.com;
#               a locked id (production) or any other instance is refused. Each allowed navigate
#               records where the browser is in _private/agentic-v2/browser-state.
#   tabs      → list / close only (a `new` tab with a URL would bypass the instance lock).
#   click     → the ref must resolve in the latest FULL saved snapshot; ref-context.ts decides.
#   hover     → the ref must resolve; destructive refused. navigate_back → never.
#   (nav-log.sh, PostToolUse, rewrites browser-state from the page the browser actually landed on.)
#   type / press_key / fill_form / select_option / upload / drag / drop / dialog → playground only;
#               for pipeline agents: type = the area's entry text only, press_key = Escape only,
#               dialogs = dismiss only, the rest never.
#   evaluate / run_code_unsafe / network_request → never (they bypass the audit trail).
#   snapshot/screenshot filename → absolute, under public/img/, tools/playwright/output/ or runs/.
#               A snapshot taken with `target` or `depth` is partial and never counts as click
#               evidence (it lacks the dialog/listbox ancestors ref-context.ts reasons from).
# Runs for every caller. Fails closed — an internal error exits 2 (blocks) without needing jq.
# Every denial is appended to the current run's denials.log.
set -euo pipefail
trap 'echo "pw-policy.sh hit an internal error on ${TOOL:-?} — denied by default" >&2; exit 2' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
V2="$ROOT/_private/agentic-v2"
RUN_ID=$(cat "$V2/current-run" 2>/dev/null || true)
LOG="$V2/${RUN_ID:+runs/$RUN_ID/}denials.log"
STATE="$V2/browser-state"
PARTIAL="$V2/browser-partial-snapshots"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG" || true
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}' || { echo "$1" >&2; exit 2; }
	exit 0
}

case "$TOOL" in mcp__neuralseek-ui__*) ;; *) exit 0 ;; esac

INST="$V2/instances.json"
[ -f "$INST" ] || deny "no $INST — the pipeline needs {host, playground, locked[]} before the browser may be used"
HOST_OK=$(jq -r '.host' "$INST")
PLAY=$(jq -r '.playground' "$INST")
LOCKED=$(jq -r '.locked[]' "$INST" | tr '\n' ' ')
PIPELINE=1
[ "$AGENT" = "main" ] && PIPELINE=0

on_playground() {
	[ -f "$STATE" ] && [ "$(cut -f1 "$STATE")" = "$PLAY" ]
}
need_playground() {
	on_playground || deny "$TOOL is allowed only while the browser is on the playground (state: $(cut -f1 "$STATE" 2>/dev/null || echo unknown)) — navigate there first"
}
# Newest FULL snapshot: the MCP's own page-*.yml after every action, or an explicit filename;
# partial ones (target/depth) are listed in $PARTIAL and skipped.
latest_snapshot() {
	find "$ROOT/_private/tools/playwright/output" "$V2/runs" -name '*.yml' -printf '%T@ %p\n' 2>/dev/null |
		sort -rn | cut -d' ' -f2- | grep -vxF -f <(cat "$PARTIAL" 2>/dev/null; echo '/dev/null/none') | head -1 || true
}
resolve_ref() {
	REF=$(printf '%s' "$INPUT" | jq -r '.tool_input.target // .tool_input.ref // ""')
	[ -n "$REF" ] || deny "a click needs a target ref from a saved snapshot"
	SNAP=$(latest_snapshot)
	[ -n "$SNAP" ] || deny "no saved snapshot yet — snapshot to a file first, then click"
	grep -qF "[ref=$REF]" "$SNAP" || deny "ref $REF is not in the latest full snapshot ($(basename "$SNAP")) — snapshot to a file first, then click"
}

case "$TOOL" in
	mcp__neuralseek-ui__browser_evaluate | \
	mcp__neuralseek-ui__browser_run_code_unsafe | \
	mcp__neuralseek-ui__browser_network_request)
		deny "$TOOL bypasses the audit trail — not allowed on any instance"
		;;

	mcp__neuralseek-ui__browser_navigate_back)
		deny "navigate_back is not allowed — history can hold a page outside the playground; navigate to the area URL"
		;;

	mcp__neuralseek-ui__browser_tabs)
		ACTION=$(printf '%s' "$INPUT" | jq -r '.tool_input.action // ""')
		case "$ACTION" in
			list | close) ;;
			*) deny "browser_tabs '$ACTION' is not allowed — a new or switched tab escapes the playground lock; use browser_navigate" ;;
		esac
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

	mcp__neuralseek-ui__browser_click)
		need_playground
		resolve_ref
		VERDICT=$(bun "$ROOT/scripts/agentic/ref-context.ts" "$SNAP" "$REF" "$AGENT" "$V2" "$RUN_ID")
		[ "$(printf '%s' "$VERDICT" | jq -r '.decision')" = "allow" ] ||
			deny "ref $REF: $(printf '%s' "$VERDICT" | jq -r '.reason') ($(basename "$SNAP"))"
		;;

	mcp__neuralseek-ui__browser_hover)
		need_playground
		resolve_ref
		VERDICT=$(bun "$ROOT/scripts/agentic/ref-context.ts" "$SNAP" "$REF" "main")
		[ "$(printf '%s' "$VERDICT" | jq -r '.decision')" = "allow" ] || deny "hover: $(printf '%s' "$VERDICT" | jq -r '.reason')"
		;;

	mcp__neuralseek-ui__browser_type)
		need_playground
		if [ "$AGENT" = "experimenter" ]; then
			# The experimenter types one thing: its version name, into "Save a new version", no Enter.
			[ "$(printf '%s' "$INPUT" | jq -r '.tool_input.submit // false')" = "false" ] || deny "no submit while typing a version name"
			resolve_ref
			TEXT=$(printf '%s' "$INPUT" | jq -r '.tool_input.text // ""')
			VERDICT=$(bun "$ROOT/scripts/agentic/ref-context.ts" "$SNAP" "$REF" "$AGENT" "$V2" "$RUN_ID" --type "$TEXT")
			[ "$(printf '%s' "$VERDICT" | jq -r '.decision')" = "allow" ] || deny "type: $(printf '%s' "$VERDICT" | jq -r '.reason')"
		elif [ "$PIPELINE" = 1 ]; then
			TEXT=$(printf '%s' "$INPUT" | jq -r '.tool_input.text // ""')
			ENTRY=$(jq -r '.entry.input // empty' "$V2/runs/$RUN_ID/area.json" 2>/dev/null || true)
			[ -n "$ENTRY" ] && [ "$TEXT" = "$ENTRY" ] ||
				deny "pipeline agents type only the area's declared entry text (area.json entry.input); refused: '$(printf '%s' "$TEXT" | head -c 40)'"
		fi
		;;

	mcp__neuralseek-ui__browser_press_key)
		need_playground
		if [ "$PIPELINE" = 1 ]; then
			KEY=$(printf '%s' "$INPUT" | jq -r '.tool_input.key // ""')
			[ "$KEY" = "Escape" ] || deny "pipeline agents press only Escape (arrows/Enter/Space pick dropdown options or submit); refused: '$KEY'"
		fi
		;;

	mcp__neuralseek-ui__browser_handle_dialog)
		need_playground
		if [ "$PIPELINE" = 1 ]; then
			[ "$(printf '%s' "$INPUT" | jq -r '.tool_input.accept // false')" = "false" ] ||
				deny "pipeline agents only dismiss browser dialogs (accept: false)"
		fi
		;;

	mcp__neuralseek-ui__browser_fill_form | \
	mcp__neuralseek-ui__browser_select_option | \
	mcp__neuralseek-ui__browser_file_upload | \
	mcp__neuralseek-ui__browser_drag | \
	mcp__neuralseek-ui__browser_drop)
		need_playground
		[ "$PIPELINE" = 0 ] || deny "$TOOL changes settings or uploads — pipeline agents only look"
		;;

	mcp__neuralseek-ui__browser_take_screenshot | mcp__neuralseek-ui__browser_snapshot)
		F=$(printf '%s' "$INPUT" | jq -r '.tool_input.filename // ""')
		if [ -n "$F" ]; then
			case "$F" in
				"$ROOT"/public/img/* | "$ROOT"/_private/tools/playwright/output/* | "$V2"/runs/*) ;;
				*) deny "filename must be an absolute path under $ROOT/public/img/, $ROOT/_private/tools/playwright/output/ or $V2/runs/ (got '$F')" ;;
			esac
			if [ "$TOOL" = mcp__neuralseek-ui__browser_snapshot ] &&
				printf '%s' "$INPUT" | jq -e '.tool_input.target // .tool_input.depth' >/dev/null; then
				printf '%s\n' "$F" >>"$PARTIAL"
			fi
		fi
		;;
esac

exit 0
