#!/usr/bin/env bash
# PreToolUse guard on Bash for the docs-explore pipeline's named agents (agentic v3.1).
#
# An agent's `tools:` line lists Bash prefixes such as `Bash(bun scripts/doc-lint.ts *)`, but
# that list is a permission hint, not a fence: on the first v3 run the writer authored its page
# with `cat > … <<'EOF'` and patched it with `python3` heredocs, which bypassed agent-paths.sh
# (Edit/Write only) and left no file-level audit trail. This hook makes the frontmatter list
# the law for the pipeline's agents: the command must start with one of the agent's prefixes
# and must not redirect, pipe into a file, or run an interpreter. Files are written with the
# Write tool and patched with Edit — that is what the denial says.
#
# The main session and the `general-purpose` wrappers are not fenced (they run the pipeline's
# own commands). Fails closed. Denials → the current run's denials.log.
set -euo pipefail
trap 'jq -n --arg r "bash-policy.sh hit an internal error — denied by default" '"'"'{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'"'"'; exit 0' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
[ "$TOOL" = "Bash" ] || exit 0
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // ""')
CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // ""')
ROOT=${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}
V2="$ROOT/_private/agentic-v2"
RUN_ID=$(cat "$V2/current-run" 2>/dev/null || true)
LOG="$V2/${RUN_ID:+runs/$RUN_ID/}denials.log"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG"
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
	exit 0
}

# Allowed prefixes per agent — mirrors each agent's `tools:` frontmatter. Keep in sync.
case "$AGENT" in
	explorer) PREFIXES="bun scripts/agentic/explore-plan.ts|mkdir -p" ;;
	understand | ia-agent | consistency) PREFIXES="" ;;
	runner) PREFIXES="sha1sum" ;;
	writer) PREFIXES="bun scripts/doc-lint.ts|bun scripts/agentic/coverage.ts|bunx prettier --write src/content/docs/" ;;
	doc-reviewer) PREFIXES="bun scripts/doc-lint.ts|bun scripts/agentic/coverage.ts" ;;
	cleanup) PREFIXES="" ;;
	config-export) PREFIXES="bun scripts/agentic/config-slice.ts" ;;
	*) exit 0 ;; # main session, general-purpose wrappers, anything not in the pipeline
esac

# Strip a leading `cd <repo> &&` — agents do that; it is harmless.
BODY=$(printf '%s' "$CMD" | sed -E "s#^cd +[^&;|]+ *(&&|;) *##")
# No writing through the shell, for any pipeline agent.
if printf '%s' "$BODY" | grep -Eq '(^|[^<>])>{1,2}[^>]|<<|\btee\b|\bsed +-i|\bpython3?\b|\bnode +-e\b|\bperl\b|\bawk +.*>|\bmv\b|\bcp\b|\brm\b|\btruncate\b|\bdd\b'; then
	deny "$AGENT writes files with the Write tool and patches them with Edit — not through the shell (refused: $(printf "%s" "$BODY" | head -1 | head -c 80))"
fi
# Only the agent's own prefixes, one command (no chaining into something else).
if [ -z "$PREFIXES" ]; then
	deny "$AGENT has no Bash commands in its tools list — use Read/Grep/Glob/Write/Edit (refused: $(printf '%s' "$BODY" | head -c 80))"
fi
IFS='|' read -r -a LIST <<<"$PREFIXES"
OK=0
for P in "${LIST[@]}"; do
	case "$BODY" in "$P"*) OK=1 ;; esac
done
[ "$OK" = 1 ] || deny "$AGENT may only run: ${PREFIXES//|/ · } (refused: $(printf '%s' "$BODY" | head -c 80))"
if printf '%s' "$BODY" | grep -Eq '(&&|\|\||;|\|)'; then
	# Allow only chaining two allowed commands (e.g. lint && prettier); anything else is refused.
	REST=$(printf '%s' "$BODY" | sed -E 's/^[^&;|]+(&&|;|\|\||\|) *//')
	OK=0
	for P in "${LIST[@]}"; do
		case "$REST" in "$P"*) OK=1 ;; esac
	done
	[ "$OK" = 1 ] || deny "$AGENT may not chain into '$(printf '%s' "$REST" | head -c 60)' — one allowed command at a time"
fi
exit 0
