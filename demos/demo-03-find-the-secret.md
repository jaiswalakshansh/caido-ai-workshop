# Demo 03 — Find the secret (and compare token cost)

**Goal:** AI reasons over your captured traffic to find a planted secret — then compare MCP vs Skill cost.
**Time:** ~5 min. **Bridge:** both (run it each way). **Targets:** secrets/tokens leaking in traffic.

## Setup

1. Route your browser through Caido (use Caido's built-in browser, or set the browser proxy to
   `127.0.0.1:8080`).
2. Generate traffic on a lab challenge:
   - Visit **https://labs.cai.do/tooManyRequests.php** and run the challenge.
3. Confirm **History** has rows in Caido (if empty, your proxy isn't actually on → fix that first).

## Run it

Warm-up (always do this before the real ask so you catch a bad connection early):
```
check caido health
```
The task:
```
Check if there is a secret value in the caido history
```

## Compare cost (the MCP-vs-Skill payoff)

Run the **same prompt** in two clean sessions and read `/cost` after each:

```
/cost          <- note the baseline
Check if there is a secret value in the caido history
/cost          <- note input/output/cache tokens
/context       <- note how full the window is
```

- **MCP session:** count the `caido_*` tool calls. Baseline context is heavy (~66 schemas loaded).
- **Skill session:** count the `caido-client.ts` shell commands. Context loads on demand.

Typically the Skill path uses fewer round-trips and lighter context → fewer tokens → cheaper.
(The exact counts vary per run; present the *pattern*, not a fixed number. On a subscription, `/cost`
may show `$0.00` — use the token counts and `/context` fill % instead.)

## Trace what happened

```bash
../scripts/trace.sh         # last session's tool calls, results, token totals
```

## Talk track

"Same job, two bridges. The Skill did it in fewer steps with a lighter context. That's not a toy
difference — at scale, across thousands of requests, context engineering is the whole cost story."
