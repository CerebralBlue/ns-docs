#!/usr/bin/env bash
# PreToolUse policy for the NeuralSeek MCP (mcp__neuralseek-node__*).
#
# `mcpns` targets whatever instance `.neuralseekrc.json` names. The pipeline may use ONE — the
# playground in _private/agentic-v2/instances.json — and on it every tool is allowed (seek,
# run/upload/create agents, config export…), because documentation needs to run things to
# describe their output. Two exceptions:
#   - the rc points anywhere else (a locked/production id, another instance, nothing) → every
#     tool is denied;
#   - delete_agent is allowed only for agents the pipeline created (the `agentPrefix`).
# Every run/write tool is appended to the current run's spend.log (an audit line, not a bill —
# the playground's token limit is unknown; the agents are told to keep probes small).
# Runs for every caller. Fails closed.
set -euo pipefail
trap 'jq -n --arg r "mcp-policy.sh hit an internal error on ${TOOL:-?} — denied by default" '"'"'{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'"'"'; exit 0' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
case "$TOOL" in mcp__neuralseek-node__*) ;; *) exit 0 ;; esac
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // "main"')
V2="$ROOT/_private/agentic-v2"
RUN_ID=$(cat "$V2/current-run" 2>/dev/null || true)
LOG="$V2/${RUN_ID:+runs/$RUN_ID/}denials.log"
SPEND="$V2/${RUN_ID:+runs/$RUN_ID/}spend.log"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG"
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
	exit 0
}

INST="$V2/instances.json"
[ -f "$INST" ] || deny "no $INST — the pipeline needs {host, playground, locked[], agentPrefix} before the MCP may be used"
PLAY=$(jq -r '.playground' "$INST")
PREFIX=$(jq -r '.agentPrefix // "docs-"' "$INST")
RC="$ROOT/.neuralseekrc.json"
[ -f "$RC" ] || deny "no .neuralseekrc.json — the MCP has no instance"
RC_ID=$(jq -r '.baseUrl // ""' "$RC" | sed -nE 's#.*/([0-9a-f]{24})/?$#\1#p')
[ "$RC_ID" = "$PLAY" ] || deny ".neuralseekrc.json points the MCP at '${RC_ID:-unknown}', not the playground $PLAY — every tool is refused until it does"

case "$TOOL" in
	mcp__neuralseek-node__delete_agent)
		NAMES=$(printf '%s' "$INPUT" | jq -r '[.tool_input.name // empty, (.tool_input.names // [])[]] | .[]')
		[ -n "$NAMES" ] || deny "delete_agent without a name"
		while IFS= read -r N; do
			case "$N" in "$PREFIX"*) ;; *) deny "delete_agent refused for '$N' — only agents named ${PREFIX}* (created by the pipeline) may be deleted" ;; esac
		done <<<"$NAMES"
		;;
esac

case "$TOOL" in
	mcp__neuralseek-node__seek | mcp__neuralseek-node__call_agent | mcp__neuralseek-node__run_agent | \
	mcp__neuralseek-node__run_agent_stream | mcp__neuralseek-node__upload_agent | mcp__neuralseek-node__create_agent | \
	mcp__neuralseek-node__delete_agent | mcp__neuralseek-node__generate_ntl | mcp__neuralseek-node__sync_agents)
		WHAT=$(printf '%s' "$INPUT" | jq -r '.tool_input | tostring' | cut -c1-160)
		mkdir -p "$(dirname "$SPEND")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "${TOOL#mcp__neuralseek-node__}" "$WHAT" >>"$SPEND"
		;;
esac

exit 0
