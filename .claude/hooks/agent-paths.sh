#!/usr/bin/env bash
# PreToolUse guard on Edit / Write / MultiEdit for the docs-verify pipeline's agents.
#
# Each agent may write only where its role says. Nothing here fences the main session or
# agents outside the pipeline. The map (`scripts/migration-map.json`) is writable by the
# ia-agent alone; `scripts/`, `.claude/`, `public/` are off-limits to every agent (the
# verifier's screenshots arrive through the browser hook, not an editor).
set -euo pipefail
# Fail closed: an unexpected error in this script must deny, never fall through to "allowed".
trap 'jq -n --arg r "'"$(basename "$0")"' hit an internal error — denied by default" '"'"'{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'"'"'; exit 0' ERR

INPUT=$(cat)
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // ""')
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // ""')
case "$FILE" in
	/*) ;;
	*) FILE="$ROOT/$FILE" ;;
esac
RUN_ID=$(cat "$ROOT/_private/agentic-v2/current-run" 2>/dev/null || true)
RUNS="$ROOT/_private/agentic-v2/runs"
LOG="$ROOT/_private/agentic-v2/${RUN_ID:+runs/$RUN_ID/}denials.log"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG"
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
	exit 0
}

case "$AGENT" in
	docs-agent | map-agent | verifier | config-export)
		case "$FILE" in
			"$RUNS"/* | "$ROOT"/_private/component-map/* | "$ROOT"/_private/tools/playwright/output/*) exit 0 ;;
		esac
		deny "$AGENT may only write under _private/agentic-v2/runs/ and _private/component-map/; refused: $FILE"
		;;
	writer)
		case "$FILE" in
			"$RUNS"/* | "$ROOT"/src/content/docs/*) exit 0 ;;
		esac
		deny "writer may only edit pages under src/content/docs/ and its run folder; refused: $FILE"
		;;
	ia-agent)
		case "$FILE" in
			"$RUNS"/* | "$ROOT"/astro.config.mjs | "$ROOT"/scripts/migration-map.json | "$ROOT"/src/content/docs/*) exit 0 ;;
		esac
		deny "ia-agent may only edit astro.config.mjs, scripts/migration-map.json, new stub pages and its run folder; refused: $FILE"
		;;
	designer)
		case "$FILE" in
			"$RUNS"/* | "$ROOT"/_private/agentic-v2/designs/* | "$ROOT"/src/plugins/* | "$ROOT"/src/components/* | "$ROOT"/src/styles/* | "$ROOT"/src/content/docs/directives-test.md) exit 0 ;;
		esac
		deny "designer may only edit src/plugins, src/components, src/styles, directives-test.md, _private/agentic-v2/designs/ and its run folder; refused: $FILE"
		;;
	doc-reviewer)
		case "$FILE" in
			"$RUNS"/*) exit 0 ;;
		esac
		deny "doc-reviewer is read-only except its run folder; refused: $FILE"
		;;
	*) exit 0 ;;
esac
