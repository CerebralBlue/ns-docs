#!/usr/bin/env bash
# PreToolUse guard for the NeuralSeek MCP (mcp__neuralseek-node__*).
#
# `.neuralseekrc.json` points that MCP at a PRODUCTION instance. This is an ALLOW-list: only
# tools that read are permitted; anything that saves, deletes, runs or spends an LLM call on
# the instance is refused, for every caller — subagents and the main session alike.
# Stdin is the hook JSON; a deny is printed as JSON with exit 0; silence + exit 0 = allowed.
set -euo pipefail
# Fail closed: an unexpected error in this script must deny, never fall through to "allowed".
trap 'jq -n --arg r "'"$(basename "$0")"' hit an internal error — denied by default" '"'"'{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'"'"'; exit 0' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
RUN_ID=$(cat "$ROOT/_private/agentic-v2/current-run" 2>/dev/null || true)
LOG="$ROOT/_private/agentic-v2/${RUN_ID:+runs/$RUN_ID/}denials.log"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG"
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
	exit 0
}

case "$TOOL" in
	# Reads: config export to a local file, agent listings/sources, run logs, local dependency map.
	mcp__neuralseek-node__backup_instance | \
	mcp__neuralseek-node__list_agents | \
	mcp__neuralseek-node__list_agents_full | \
	mcp__neuralseek-node__get_agent | \
	mcp__neuralseek-node__get_logs | \
	mcp__neuralseek-node__map_agents)
		;;
	# Everything else on this MCP writes, runs, deletes, or spends: seek, call_agent, run_agent,
	# run_agent_stream, upload_agent, delete_agent, create_agent, sync_agents, generate_ntl,
	# replay_run (until proven non-executing) — and any tool added in a future version.
	mcp__neuralseek-node__*)
		deny "read-only instance: $TOOL is not on the allow-list (backup_instance, list_agents, list_agents_full, get_agent, get_logs, map_agents)"
		;;
esac

exit 0
