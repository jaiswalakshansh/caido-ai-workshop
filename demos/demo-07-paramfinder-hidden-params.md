# Demo 07 — Hidden parameter & header mining with ParamFinder + AI triage  🔴 CRITICAL / HIGH

Undocumented parameters are where the juicy bugs hide: `debug=true`, `admin=1`, `?url=` (SSRF),
`?file=` (LFI), `?callback=` (XSS/JSONP), `?next=` (open redirect), unkeyed headers (cache poisoning).
Finding them is a brute-force job; knowing *which discovered param is actually exploitable* is judgment.
**ParamFinder** does the brute force; the **AI triages and weaponizes**.

**Real plugin:** [`caido-community/ParamFinder`](https://github.com/caido-community/ParamFinder)
— QUERY / BODY / HEADERS discovery; results land in **Findings**.
**MCP tools:** `caido_list_findings`, `caido_send_request` / `caido_batch_send`, `caido_create_finding`.

## Why it's hard to automate (and why this combo wins)

- ParamFinder finds that `?debug` is *accepted* — but not that `?debug=true` dumps a stack trace, or that
  a reflected `?callback` is XSS. The AI tests the discovered params for actual impact.
- Choosing the right target requests and the right wordlist per endpoint is context work the AI does well.

## Setup

1. Install **ParamFinder** (Caido → Plugins → Community Store → ParamFinder).
2. Upload a parameter wordlist in ParamFinder settings (e.g. SecLists `burp-parameter-names.txt`;
   the [`slcyber-tools`](https://github.com/caido-community/slcyber-tools) plugin also ships wordlists).
3. Have target traffic in history (run demo 04/08 first for a rich endpoint set).

## Run it

**Step 1 — AI picks targets (MCP):**
```
From caido history, pick the 10 most promising requests to test for hidden parameters: prefer endpoints that fetch resources, render templates, export data, redirect, or look like internal/admin APIs. For each, say whether to run ParamFinder in QUERY, BODY, or HEADERS mode and why.
```
**Step 2 — Run ParamFinder** on each (right-click request → ParamFinder, or command palette →
`Param Finder [QUERY|BODY|HEADERS]`). Discovered params appear in Findings.

**Step 3 — AI triages the discoveries (the payoff):**
```
Read the ParamFinder findings (caido_list_findings). For each discovered parameter, classify the likely bug class from its name and the endpoint, then TEST it in Caido:
- url/uri/dest/redirect/next  -> open redirect / SSRF (use the QuickSSRF canary from the demo 05 skill)
- file/path/template/include  -> LFI / path traversal / SSTI
- debug/test/admin/role/internal -> info disclosure / privilege toggle
- callback/jsonp/return        -> reflected XSS / JSONP leak
- unkeyed request headers       -> web cache poisoning
Send the probe variants with caido_batch_send, show me which parameters actually changed behavior, and rank by severity.
```
**Step 4 — file the real ones** as findings with the request + the behavior change as evidence.

## Human-in-the-loop & safety

- Keep ParamFinder rate-sane (it's a brute force) and in scope.
- The AI proposes probes; review destructive ones before sending. Confirm reflections manually before filing XSS.

## Success / impact

A hidden `?debug=true` leaking internals, a `?url=` that reaches your OAST canary (SSRF), or an unkeyed
header that poisons the cache — all commonly High/Critical, and invisible to anyone who only tests the
documented params.

## Talk track

"ParamFinder tells me a hidden `url` parameter exists. Big deal — until the AI immediately fires our SSRF
canary through it and the OAST watcher lights up. Discovery plus instant impact testing, in one flow."
