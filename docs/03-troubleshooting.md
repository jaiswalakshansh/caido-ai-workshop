# 03 — Troubleshooting (every error we actually hit)

## MCP connection errors (`claude mcp list` shows ✘)

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ENOENT ... posix_spawn '/ABS/PATH/...'` | You left the placeholder `/ABS/PATH/` in the command | Use the real absolute path to the binary |
| `EACCES ... posix_spawn` | Path points at the **folder**, not the binary inside it | `/path/caido-mcp-server/caido-mcp-server serve` (folder **and** binary) |
| `CONNECTION_CLOSED: Connection closed` (wrong port) | `CAIDO_URL` port has nothing listening | Use the port where `curl http://localhost:<port>/health` returns `ready:true` (often `8080`, not the slides' `8082`) |
| `CONNECTION_CLOSED` (auth) | Token hostname ≠ config hostname | Use **`localhost`** everywhere, or `login --url` with the exact host you configured |
| `no authentication token found for http://...` | Never logged in for that URL, or host/port mismatch | `./caido-mcp-server login --url http://localhost:8080` |

**The universal MCP debug move:** run the server by hand to see the real error that `mcp list` hides:
```bash
CAIDO_URL=http://localhost:8080 /ABSOLUTE/PATH/TO/caido-mcp-server serve
```

## "It answered, but didn't use Caido"

Claude read Caido's SQLite files on disk with `sqlite3`/`ls` instead of calling the bridge. Almost
always because the MCP was registered at **local** scope (one folder) and you ran `claude` elsewhere.

Fix: register at **user** scope so it's global:
```bash
claude mcp remove caido
claude mcp add caido -s user -e CAIDO_URL=http://localhost:8080 -- /ABS/PATH/caido-mcp-server serve
```
Verify with `/mcp` inside Claude and look for `caido_*` tool-call chips.

Check which scope a server is in:
```bash
python3 - <<'PY'
import json,os
d=json.load(open(os.path.expanduser('~/.claude.json')))
print("USER scope:", list(d.get('mcpServers',{}).keys()))
for p,c in d.get('projects',{}).items():
    if c.get('mcpServers'): print("PROJECT", p, "->", list(c['mcpServers'].keys()))
PY
```

## Node / nvm

| Symptom | Fix |
|---------|-----|
| `zsh: command not found: nvm` after `brew install nvm` | nvm is a shell function — `source` it: `export NVM_DIR="$HOME/.nvm"; . /opt/homebrew/opt/nvm/nvm.sh` |
| Skill CLI crashes on an old Node | `nvm use 24`, then re-run `npm i` in the skill's dir |

## Skill / PAT

| Symptom | Fix |
|---------|-----|
| `auth-status` fails | You used the MCP access token, not a **PAT**; or wrong port/host |
| `CAIDO_PAT is not set` | `export CAIDO_PAT=caido_...` |
| `QuickSSRF is not installed` | Install the plugin: Caido → Plugins → Store → QuickSSRF |
| `createSession failed` | OAST provider disabled/unreachable → `--provider-kind interactsh` |

## Secrets hygiene

- A PAT pasted into a Claude prompt is now in the **transcript** and may be cached to
  `scripts/.caido-token.json` or `~/.claude/config/secrets.json`. If that happens, **rotate the PAT**
  in Caido.
- This repo's `.gitignore` blocks `*.caido-token.json`, `secrets.json`, `.env`. Still run
  `git status` before committing and never `git add -f` a secret.

## Caido reachability

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080        # expect 200
lsof -nP -iTCP -sTCP:LISTEN | grep -i caido                           # what port Caido listens on
```
In Caido, the UI, GraphQL API, and the intercepting proxy all share the same port (e.g. 8080).
