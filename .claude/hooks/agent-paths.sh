#!/usr/bin/env bash
# PreToolUse guard on Edit / Write / MultiEdit for the docs-explore pipeline's agents.
#
# Each agent may write only where its role says. Nothing here fences the main session or
# agents outside the pipeline. The map (`scripts/migration-map.json`) is writable by the
# ia-agent alone; `scripts/`, `.claude/`, `public/` are off-limits to every agent (the
# explorer's screenshots arrive through the browser hook, not an editor).
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
	explorer | understand | runner | config-export | consistency)
		case "$FILE" in
			"$RUNS"/* | "$ROOT"/_private/component-map/* | "$ROOT"/_private/tools/playwright/output/* | "$ROOT"/_private/agentic-v2/night/*) exit 0 ;;
		esac
		deny "$AGENT may only write under _private/agentic-v2/runs/, _private/agentic-v2/night/ and _private/component-map/; refused: $FILE"
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
	doc-reviewer)
		case "$FILE" in
			"$RUNS"/*) exit 0 ;;
		esac
		deny "doc-reviewer is read-only except its run folder; refused: $FILE"
		;;
	*) exit 0 ;;
esac
