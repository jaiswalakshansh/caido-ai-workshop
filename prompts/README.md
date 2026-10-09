# Prompt library

Copy-paste prompts for each attack class. Replace `<ID>` with a Caido request id and set **Scope**
first so the agent stays in bounds. Prefer "show me the table before filing findings" so you keep the
human in the loop.

## Connection sanity
```
check caido health
What caido projects do I have
```

## Recon — map the app
```
Summarize the app's API from caido history: list unique endpoints (method + path), group by feature, and flag anything that looks sensitive (auth, admin, payment, user data, file upload, URL fetch).
```
```
Analyze file.js and create replay sessions with proper bodies for all endpoints found. Don't fix the content length. Don't send requests.
```

## Secrets / tokens
```
Check if there is a secret value in the caido history (API keys, JWTs, session tokens, passwords). For each, show the request it leaked in and whether it's reflected to other users.
```
```
Find JWTs in history. Decode them, flag weak/none alg, long expiry, sensitive claims, and whether the signature is verified server-side (try tampering a claim in Replay — don't send).
```

## IDOR / BOLA (demo 06)
```
In caido history, request <A_ID> is authenticated as victim A and <B_ID> as attacker B. For every in-scope endpoint referencing an object id, build 3 variants that swap ONLY credentials: A (baseline), B, and none. Send with caido_batch_send and diff against A. Flag any where B or none returns A's data or an unexpected 2xx. Show a table first.
```

## Blind SSRF (demo 07)
```
Our OAST canary is <URL>. Find every in-scope request with a URL-ish parameter (url, uri, redirect, next, callback, webhook, image, src, file, host, domain...). Replace that value with the canary and send through Caido with caido_batch_send. Tell me which request/param each injection came from.
```

## Race conditions (demo 08)
```
Request <ID> performs a single-use action. Use caido_race_window_send to send 20 synchronized last-byte copies. Report whether the limit was bypassed, from responses and post-state. Change nothing else.
```

## Mass assignment / authz (demo 09)
```
Take request <ID>. Add privilege fields the UI never sends (role=admin, isAdmin=true, verified=true, balance=...). Send each variant and report which the server accepts. Then probe discovered + inferred admin/debug endpoints with a normal token and with no token; table of what's reachable.
```

## GraphQL / gRPC (demo 10)
```
Find the GraphQL endpoint; try introspection, else reconstruct the schema from captured JS. List state-changing mutations and ones touching other users' objects.
```
```
Check the request with rpcids=<ID>. Reverse what it does, its params and response, from the JS in caido history. Draft a markdown report.
```

## Reporting
```
For the confirmed issues only, create a caido finding each (linked to the request) with title, severity, reproduction request, and impact. Then export all findings.
```
