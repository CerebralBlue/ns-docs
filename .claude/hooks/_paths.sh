# Sourced by the hooks, never run on its own. On Windows (Git Bash) Claude Code hands a hook
# the same path in three spellings — C:\Users\…, c:/Users/…, /c/Users/… — and the fences
# compare paths as strings, so an agent writing inside its own folder was refused. Every path
# is folded to one spelling: forward slashes, lowercase drive letter, `c:/…`.
# Off Windows every function is the identity, so Linux/macOS behaviour is unchanged.
case "$(uname -s)" in MINGW* | MSYS* | CYGWIN*) NS_WIN=1 ;; *) NS_WIN= ;; esac

# One path.
norm_path() {
	local p=$1
	[ -n "$NS_WIN" ] || {
		printf '%s' "$p"
		return
	}
	p=${p//\\//}
	case "$p" in /[A-Za-z]/*) p="${p:1:1}:${p:2}" ;; esac
	case "$p" in [A-Za-z]:/*) p="$(printf '%s' "${p:0:1}" | tr 'A-Z' 'a-z')${p:1}" ;; esac
	printf '%s' "$p"
}

# Every path inside a command line (bash-policy's run-from-root prefix check).
norm_cmd() {
	[ -n "$NS_WIN" ] || {
		printf '%s' "$1"
		return
	}
	printf '%s' "$1" | sed -E 's#\\#/#g; s#(^|[[:space:]"'\''=])/([A-Za-z])/#\1\2:/#g; s#([A-Za-z]):/#\L\1:/#g'
}

# Absolute on either platform.
is_abs() {
	case "$1" in /* | [A-Za-z]:/*) return 0 ;; esac
	return 1
}
