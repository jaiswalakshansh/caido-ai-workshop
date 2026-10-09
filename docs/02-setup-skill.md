# 02 — Setup: connect Claude Code to Caido via Skills

A skill is a folder (`SKILL.md` + a CLI) the agent drives through the shell. We install the official
`caido-mode` skill, which ships a full-featured `caido-client.ts` CLI.

## Step 0 — Node 24 (the skill wants Node ≥ 24)

If `node -v` is below 24, install it with nvm. On macOS with Homebrew's nvm:
```bash
mkdir -p ~/.nvm
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
nvm install 24 && nvm use 24
node -v
```
Make it stick in new terminals — add to `~/.zshrc`:
```bash
cat >> ~/.zshrc <<'EOF'

export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
EOF
```
> `nvm` is a shell function — it only exists after you source it in an interactive shell. It will not
> work from a non-interactive script.

## Step 1 — install the Caido skills

From your workshop working directory:
```bash
cd ~/path/to/your/workshop
pnpm dlx skills add caido/skills --skill='*'
```
This drops the skills under `.agents/skills/` (the key one is `caido-mode`).

## Step 2 — install the CLI's dependencies

```bash
cd .agents/skills/caido-mode
npm i
```

## Step 3 — get a PAT and authenticate

> The skill uses a **PAT**, *not* the MCP access token. They are different credentials.

Create the PAT: **Caido → Developer → Personal Access Tokens → New** → copy it (starts with `caido_`).

```bash
export CAIDO_URL=http://localhost:8080
export CAIDO_PAT=caido_xxxxxxxxxxxxxxxx     # your real token — never commit it
npx tsx caido-client.ts auth-status
npx tsx caido-client.ts health
```
`auth-status` should list your `localhost:8080` instance as authenticated.

## Step 4 — use the skill from Claude

Run `claude` from a directory where `.agents/skills/` is visible, then:
```
What caido projects do I have
```
✅ Success = Claude runs `caido-client.ts …` **shell commands** (the contrast with MCP's tool calls).

## Where the token caches

`caido-mode` caches the access token to `~/.claude/config/secrets.json`, keyed by instance URL.
Subsequent runs reuse it. **That file holds a secret — never commit it.**

## Common issues

- `auth-status` fails → you used the MCP access token instead of a **PAT**, or wrong port/host.
- Node error on `npm i`/`tsx` → you're not on Node 24 (`nvm use 24`).
- Nothing happens in Claude → you launched `claude` from a folder where `.agents/skills/` isn't present.
