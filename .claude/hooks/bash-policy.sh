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
# Read-only shell (cat, ls, grep, head, jq, git diff…) and `mkdir -p` are allowed for every
# pipeline agent — looking is not writing. The main session and the `general-purpose` wrappers
# are not fenced (they run the pipeline's own commands). Fails closed. Denials → denials.log.
set -euo pipefail
trap 'echo "bash-policy.sh hit an internal error — denied by default" >&2; exit 2' ERR

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')
[ "$TOOL" = "Bash" ] || exit 0
AGENT=$(printf '%s' "$INPUT" | jq -r '.agent_type // ""')
CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // ""')
. "$(dirname "$0")/_paths.sh"
ROOT=$(norm_path "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}")
V2="$ROOT/_private/agentic-v2"
RUN_ID=$(cat "$V2/current-run" 2>/dev/null || true)
LOG="$V2/${RUN_ID:+runs/$RUN_ID/}denials.log"

deny() {
	mkdir -p "$(dirname "$LOG")" 2>/dev/null && printf '%s\t%s\t%s\t%s\n' "$(date -u +%FT%TZ)" "$AGENT" "$TOOL" "$1" >>"$LOG" || true
	jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}' || { echo "$1" >&2; exit 2; }
	exit 0
}

# Allowed prefixes per agent — mirrors each agent's `tools:` frontmatter. Keep in sync.
case "$AGENT" in
	explorer) PREFIXES="bun scripts/agentic/explore-plan.ts |bun scripts/agentic/compose-panel.ts |bun scripts/agentic/verify-restore.ts check |bun scripts/agentic/backlog.ts list|mkdir -p" ;;
	understand | ia-agent | consistency) PREFIXES="" ;;
	runner) PREFIXES="sha1sum|bun scripts/agentic/backlog.ts list" ;;
	writer) PREFIXES="bun scripts/doc-lint.ts|bun scripts/agentic/coverage.ts|bun scripts/agentic/backlog.ts list|bun scripts/agentic/neighbours.ts|bunx prettier --write src/content/docs/" ;;
	image-reviewer) PREFIXES="bun scripts/agentic/image-check.ts|bun scripts/agentic/library.ts find" ;;
	doc-reviewer) PREFIXES="bun scripts/doc-lint.ts|bun scripts/agentic/coverage.ts|bun scripts/agentic/neighbours.ts" ;;
	cleanup) PREFIXES="bun scripts/agentic/verify-restore.ts check " ;;
	experimenter) PREFIXES="bun scripts/agentic/experiments.ts on |bun scripts/agentic/experiments.ts saved |bun scripts/agentic/experiments.ts off |bun scripts/agentic/verify-restore.ts check |mkdir -p" ;;
	config-export) PREFIXES="bun scripts/agentic/config-slice.ts" ;;
	*) exit 0 ;; # main session, general-purpose wrappers, anything not in the pipeline
esac

# Strip a leading `cd <repo> &&` — agents do that; it is harmless.
BODY=$(printf '%s' "$CMD" | sed -E "s#^cd +[^&;|]+ *(&&|;) *##")
# Leading VAR=value assignments are harmless; drop them before matching prefixes.
BODY=$(printf '%s' "$BODY" | sed -E 's#^([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]+[[:space:]]+)+##')
# Redirections that do not write a file are fine: 2>&1, >/dev/null, 2>/dev/null. Text inside
# quotes is data (a grep pattern with | or >), not shell — blank it before looking for writes
# and chains, but keep the quotes so a heredoc/redirect outside them is still seen.
CLEAN=$(printf '%s' "$BODY" | sed -E "s#'[^']*'#''#g; s#\"[^\"]*\"#\"\"#g" | sed -E 's#[0-9]?>&[0-9]##g; s#[0-9]?>>?[[:space:]]*/dev/null##g')
# No writing through the shell, for any pipeline agent.
if printf '%s' "$CLEAN" | grep -Eq '(^|[^<>|])>{1,2}[^>]|<<|\btee\b|\bsed +-i|\bpython3?\b|\bnode +-e\b|\bperl\b|\bmv\b|\bcp\b|\brm\b|\btruncate\b|\bdd\b|\bchmod\b|\bgit +(add|commit|checkout|reset|push|stash|rm|mv)\b'; then
	deny "$AGENT writes files with the Write tool and patches them with Edit — not through the shell (refused: $(printf '%s' "$BODY" | head -1 | head -c 80))"
fi
# Writes that hide from the check above: `sed -E -i` (the -i after another flag), awk writing or
# shelling out from INSIDE its quoted program, and find's own writers. Checked on the raw command.
# sed: only `sed -n 'N,Mp'` (a line range) — its w/W/e/r commands write files or run shells.
if printf '%s' "$BODY" | grep -Eq '\bsed\b' &&
	printf '%s' "$BODY" | grep -Eo '\bsed\b[^|;&]*' | grep -Evq "^sed -n '?[0-9]+(,[0-9$]+)?p'?( |$)"; then
	deny "$AGENT may read lines with sed -n 'N,Mp' only (refused: $(printf '%s' "$BODY" | head -1 | head -c 80))"
fi
if printf '%s' "$BODY" | grep -Eq '\bxargs\b'; then
	deny "$AGENT may not use xargs (it runs arbitrary commands)"
fi
if printf '%s' "$BODY" | grep -Eq '\bsed\b[^|;&]*[[:space:]]-[a-zA-Z]*i|\bawk\b.*(>|\bsystem[[:space:]]*\(|\|[[:space:]]*"|\bgetline\b)|\bfind\b.*[[:space:]]-(delete|exec|execdir|ok|okdir|fprint|fprintf|fls)\b'; then
	deny "$AGENT writes files with the Write tool and patches them with Edit — not through sed -i, awk or find (refused: $(printf '%s' "$BODY" | head -1 | head -c 80))"
fi
# Read-only shell is allowed for every pipeline agent (looking is not writing), plus mkdir -p.
READONLY='cat|ls|find|grep|rg|head|tail|wc|jq|sha1sum|sort|uniq|cut|tr|diff|stat|test|echo|printf|file|realpath|basename|dirname|date|true|mkdir -p|sed -n|awk|git diff|git status|git log|git show|bun scripts/agentic/values.ts|bun scripts/agentic/coverage.ts|bun scripts/doc-lint.ts'
allowed_segment() {
	local SEG
	SEG=$(printf '%s' "$1" | sed -E 's/^[[:space:]]+//')
	[ -z "$SEG" ] && return 0
	if printf '%s' "$SEG" | grep -Eq "^($READONLY)( |$)"; then return 0; fi
	if [ -n "$PREFIXES" ]; then
		local P REL
		REL=$(norm_cmd "$SEG" | sed -E "s#$ROOT/##g")
		IFS='|' read -r -a LIST <<<"$PREFIXES"
		for P in "${LIST[@]}"; do case "$SEG" in "$P"*) return 0 ;; esac; case "$REL" in "$P"*) return 0 ;; esac; done
	fi
	return 1
}
# Every segment of a chain (&&, ;, ||, |) must be read-only or one of the agent's prefixes.
REST="$CLEAN"
while [ -n "$REST" ]; do
	SEG=$(printf '%s' "$REST" | sed -E 's/(&&|\|\||;|\|).*$//')
	allowed_segment "$SEG" || deny "$AGENT may only run read-only shell (cat, ls, grep, head, jq…)${PREFIXES:+ and: ${PREFIXES//|/ · }} (refused: $(printf '%s' "$SEG" | head -1 | head -c 80))"
	NEXT=$(printf '%s' "$REST" | sed -E 's/^[^&;|]*(&&|\|\||;|\|)//')
	[ "$NEXT" = "$REST" ] && break
	REST="$NEXT"
done
exit 0
