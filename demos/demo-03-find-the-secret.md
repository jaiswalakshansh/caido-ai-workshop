# Demo 03 — Find the secret (run it BOTH ways, compare cost)

**Goal:** AI reasons over your captured traffic to find a planted secret — then run the *same task*
through **MCP** and through the **Skill** and compare token cost with `/cost`.
**Time:** ~5 min. **Targets:** secrets/tokens leaking in traffic.

> Why isolate? Once both bridges are installed, Claude might use either one (or mix them), so you can't
> tell them apart. For a clean comparison we make **only one bridge available per run**.

## Setup (do once)

1. Route your browser through Caido (use Caido's built-in browser, or set the browser proxy to
   `127.0.0.1:8080`).
2. Generate traffic: visit **https://labs.cai.do/tooManyRequests.php** and run the challenge.
3. Confirm Caido **History** has rows (if empty, your proxy isn't on → fix that first, or the AI finds nothing).

---

## Run A — MCP only

**A1. Make sure the MCP is registered and the Skill is NOT visible.**
```bash
claude mcp list        # caido must show ✔ Connected
```
Then launch Claude from a directory that has **no** `.agents/skills/` folder (so the skill can't load) —
e.g. your home directory:
```bash
cd ~
claude
```

**A2. Run the task and read the cost.** Inside Claude:
```
/mcp
/cost
check caido health
Check if there is a secret value in the caido history
/cost
```

**A3. Confirm it really used MCP:** you should see `caido_*` **tool-call chips**
(e.g. `caido_list_requests`, `caido_get_request`). **Count them** — that's the MCP "N tool calls" number.
Note the second `/cost` (input / output / cache tokens).

Exit Claude when done (`Ctrl-C` twice, or type `/exit`).

---

## Run B — Skill only

**B1. Unload the MCP** so Claude is forced to use the skill's CLI:
```bash
claude mcp remove caido
claude mcp list        # caido should NO LONGER be listed
```

**B2. Make sure the Skill is installed and authenticated** (from docs/02-setup-skill.md):
```bash
nvm use 24
cd /Users/akshanshjaiswal/Documents/projects/caido-ai-workshop   # a dir that HAS .agents/skills/
export CAIDO_URL=http://localhost:8080
export CAIDO_PAT=caido_...          # your PAT (never commit it)
npx tsx .agents/skills/caido-mode/caido-client.ts auth-status   # should show authenticated
```
> If you installed the skills elsewhere, run from that folder. The skill must be discoverable from the
> directory you launch `claude` in.

**B3. Run the SAME task and read the cost.** Launch Claude from that folder:
```bash
claude
```
Inside Claude:
```
/cost
check caido health
Check if there is a secret value in the caido history
/cost
```

**B4. Confirm it really used the Skill:** you should see it run `caido-client.ts …` **shell commands**
(not `caido_*` tool calls). **Count them** — that's the Skill "N shell commands" number.
Note the second `/cost`.

---

## Restore the MCP (after the comparison)

```bash
claude mcp add caido -s user -e CAIDO_URL=http://localhost:8080 -- /Users/akshanshjaiswal/Documents/projects/caidoaiproxy-workshop/caido-mcp-server/caido-mcp-server serve
claude mcp list        # caido ✔ Connected again
```
(Adjust the binary path to wherever yours lives.)

---

## Compare

| | MCP (Run A) | Skill (Run B) |
|---|---|---|
| How it acted | `caido_*` tool calls | `caido-client.ts` shell commands |
| Round-trips | count the tool calls | count the shell commands |
| Baseline context | heavy (~66 tool schemas always loaded) | light (instructions load on demand) |
| `/cost` tokens | usually higher | usually lower |

The exact counts vary per run — present the **pattern** (Skill leaner, MCP heavier), not a fixed number.
On a **subscription**, `/cost` may show `$0.00`; use the **token counts** and `/context` fill % instead.

## Trace what happened

```bash
/Users/akshanshjaiswal/Documents/projects/caido-ai-workshop/scripts/trace.sh
```
Shows the last session's tool calls, results, and token totals.

## Talk track

"Same job, two bridges — and I made sure each run could only use one. The Skill did it in fewer steps
with a lighter context. That's not a toy difference: at scale, context engineering is the whole cost story."
