# Demo 07 — Blind SSRF at scale  🔴 CRITICAL

**Weaponize the skill you built in demo 05.** Generate one OAST canary, spray it into every URL-ish
parameter across your captured traffic, and watch for callbacks. A single DNS/HTTP hit = blind SSRF.
**Bridge:** Skill (QuickSSRF) + MCP (`caido_batch_send`). **Targets:** blind/semi-blind SSRF.

## The idea

Servers that fetch a URL you control (webhooks, image/avatar by URL, PDF/HTML renderers, link previews,
import-from-URL, `?redirect=`, `?next=`, XML/SSRF-able parsers) can be made to call *your* OAST URL.
Because it's blind, you don't see it in the response — you see it as an **out-of-band interaction**.

## Setup

1. QuickSSRF installed + `CAIDO_PAT` exported (demo 05).
2. Start the watcher so callbacks stream live, and grab the canary URL:
   ```bash
   cd skills/caido-quickssrf/scripts
   CAIDO_PAT=$CAIDO_PAT npx tsx quickssrf.ts --watch
   # copy the printed SSRF URL, e.g. https://abcd1234.oast.site
   ```

## Run it

```
Our OAST canary is https://abcd1234.oast.site .

1. In caido history (in scope), find every request with a parameter that could take a URL or host: names containing url, uri, link, redirect, next, callback, webhook, dest, image, img, src, avatar, file, path, feed, proxy, host, domain — in query, body (JSON/form), or headers.
2. For each, build a variant that replaces that parameter's value with the canary URL (and also try adding the canary as the value where a new param is plausible).
3. Send them through Caido with caido_batch_send.
4. Report which request/parameter you injected into, so we can correlate when a callback lands.
```

Watch the `--watch` terminal. Each interaction prints protocol + remote address + **full raw request
with headers**, so you can see which injection fired (use a unique sub-label per request if you want
clean attribution, e.g. `r12.abcd1234.oast.site`).

## Why AI + Caido wins here

- The model recognizes URL-ish params by *name and value shape* far better than a static wordlist.
- `caido_batch_send` sprays the canary across dozens of endpoints at once.
- QuickSSRF catches the out-of-band hit you'd otherwise never see — and records headers (great for
  proving server-side fetch vs. your own browser).

## Human-in-the-loop & safety

- Only inject into in-scope requests. The canary is passive (it just records hits) — safe to place.
- Don't point SSRF at third-party internal ranges unless the program's rules allow it; keep the canary
  external (interactsh/oast.site) so you only prove the fetch, not pivot.

## Success / impact

A callback hitting your canary, with the originating request identified → confirmed blind SSRF, usually
Critical (and a stepping stone to cloud-metadata/internal-service access where in scope).

## Talk track

"We built the SSRF skill an hour ago; now we point it at the whole app. One canary, every URL parameter,
fired through Caido. When that `oast.site` watcher lights up, that's a blind SSRF we would never have
seen in a response body."
