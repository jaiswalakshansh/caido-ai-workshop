# Demo 10 — GraphQL assault with GraphQL-Analyzer + AI  🔴 CRITICAL / HIGH

GraphQL hands the attacker one endpoint and a huge, self-describing schema — and a long list of
GraphQL-specific bugs most web scanners don't model: unauthenticated mutations, field-level authz gaps,
IDOR via `node(id:)`, alias/batching abuse (rate-limit & 2FA bypass, DoS), and introspection leakage.
The **GraphQL-Analyzer** plugin maps the schema; the **AI reasons over it** to find the dangerous
operations and tests them.

**Real plugin:** [`caido-community/GraphQL-Analyzer`](https://github.com/caido-community/GraphQL-Analyzer)
(schema discovery, visualization, security).
**MCP tools:** `caido_send_request`, `caido_batch_send`, `caido_create_finding`.

## Why it's hard to automate (and why this combo wins)

- The schema can have hundreds of types; which mutation is *dangerous* (`deleteUser`, `updateRole`,
  `impersonate`) and which query is *IDOR-prone* (`node(id:)`, `user(id:)`) is semantic reasoning the AI
  excels at — a scanner just sees "a POST endpoint."
- Alias/batch attacks need well-formed GraphQL the AI can generate on the fly from the discovered schema.

## Setup

1. Install **GraphQL-Analyzer** (Caido → Plugins → Community Store).
2. Proxy the target so its `/graphql` traffic is captured. Let GraphQL-Analyzer pull the schema (via
   introspection if enabled; otherwise from captured operations / persisted queries).

## Run it

**Step 1 — AI reads the schema for attack surface:**
```
Here is the GraphQL schema from GraphQL-Analyzer (or read the /graphql operations from caido history). List:
1. Mutations that change state or affect other users (create/update/delete/role/transfer/impersonate).
2. Queries that take an id and return a user-owned object (IDOR candidates: node(id:), user(id:), order(id:)).
3. Fields that look sensitive (email, token, ssn, secret, isAdmin).
Rank by blast radius.
```

**Step 2 — authz & IDOR tests:**
```
For the top IDOR-candidate queries, craft GraphQL queries that fetch another user's object by id, and run them with BOTH a low-priv token and no token via caido_batch_send. Flag any that return data they shouldn't. For the dangerous mutations, test whether they execute unauthenticated or as a low-priv user.
```

**Step 3 — batching / alias abuse:**
```
Build a single GraphQL request that uses aliases to call the sensitive query/mutation many times in one HTTP request (e.g. 100 aliased login attempts or OTP checks). Send it and tell me if server-side rate limiting / OTP throttling is bypassed, or if it causes disproportionate load (query-depth/complexity DoS).
```

**Step 4 — file findings** for unauthenticated/under-authorized operations, IDOR, and batching bypass.

## Human-in-the-loop & safety

- Alias/batch and complexity tests can be heavy — keep counts modest and in scope; get explicit go before
  anything that could degrade the service.
- Never run destructive mutations against data you don't own.

## Success / impact

- `node(id:)`/`user(id:)` returning other users' data → IDOR (High/Critical).
- A state-changing mutation callable unauthenticated or by the wrong role → broken authz (Critical).
- Aliased batching defeating login/OTP rate limits → auth bypass (High/Critical).

## Talk track

"One endpoint, a thousand-type schema. The plugin draws me the map; the AI instantly says 'these three
mutations change other users' data and these two queries are IDOR-shaped' — then writes the GraphQL to
prove it. That's hours of schema-reading compressed into one prompt."
