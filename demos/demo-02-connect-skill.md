# Demo 02 — Connect via Skill

**Goal:** same result as demo 01, but through the Skill bridge — and *feel the difference*.
**Time:** ~5 min. **Bridge:** Skill (`caido-mode`).

Full reference: [`../docs/02-setup-skill.md`](../docs/02-setup-skill.md). This file is self-contained.

## Step 0 — Node 24 via nvm (the skill wants Node ≥ 24)

Check your version first:
```bash
node -v
```
If it's below 24 (or `node` isn't found), install Node 24 with nvm.

**If `nvm` itself is missing** (`zsh: command not found: nvm`), install and load it. On macOS with Homebrew:
```bash
brew install nvm
mkdir -p ~/.nvm
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
```
> `nvm` is a **shell function**, not a binary — it only exists after you `source` `nvm.sh` in an
> interactive shell. `brew install nvm` alone does **not** make `nvm` available.

Make it load in every new terminal — add to `~/.zshrc`:
```bash
cat >> ~/.zshrc <<'EOF'

export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
EOF
```
Then open a new terminal (or `source ~/.zshrc`).

**Install and select Node 24:**
```bash
nvm install 24
nvm use 24
node -v        # expect v24.x
```
(Not on macOS/Homebrew? Install nvm per https://github.com/nvm-sh/nvm#installing-and-updating, or use
your package manager to get Node 24 another way.)

## Steps

```bash
# 1. install the Caido skills (drops them under .agents/skills/)
cd ~/path/to/your/workshop
pnpm dlx skills add caido/skills --skill='*'

# 2. install the CLI's deps (MUST be on Node 24 — re-run if you just switched)
cd .agents/skills/caido-mode && npm i

# 3. authenticate with a PAT (NOT the MCP access token)
export CAIDO_URL=http://localhost:8080
export CAIDO_PAT=caido_...        # Caido → Developer → Personal Access Tokens → New
npx tsx caido-client.ts auth-status
npx tsx caido-client.ts health
```

## Test

Run `claude` from a folder where `.agents/skills/` is visible:
```
What caido projects do I have
```

## What "success" looks like

Claude runs `caido-client.ts projects` (a **shell command**), not a `caido_*` tool call. Same answer,
different mechanism.

## Debug (when a step fails)

| Symptom | Cause | Fix |
|---------|-------|-----|
| `zsh: command not found: nvm` | nvm installed but not sourced | run the `export NVM_DIR …` + `. nvm.sh` block above (it's a shell function) |
| `nvm: version "24" not found` | not installed yet | `nvm install 24` before `nvm use 24` |
| `tsx`/`npm i` errors (ERR_UNSUPPORTED, engine) | running on old Node | `nvm use 24`, then **re-run `npm i`** in `.agents/skills/caido-mode` |
| `auth-status` → not authenticated / invalid token | used the MCP **access token** instead of a **PAT**, or wrong host/port | create a PAT (Caido → Developer → PAT), `export CAIDO_PAT=caido_…`, use `localhost:8080` |
| `CAIDO_PAT is not set` | env var missing in this shell | `export CAIDO_PAT=caido_…` (env vars don't persist across new terminals) |
| `health` → connection refused / ECONNREFUSED | Caido not running, or wrong port | start Caido; confirm `curl -s http://localhost:8080/health` returns `ready:true`; match the port |
| Claude in the REPL doesn't use the skill | launched `claude` from a folder with no `.agents/skills/` | `cd` to the folder that has `.agents/skills/`, then `claude` |
| Skill *and* MCP both fire / mixed | both bridges active | for a clean skill-only run, `claude mcp remove caido` first (see demo 03) |

Quick manual checks:
```bash
node -v                                   # must be v24.x
command -v nvm && echo "nvm loaded"       # confirms nvm is sourced
curl -s http://localhost:8080/health      # Caido reachable?
npx tsx caido-client.ts auth-status       # skill authenticated?
```

## Talk track

"Notice what we did NOT do: no compiled server, no `mcp add`. A skill is a markdown instruction file
plus a CLI the model runs in the shell. That's the whole contrast — and in the next demo we'll measure
why it's usually cheaper."
