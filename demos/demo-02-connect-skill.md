# Demo 02 — Connect via Skill

**Goal:** same result as demo 01, but through the Skill bridge — and *feel the difference*.
**Time:** ~5 min. **Bridge:** Skill (`caido-mode`).

## Steps

Full setup in [`../docs/02-setup-skill.md`](../docs/02-setup-skill.md). Short version:

```bash
nvm use 24                                   # skill wants Node >= 24
cd ~/path/to/your/workshop
pnpm dlx skills add caido/skills --skill='*'
cd .agents/skills/caido-mode && npm i

export CAIDO_URL=http://localhost:8080
export CAIDO_PAT=caido_...                    # from Caido → Developer → PAT
npx tsx caido-client.ts auth-status
```

## Test

Run `claude` from a folder where `.agents/skills/` is visible:
```
What caido projects do I have
```

## What "success" looks like

Claude runs `caido-client.ts projects` (a **shell command**), not a `caido_*` tool call. Same answer,
different mechanism.

## Talk track

"Notice what we did NOT do: no compiled server, no `mcp add`. A skill is a markdown instruction file
plus a CLI the model runs in the shell. That's the whole contrast — and in the next demo we'll measure
why it's usually cheaper."
