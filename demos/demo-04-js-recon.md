# Demo 04 — JS recon → reconstruct Replay sessions

**Goal:** have the AI read a minified JS bundle, extract the hidden API surface, and stage ready-to-fire
requests in Caido Replay.
**Time:** ~10 min. **Bridge:** both. **Targets:** undocumented endpoints & body shapes (recon that feeds every later demo).

## Why this matters

Front-end JS leaks the real API: endpoints, exact JSON body shapes, sometimes staging hosts and keys.
Reversing minified code by hand is slow; the AI does it in seconds and hands you Replay sessions.

## Setup

Use the included sample bundle:
```bash
cp sample-targets/labcommerce.min.js file.js
claude
```
(Original also at https://pastebin.com/raw/49QqTXaf.)

## Run it (note the two deliberate constraints)

```
Analyze the file.js and create replay session with proper bodies for all endpoints found. Don't fix the content length. Don't send requests.
```

- **"Don't fix the content length"** — keep the request exactly as reconstructed (tests precise
  instruction-following; auto-fixing can also mask request-smuggling/desync bugs).
- **"Don't send requests"** — human-in-the-loop: the AI *stages*, you fire.

## What you should get

Four endpoints staged in Replay, with bodies:
- `POST /products/add`
- `POST /carts/add`
- `POST /recipes/add`
- `POST /users/add`  ← body carries fake PII + a `role` field (feeds demo 09 mass-assignment)

Plus the base-URL logic it should surface: prod `https://dummyjson.com` vs
`https://staging-api.labcommerce.internal`, toggled by `USE_STAGING` (a staging host is itself a lead).

## Verify

Open Caido → **Replay** and show the four staged sessions. Nothing was sent.

## Talk track

"In ten seconds it read obfuscated JS and gave me the undocumented API with valid bodies, staged but
not fired. That recon is the launchpad for the high-impact demos next."
