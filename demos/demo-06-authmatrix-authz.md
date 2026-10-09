# Demo 06 — Authorization testing with AuthMatrix + AI  🔴 CRITICAL / HIGH

Broken access control is OWASP API #1 and the top bounty earner — and it's the hardest class to fully
automate, because deciding whether a 200 is a *leak* or a *legitimate* response needs judgment. We pair
the **AuthMatrix** plugin (deterministic grid of users × requests) with the AI (target selection +
semantic verdicts + exploit chaining).

**Real plugin:** [`caido-community/authmatrix`](https://github.com/caido-community/authmatrix)
(grid-based authz testing across users/roles, maintained by Caido's Sytten).
**Also useful:** [`authswap`](https://github.com/caido-community/authswap) (switch auth contexts fast).
**MCP tools:** `caido_batch_send`, `caido_list_requests`, `caido_create_finding`.

## Why it's hard to automate (and why this combo wins)

- A scanner can replay a request as another user, but it can't tell that "`200 OK` with *someone else's*
  invoice" is a bug while "`200 OK` with *empty list*" is fine. **The AI reads the response bodies and
  decides.**
- Enumerating which endpoints even *carry* an object reference, across a real app, is tedious — the AI
  does it from history in seconds.
- AuthMatrix makes the actual multi-identity replay **deterministic and repeatable** (the proven-tool
  lesson), so you're not trusting the LLM to get the mechanics right.

## Setup

1. Install **AuthMatrix** (Caido → Plugins → Community Store → AuthMatrix).
2. Create ≥2 real accounts with different privilege levels: e.g. **admin**, **user-A**, **user-B**,
   and keep an **unauthenticated** profile. Log in as each through Caido so a valid session for each is
   in history (AuthMatrix lets you register each user's auth).
3. Set **Scope** to the target host.

## Run it

**Step 1 — AI selects the test set (MCP):**
```
List every in-scope request that references an object or a privileged action: numeric/UUID ids in path/query/body, and anything under /admin, /settings, /billing, /users, /export. Output a deduped list of (method, path, which identity captured it) — these are the rows for AuthMatrix.
```
**Step 2 — Run AuthMatrix:** add those requests as rows, add your users/roles as columns, mark the
*expected* access, and run the grid. It fires each request as each identity and shows the result matrix.

**Step 3 — AI interprets the matrix (the hard part):**
```
Here is the AuthMatrix result grid (or: read the replayed entries from caido history for these requests under each user). For each cell where a lower-privileged or unauthenticated identity got a 2xx or returned data belonging to another user, decide whether it's a real authorization break (compare the body to the owner's). Produce: endpoint | expected | actual-by-identity | verdict | evidence. Only flag real breaks.
```
**Step 4 — confirm & file:**
```
For confirmed breaks only, create a caido finding each, linked to the request, titled "BOLA/BFLA: <endpoint>", severity high/critical, with the cross-identity diff as evidence.
```

## Human-in-the-loop & safety

- Read-only verbs first; escalate to PUT/DELETE only on objects you own, on explicit go.
- The AI presents the verdict table **before** filing — you confirm real vs. legitimate.

## Success / impact

A matrix showing user-B reading user-A's billing/PII, or a normal user hitting an admin function
(BFLA). These are routinely Critical/High.

## Talk track

"The plugin does the boring, deterministic part — replay every request as every user. The AI does the
part no scanner can: read the response and tell me whether that 200 is a leak. That division of labor is
the whole philosophy of this workshop."
