#!/usr/bin/env bash
# bootstrap.sh — preflight check for the workshop. Verifies tools, Caido reachability,
# and reports what still needs doing. It changes nothing.
set -uo pipefail

CAIDO_URL="${CAIDO_URL:-http://localhost:8080}"
ok(){ printf "  \033[32m✔\033[0m %s\n" "$1"; }
no(){ printf "  \033[31mx\033[0m %s\n" "$1"; }
hdr(){ printf "\n== %s ==\n" "$1"; }

hdr "Tooling"
for t in claude go node npm pnpm jq curl git; do
  if command -v "$t" >/dev/null 2>&1; then ok "$t ($($t --version 2>/dev/null | head -1))"; else no "$t missing"; fi
done
if command -v node >/dev/null 2>&1; then
  major="$(node -v | sed 's/v\([0-9]*\).*/\1/')"
  [ "$major" -ge 24 ] 2>/dev/null && ok "node >= 24 (skill ready)" || no "node < 24 — run: nvm install 24 && nvm use 24"
fi

hdr "Caido reachability ($CAIDO_URL)"
code="$(curl -s -o /dev/null -w '%{http_code}' "$CAIDO_URL/health" 2>/dev/null || echo 000)"
if [ "$code" = "200" ]; then ok "Caido responds 200 on $CAIDO_URL"; else no "Caido not reachable on $CAIDO_URL (got $code) — start Caido or fix the port"; fi

hdr "MCP registration"
if command -v claude >/dev/null 2>&1; then
  if claude mcp list 2>/dev/null | grep -q '^caido:'; then
    claude mcp list 2>/dev/null | grep '^caido:' | sed 's/^/  /'
  else
    no "caido MCP not registered — see docs/01-setup-mcp.md"
  fi
fi

hdr "Secrets check (nothing sensitive should be tracked)"
if git -C "$(dirname "$0")/.." rev-parse >/dev/null 2>&1; then
  leak="$(git -C "$(dirname "$0")/.." ls-files | grep -E 'token.*\.json|secrets\.json|\.env$' || true)"
  [ -z "$leak" ] && ok "no token/secret files tracked" || no "TRACKED SECRETS: $leak — remove and rotate!"
fi

hdr "PAT"
[ -n "${CAIDO_PAT:-}" ] && ok "CAIDO_PAT is set (skill ready)" || no "CAIDO_PAT not set — export it for the skill demos"

echo
echo "Next: docs/00-concepts.md → docs/01-setup-mcp.md → docs/02-setup-skill.md → demos/"
