# Demo 08 — Archive / Wayback recon → forgotten endpoints  🔴 CRITICAL / HIGH

Old, deprecated, and forgotten endpoints are a goldmine: `/api/v1` after the app moved to `v2`, debug
routes, backup files, retired auth flows that still work. Public archives (Wayback Machine, Common Crawl)
remember URLs the current site no longer links. The problem: you get **thousands** of historical URLs and
most are dead. Pulling them is a one-liner; **triaging which still respond and are dangerous is where the
AI + Caido earn their keep.**

**Tools:** `waybackurls`, `gau` (getallurls), `katana` (projectdiscovery) — all proxy through Caido.
**MCP tools:** `caido_batch_send`, `caido_list_requests`, `caido_create_finding`.
**Related plugins:** [`crawler`](https://github.com/caido-community/crawler) (live crawl to complement the archive),
[`ReDocs`](https://github.com/caido-community/ReDocs) (import OpenAPI/Postman as Replay sessions).

## Why it's hard to automate (and why this combo wins)

- Any tool dumps 5,000 historical URLs. Knowing that `/internal/v1/users/export.json` is interesting and
  `/static/old/logo.png` is not — and which of the live ones leak data — is judgment at scale. The AI
  triages; `caido_batch_send` probes in bulk; everything lands in Caido's searchable history.

## Setup

Install the fetchers (once):
```bash
go install github.com/tomnomnom/waybackurls@latest
go install github.com/lc/gau/v2/cmd/gau@latest
go install github.com/projectdiscovery/katana/cmd/katana@latest
```

## Run it

**Step 1 — pull the archive surface (through Caido so it's all captured):**
```bash
TARGET=example.com
waybackurls "$TARGET" | sort -u > urls.txt
gau "$TARGET" >> urls.txt
# live-crawl too, routed through Caido so results land in history:
katana -u "https://$TARGET" -proxy http://127.0.0.1:8080 -jc -d 3 -silent >> urls.txt
sort -u urls.txt -o urls.txt ; wc -l urls.txt
```

**Step 2 — AI triages the list (the hard part):**
```
Here is urls.txt (N historical/crawled URLs for example.com). Cluster and rank them by bug potential:
- old API versions (v1 when the app uses v2), *.json/*.xml data endpoints
- admin/internal/debug/actuator/swagger/graphql paths
- backup/temp artifacts (.bak .old .zip .sql .env .git config)
- auth/token/reset/invite endpoints
- anything with interesting query params
Give me the top 50 to probe, grouped by hypothesis. Skip static assets.
```

**Step 3 — probe the shortlist through Caido:**
```
Send GET for the top-50 (in scope only) with caido_batch_send. Report which return 2xx or sensitive content, which old endpoints still work, and which expose data or lack auth. For anything live and sensitive, pull the full response and assess impact.
```

**Step 4 — file findings** for live forgotten endpoints that leak data or bypass current auth.

## Human-in-the-loop & safety

- Only probe hosts **in scope** for your engagement — archives contain out-of-scope subdomains; have
  the AI filter to scope before sending anything.
- GET-only on discovery; no state changes on forgotten endpoints without explicit go.

## Success / impact

A still-live `/api/v1/users` after the app migrated to v2-with-auth, an exposed `.git/config`, or a
forgotten admin panel — classic High/Critical finds that pure black-box testing of the current site
never surfaces.

## Talk track

"The current site links to a few hundred URLs. The archive remembers tens of thousands — including the
ones they *meant* to remove. The AI reads five thousand forgotten URLs, picks the fifty that matter, and
Caido fires them. That's recon no human does by hand."
