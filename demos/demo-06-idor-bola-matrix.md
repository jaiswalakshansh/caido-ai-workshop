# Demo 06 — IDOR / BOLA access-control matrix  🔴 CRITICAL / HIGH

**The single biggest bug-bounty category, automated.** Swap identities across every object-reference
endpoint and diff the responses. By hand this is hours of tedium; with Caido's batch sender it's seconds.
**Bridge:** MCP (uses `caido_batch_send`). **Targets:** IDOR / BOLA, missing object-level authz.

## The idea

For any endpoint like `GET /api/users/123` or `GET /api/orders/{id}`:
- **User A** (victim) owns object 123.
- **User B** (attacker) should NOT be able to read/modify it.
- **Unauthenticated** should get 401/403.

If B (or no-auth) gets A's data → **IDOR/BOLA**. The matrix = {A token, B token, no token} × {A's objects}.

## Setup

1. Create two test accounts: **A (victim)** and **B (attacker)**.
2. With the browser proxied through Caido, **log in and click around as A**, then **as B**, so Caido
   captures an authenticated request from each (you need both tokens/cookies in History).
3. Set **Scope** to the target host so the agent can't wander:
   ```
   create a caido scope "target" that allows only app.example.com and denies everything else
   ```

## Run it

Grounding note for the agent — tell it which request carries which identity:
```
In caido history, request <A_ID> is authenticated as victim user A and request <B_ID> is authenticated as attacker user B.

1. List every request in scope that references an object identifier (numeric ids, UUIDs, usernames) in the path, query, or body.
2. For each, build three variants that keep the method/path/body but swap ONLY the credentials: (a) user A's auth (baseline), (b) user B's auth, (c) no auth.
3. Send them with caido_batch_send and compare status + response length/shape against the A baseline.
4. Flag every endpoint where variant (b) or (c) returns A's data or a 2xx where a 401/403 was expected.
5. Produce a table: endpoint | A | B | none | verdict. Do NOT create findings yet — show me the table first.
```

Then, after you confirm the real ones:
```
For the confirmed IDORs only, create a caido finding each, linked to the request, titled "BOLA/IDOR: <endpoint>", with the diff as evidence.
```

## Why AI + Caido wins here

- `caido_batch_send` fires up to 50 variants in parallel — the whole matrix in one shot.
- The model is good at spotting "B got A's email/address" in a diff that a regex would miss.
- Everything is in History + Findings for the report; nothing is guesswork.

## Human-in-the-loop & safety

- Read-only (GET) sweeps first. Only escalate to state-changing verbs (PUT/DELETE) on explicit go, and
  on objects you own.
- The agent shows the table **before** filing findings — you confirm real vs. false positive.
- Scope fences it to the target host.

## Success / impact

A table of endpoints where cross-account access succeeded, each a filed finding with request-level
evidence. BOLA is OWASP API #1 — these are routinely High/Critical and pay well.

## Talk track

"This is the demo that earns its keep. Access control is the #1 API bug class, and it's death-by-tedium
by hand. The AI enumerates the object endpoints, the proxy fires the identity matrix, and we get a clean
verdict table — in under a minute."
