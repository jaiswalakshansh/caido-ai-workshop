# Demo 09 — Mass assignment & hidden-endpoint authz  🔴 CRITICAL / HIGH

Two privilege-escalation classes that flow straight out of the JS recon in demo 04: (1) send fields the
client never shows you (`role`, `isAdmin`, `verified`, `balance`) and (2) hit undocumented endpoints
with the wrong (or no) privileges.
**Bridge:** MCP. **Targets:** mass assignment / BOPLA, broken function-level authz, debug/staging endpoints.

## Part A — Mass assignment (BOPLA)

The demo-04 sample `POST /users/add` body includes `"role": "user"`. What if you send `"role": "admin"`?

Setup: have the reconstructed `/users/add` (or your target's register/profile-update) request in Replay.

Run it:
```
Take the registration/profile request (caido request <ID>). Create replay variants that add or change privilege-related fields the UI never sends: role=admin, isAdmin=true, verified=true, emailVerified=true, accountType=premium, balance=100000, and any similar field you can infer from the JS or response shapes. Send each through Caido and tell me which ones the server accepts (reflected back or changed state). Don't touch other fields.
```

Success = the server honors a privilege field the client never exposes → vertical privilege escalation.

## Part B — Hidden / undocumented endpoint authz

From demo-04 the agent found endpoints (and a staging host `staging-api.labcommerce.internal`). Now test
whether they're protected.

Run it:
```
For every endpoint discovered from the JS (and any admin/debug/internal paths you can infer: /admin, /internal, /debug, /actuator, /metrics, /v1/users/{id}/roles, export/import endpoints), probe each with: (a) a normal user token, (b) no token. Report any that return 2xx or sensitive data without proper authorization. Use caido_batch_send; show me a table before filing anything.
```

Optionally check the staging host directly if it's in scope and resolvable.

## Why AI + Caido wins here

- The model infers *likely* privilege fields and admin paths from the JS and response shapes — far
  beyond a fixed wordlist.
- `caido_batch_send` tests the whole set with both identities at once; results land in History/Findings.

## Human-in-the-loop & safety

- Register/escalate only on **test accounts you own**. Show the acceptance table before filing findings.
- Treat any "it worked" as a lead to **verify** (re-read state as the escalated user), not an instant report.

## Success / impact

- Server accepts `role=admin` on registration → account takeover / privilege escalation (Critical).
- An admin/debug endpoint reachable by a normal or anonymous user → broken function-level authz (High/Critical).

## Talk track

"Demo 4 read the JS and found a `role` field the UI never lets you touch. Watch what happens when we
just… send `role=admin`. This is why reading the client is the highest-leverage recon there is."
