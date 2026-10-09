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

## Authorization / AuthMatrix (demo 06)
```
List every in-scope request that references an object or privileged action (ids in path/query/body, /admin, /billing, /users, /export). Output (method, path, which identity captured it) — these are the AuthMatrix rows.
```
```
Here is the AuthMatrix result grid. For each cell where a lower-priv or unauth identity got 2xx or another user's data, compare the body to the owner's and decide if it's a real authorization break. Table: endpoint | expected | actual-by-identity | verdict | evidence. Only flag real breaks.
```

## Hidden params / ParamFinder (demo 07)
```
From caido history, pick the 10 best requests to test for hidden parameters (resource fetch, template render, export, redirect, internal/admin). For each say QUERY, BODY, or HEADERS mode and why.
```
```
Read the ParamFinder findings. For each discovered param, classify the likely bug (url/redirect->SSRF/open-redirect, file/template->LFI/SSTI, debug/admin->info/priv, callback->XSS, unkeyed header->cache poisoning) and TEST it with caido_batch_send (use the QuickSSRF canary for SSRF). Show which params actually changed behavior, ranked by severity.
```

## Archive / Wayback recon (demo 08)
```
Here is urls.txt (historical/crawled URLs for <target>). Cluster and rank by bug potential: old API versions, *.json/*.xml data endpoints, admin/internal/debug/swagger/graphql, backup artifacts (.bak .old .zip .sql .env .git), auth/token/reset endpoints, interesting params. Give me the top 50 to probe, grouped by hypothesis. Skip static assets, filter to scope.
```
```
GET the top-50 (in scope) with caido_batch_send. Report which return 2xx or sensitive content, which old endpoints still work, which lack auth. Pull full responses for the sensitive live ones and assess impact.
```

## gRPC-web / protobuf (demo 09)
```
Request <ID> is gRPC-web/protobuf (or batchexecute rpcids=XXXX) on a live target. Read the app's JS in caido history and reconstruct the message schema: RPC/method name, each field number/type/meaning, request and response. Show the decoded request body.
```
```
Change <field>. Produce the correctly protobuf/grpc-web-encoded body, create a Caido replay session with it, but DON'T send. Show exact bytes/framing if base64/grpc-web framing is involved.
```

## GraphQL assault / GraphQL-Analyzer (demo 10)
```
Here is the GraphQL schema. List: (1) state-changing or cross-user mutations, (2) IDOR-candidate queries taking an id (node(id:), user(id:), order(id:)), (3) sensitive fields. Rank by blast radius.
```
```
For the top IDOR-candidate queries, craft GraphQL to fetch another user's object by id and run with a low-priv token AND no token via caido_batch_send; flag any that return data they shouldn't. Then build one aliased/batched request calling a sensitive op many times and tell me if rate limiting/OTP throttling is bypassed.
```

## Reporting
```
For the confirmed issues only, create a caido finding each (linked to the request) with title, severity, reproduction request, and impact. Then export all findings.
```
